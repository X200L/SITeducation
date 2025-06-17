// Настройка marked для поддержки подсветки синтаксиса
marked.setOptions({
    highlight: function(code, lang) {
        if (Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
    }
});

class WikiManager {
    constructor() {
        this.wikiContainer = document.getElementById('wikiList');
        this.searchInput = document.getElementById('wikiSearch');
        this.categoryButtons = document.querySelectorAll('.filter-tag');
        this.categoryList = document.getElementById('categoryList');
        this.currentCategory = 'all';
        this.wikiItems = [];

        this.init();
    }

    async init() {
        await this.loadWikiItems();
        this.setupEventListeners();
        this.renderCategories();
    }

    async loadWikiItems() {
        try {
            const response = await fetch('wiki/index.json');
            const wikiIndex = await response.json();
            this.wikiItems = wikiIndex.items;
            this.renderWikiItems(this.wikiItems);
        } catch (error) {
            console.error('Ошибка загрузки базы знаний:', error);
            this.showError();
        }
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterWikiItems());
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentCategory = button.dataset.category;
                this.filterWikiItems();
            });
        });
    }

    renderCategories() {
        const categories = [...new Set(this.wikiItems.map(item => item.category))];
        this.categoryList.innerHTML = `
            <button class="filter-tag active" data-category="all">
                Все
            </button>
            ${categories.map(category => `
                <button class="filter-tag" data-category="${category}">
                    ${this.getCategoryName(category)}
                </button>
            `).join('')}
        `;
    }

    getCategoryName(category) {
        const categoryNames = {
            'programming': 'Программирование',
            'data': 'Анализ данных',
            'security': 'Безопасность',
            'cloud': 'Облачные технологии',
            'ai': 'Искусственный интеллект',
            'blockchain': 'Блокчейн'
        };
        return categoryNames[category] || category;
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

    async loadWikiContent(id) {
        try {
            const response = await fetch(`wiki/${id}.md`);
            if (!response.ok) {
                throw new Error(`Статья не найдена (статус: ${response.status})`);
            }
            const content = await response.text();
            return marked.parse(content);
        } catch (error) {
            console.error('Ошибка загрузки содержимого:', error);
            return `<div class="error-message">
                <h2>Ошибка загрузки статьи</h2>
                <p>${error.message}</p>
                <button onclick="wikiManager.showFullWiki('${id}')">Попробовать снова</button>
            </div>`;
        }
    }

    renderWikiItems(items) {
        if (items.length === 0) {
            this.wikiContainer.innerHTML = `
                <div class="no-results">
                    <h2>Материалы не найдены</h2>
                    <p>Попробуйте изменить параметры поиска</p>
                </div>
            `;
            return;
        }

        this.wikiContainer.innerHTML = items.map(item => `
            <article class="wiki-card" data-category="${item.category}">
                <div class="wiki-card-content">
                    <h2 class="wiki-title">${item.title}</h2>
                    <p class="wiki-description">${item.description}</p>
                    <div class="wiki-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="wiki-meta">
                        <span class="wiki-category">
                            <i class="fas fa-folder"></i>
                            ${this.getCategoryName(item.category)}
                        </span>
                    </div>
                    <button class="read-more" onclick="wikiManager.showFullWiki('${item.id}')">
                        Подробнее
                    </button>
                </div>
            </article>
        `).join('');
    }

    async showFullWiki(id) {
        const content = await this.loadWikiContent(id);
        const modal = document.createElement('div');
        modal.className = 'wiki-modal';
        modal.innerHTML = `
            <div class="wiki-modal-content">
                <button class="close-modal" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="wiki-full-content markdown-body">
                    ${content}
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Добавляем обработку изображений для адаптивности
        modal.querySelectorAll('img').forEach(img => {
            img.classList.add('responsive-img');
            const wrapper = document.createElement('div');
            wrapper.className = 'img-wrapper';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
        });

        // Добавляем обработку таблиц для адаптивности
        modal.querySelectorAll('table').forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });

        // Добавляем обработку блоков кода для адаптивности и подсветки синтаксиса
        modal.querySelectorAll('pre code').forEach((block) => {
            block.classList.add('responsive-code');
            const wrapper = document.createElement('div');
            wrapper.className = 'code-wrapper';
            block.parentNode.parentNode.insertBefore(wrapper, block.parentNode);
            wrapper.appendChild(block.parentNode);
            
            // Определяем язык программирования из класса
            const lang = block.className.replace('language-', '');
            if (Prism.languages[lang]) {
                Prism.highlightElement(block);
            }
        });
    }

    showError() {
        this.wikiContainer.innerHTML = `
            <div class="error-message">
                <h2>Ошибка загрузки базы знаний</h2>
                <p>Пожалуйста, попробуйте позже</p>
                <button onclick="wikiManager.loadWikiItems()">Повторить попытку</button>
            </div>
        `;
    }
}

// Инициализация при загрузке страницы
let wikiManager;
document.addEventListener('DOMContentLoaded', () => {
    wikiManager = new WikiManager();
}); 