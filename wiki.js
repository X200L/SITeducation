// База знаний: список справочников и страница справочника (wiki.html?item=id).

// Настройка marked для поддержки подсветки синтаксиса
marked.setOptions({
    highlight: function(code, lang) {
        if (typeof Prism !== 'undefined' && Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
    }
});

const WIKI_CATEGORIES = {
    programming: 'Программирование',
    electronics: 'Электроника',
    frameworks: 'Фреймворки',
    tools: 'Инструменты',
    data: 'Анализ данных',
    security: 'Безопасность',
    cloud: 'Облачные технологии',
    ai: 'Искусственный интеллект',
    blockchain: 'Блокчейн',
};

class WikiManager {
    constructor() {
        this.wikiContainer = document.getElementById('wikiList');
        this.searchInput = document.getElementById('wikiSearch');
        this.categoryList = document.getElementById('categoryList');
        this.listView = document.querySelector('[data-view="list"]');
        this.itemView = document.querySelector('[data-view="item"]');
        this.currentCategory = 'all';
        this.wikiItems = [];

        this.init();
    }

    async init() {
        await this.loadWikiItems();
        this.renderCategories();
        this.setupEventListeners();
        const id = new URLSearchParams(location.search).get('item');
        if (id) this.showFullWiki(id, false);
    }

    async loadWikiItems() {
        this.wikiItems = await sitLoadWiki();
        if (!this.wikiItems.length) {
            this.showError();
            return;
        }
        document.querySelectorAll('[data-wiki-count]').forEach((el) => { el.textContent = this.wikiItems.length; });
        this.renderWikiItems(this.wikiItems);
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterWikiItems());
        // Кнопки категорий рисуются позже, поэтому слушаем клики на списке
        this.categoryList.addEventListener('click', (e) => {
            const button = e.target.closest('.filter-tag');
            if (!button) return;
            this.categoryList.querySelectorAll('.filter-tag').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            this.currentCategory = button.dataset.category;
            this.filterWikiItems();
        });
        // Справочник открывается без перезагрузки страницы
        this.wikiContainer.addEventListener('click', (e) => {
            const link = e.target.closest('[data-wiki-id]');
            if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
            e.preventDefault();
            this.showFullWiki(link.dataset.wikiId);
        });
        window.addEventListener('popstate', () => {
            const id = new URLSearchParams(location.search).get('item');
            if (id) this.showFullWiki(id, false);
            else this.showList(false);
        });
    }

    renderCategories() {
        const categories = [...new Set(this.wikiItems.map(item => item.category))];
        const count = (c) => this.wikiItems.filter(i => i.category === c).length;
        this.categoryList.innerHTML = `
            <p class="sidebar-title">Разделы</p>
            <button type="button" class="filter-tag active" data-category="all">
                Все <small>${this.wikiItems.length}</small>
            </button>
            ${categories.map(category => `
                <button type="button" class="filter-tag" data-category="${category}">
                    ${this.getCategoryName(category)} <small>${count(category)}</small>
                </button>
            `).join('')}
        `;
    }

    getCategoryName(category) {
        return WIKI_CATEGORIES[category] || category;
    }

    filterWikiItems() {
        const searchQuery = this.searchInput.value.toLowerCase();
        const filteredItems = this.wikiItems.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                                item.description.toLowerCase().includes(searchQuery) ||
                                item.tags.some(tag => tag.toLowerCase().includes(searchQuery));
            const matchesCategory = this.currentCategory === 'all' ||
                                  item.category === this.currentCategory;
            return matchesSearch && matchesCategory;
        });

        this.renderWikiItems(filteredItems);
    }

    renderWikiItems(items) {
        if (items.length === 0) {
            this.wikiContainer.innerHTML = `
                <div class="no-results">
                    <h2>Ничего не нашлось</h2>
                    <p>Выберите другой раздел или измените запрос.</p>
                </div>
            `;
            return;
        }

        this.wikiContainer.innerHTML = items.map((item, i) => `
            <a class="article-tile" href="wiki.html?item=${encodeURIComponent(item.id)}" data-wiki-id="${sitEscape(item.id)}">
                <div class="tile-meta">
                    <span class="tile-subject">${this.getCategoryName(item.category)}</span>
                    <span class="tile-date">${sitEscape(item.tags.slice(0, 3).join(', '))}</span>
                </div>
                <div class="tile-body">
                    <h3>${sitEscape(item.title)}</h3>
                    <p>${sitEscape(item.description)}</p>
                </div>
                <div class="tile-foot">
                    <span class="round-arrow">${SIT_ARROW}</span>
                    <img class="tile-art" src="images/patterns/pattern-${SIT_PATTERNS[i % SIT_PATTERNS.length]}.svg" alt="" loading="lazy">
                </div>
            </a>
        `).join('');
    }

    async loadWikiContent(id) {
        try {
            const response = await fetch(`wiki/${id}.md`);
            if (!response.ok) {
                throw new Error(`статус ${response.status}`);
            }
            return marked.parse(await response.text());
        } catch (error) {
            console.error('Ошибка загрузки содержимого:', error);
            return `<div class="error-message">
                <h2>Справочник не загрузился</h2>
                <p>Проверьте соединение и повторите попытку (${sitEscape(error.message)}).</p>
                <button type="button" onclick="wikiManager.showFullWiki('${sitEscape(id)}', false)">Повторить</button>
            </div>`;
        }
    }

    async showFullWiki(id, push = true) {
        const item = this.wikiItems.find(i => i.id === id);
        if (push) history.pushState(null, '', `wiki.html?item=${encodeURIComponent(id)}`);
        const content = await this.loadWikiContent(id);
        const title = item ? item.title : id;

        this.itemView.innerHTML = `
            <article class="article-page">
                <button class="back-link" type="button" onclick="wikiManager.showList()">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg> База знаний
                </button>
                <header class="article-head">
                    <div class="article-kicker">${item ? this.getCategoryName(item.category) : 'База знаний'}</div>
                    <h1>${sitEscape(title)}</h1>
                    ${item ? `<p class="summary">${sitEscape(item.description)}</p>` : ''}
                    ${item ? `<div class="article-byline"><span><strong>${sitEscape(item.author)}</strong></span><div class="chips">${item.tags.map(t => `<span>${sitEscape(t)}</span>`).join('')}</div></div>` : ''}
                </header>
                <div class="article-body markdown-body">${content}</div>
            </article>
        `;
        document.title = `${title} | База знаний S.I.T Education`;
        this.listView.hidden = true;
        this.itemView.hidden = false;
        window.scrollTo({ top: 0 });

        this.itemView.querySelectorAll('.markdown-body table').forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
        sitDropDuplicateTitle(this.itemView.querySelector('.article-body'), title);
        this.itemView.querySelectorAll('pre code').forEach(sitHighlight);
    }

    showList(push = true) {
        if (push) history.pushState(null, '', 'wiki.html');
        document.title = 'База знаний | S.I.T Education';
        this.itemView.hidden = true;
        this.listView.hidden = false;
        window.scrollTo({ top: 0 });
    }

    showError() {
        this.wikiContainer.innerHTML = `
            <div class="error-message">
                <h2>База знаний не загрузилась</h2>
                <p>Проверьте соединение и повторите попытку.</p>
                <button type="button" onclick="location.reload()">Обновить страницу</button>
            </div>
        `;
    }
}

// Инициализация при загрузке страницы
let wikiManager;
document.addEventListener('DOMContentLoaded', () => {
    wikiManager = new WikiManager();
});
