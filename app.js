// Статьи (articles.html). Общие помощники — в sit.js.

// Настройка marked для поддержки подсветки синтаксиса
if (typeof marked !== 'undefined') marked.setOptions({
    highlight: function(code, lang) {
        if (typeof Prism !== 'undefined' && Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
    }
});

// Состояние списка статей
const articlesState = { tag: null, query: '' };

async function loadArticleContent(fileName) {
    try {
        const response = await fetch(`articles/${fileName}`);
        if (!response.ok) {
            throw new Error(`статус ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Ошибка загрузки статьи:', error);
        return `# Статья не загрузилась\n\nПроверьте соединение и обновите страницу. Техническая причина: ${error.message}.`;
    }
}

// ---------- Список статей ----------

function articlesView(name) {
    document.querySelector('[data-view="list"]').hidden = name !== 'list';
    document.querySelector('[data-view="article"]').hidden = name !== 'article';
}

async function renderArticlesSidebar() {
    const sidebar = document.querySelector('[data-topics-sidebar]');
    if (!sidebar) return;
    const articles = await sitLoadArticles();
    const item = (tag, label, count) => `
        <button type="button" class="sidebar-item${articlesState.tag === tag ? ' active' : ''}" data-tag="${tag ? sitEscape(tag) : ''}">
            ${sitEscape(label)} <small>${count}</small>
        </button>`;
    sidebar.innerHTML = '<p class="sidebar-title">Темы</p>'
        + item(null, 'Все темы', articles.length)
        + sitTopics(articles).map(([tag, n]) => item(tag, tag, n)).join('');
}

async function renderArticlesList() {
    const list = document.querySelector('[data-articles-list]');
    const status = document.querySelector('[data-list-status]');
    const articles = await sitLoadArticles();
    const q = articlesState.query.trim().toLowerCase();
    const filtered = sitByDate(articles).filter((a) => {
        const byTag = !articlesState.tag || a.tags.includes(articlesState.tag);
        const byQuery = !q || [a.title, a.preview, ...a.tags].join(' ').toLowerCase().includes(q);
        return byTag && byQuery;
    });

    if (!articles.length) {
        list.innerHTML = `<div class="error-message"><h2>Статьи не загрузились</h2><p>Проверьте соединение и повторите попытку.</p><button type="button" onclick="location.reload()">Обновить страницу</button></div>`;
        return;
    }
    list.innerHTML = filtered.map(sitArticleRow).join('')
        || '<div class="no-results"><h2>Ничего не нашлось</h2><p>Выберите другую тему или измените запрос.</p></div>';
    if (status) {
        const where = articlesState.tag ? ` в теме «${articlesState.tag}»` : '';
        status.textContent = `Показано статей: ${filtered.length}${where}`;
    }
}

function setArticlesTag(tag) {
    articlesState.tag = tag || null;
    const url = tag ? `articles.html?tag=${encodeURIComponent(tag)}` : 'articles.html';
    history.replaceState(null, '', url);
    renderArticlesSidebar();
    renderArticlesList();
}

// ---------- Полная статья ----------

async function showFullArticle(articleId) {
    const articles = await sitLoadArticles();
    const article = articles.find(a => a.id === articleId);
    const view = document.querySelector('[data-view="article"]');
    if (!article) {
        articlesView('article');
        view.innerHTML = `<button class="back-link" type="button" onclick="showArticlesList()">${backIcon()} Все статьи</button>
            <div class="no-results"><h2>Такой статьи нет</h2><p>Возможно, ссылка устарела. Вернитесь к списку и найдите статью через поиск.</p></div>`;
        return;
    }

    const content = await loadArticleContent(article.file);
    // Похожие: больше общих тем — выше, при равенстве свежие первыми
    const shared = (a) => a.tags.filter(t => article.tags.includes(t)).length;
    const related = sitByDate(articles)
        .filter(a => a.id !== article.id && shared(a) > 0)
        .sort((a, b) => shared(b) - shared(a))
        .slice(0, 3);

    view.innerHTML = `
        <article class="article-page">
            <button class="back-link" type="button" onclick="showArticlesList()">${backIcon()} Все статьи</button>
            <header class="article-head">
                <div class="article-kicker">${sitEscape(article.tags.join(', '))}</div>
                <h1>${sitEscape(article.title)}</h1>
                <p class="summary">${sitEscape(article.preview)}</p>
                <div class="article-byline">
                    <span><strong>${sitEscape(article.author)}</strong></span>
                    <span>${sitFormatDate(article.date)}</span>
                </div>
            </header>
            <div class="article-body article-content markdown-body">
                ${marked.parse(content)}
            </div>
            <div class="article-actions">
                <button onclick="showArticlesList()" class="button button-secondary" type="button">Все статьи</button>
                <button onclick="shareArticle(${article.id})" class="button button-secondary" type="button" data-share>Скопировать ссылку</button>
            </div>
            ${related.length ? `
            <section class="related">
                <div class="section-heading"><h2>Читайте также</h2></div>
                <div class="article-list">${related.map(sitArticleTile).join('')}</div>
            </section>` : ''}
        </article>
    `;
    document.title = `${article.title} | S.I.T Education`;
    articlesView('article');
    window.scrollTo({ top: 0 });

    // Таблицы прокручиваются по горизонтали, код подсвечивается
    view.querySelectorAll('.article-content table').forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
    sitDropDuplicateTitle(view.querySelector('.article-body'), article.title);
    view.querySelectorAll('.article-content pre code').forEach(sitHighlight);
}

function backIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
}

function showArticlesList() {
    document.title = 'Статьи | S.I.T Education';
    history.pushState(null, '', articlesState.tag ? `articles.html?tag=${encodeURIComponent(articlesState.tag)}` : 'articles.html');
    articlesView('list');
    window.scrollTo({ top: 0 });
}

async function shareArticle(articleId) {
    const articleUrl = new URL(`articles.html?article=${articleId}`, location.href).href;
    const button = document.querySelector('[data-share]');
    try {
        await navigator.clipboard.writeText(articleUrl);
        if (button) {
            button.textContent = 'Ссылка скопирована';
            setTimeout(() => { button.textContent = 'Скопировать ссылку'; }, 2000);
        }
    } catch (err) {
        if (button) button.textContent = 'Скопируйте адрес из строки браузера';
    }
}

async function initArticlesPage() {
    const params = new URLSearchParams(location.search);
    articlesState.tag = params.get('tag');

    renderArticlesSidebar();
    renderArticlesList();

    document.querySelector('[data-topics-sidebar]').addEventListener('click', (e) => {
        const button = e.target.closest('[data-tag]');
        if (button) setArticlesTag(button.dataset.tag);
    });
    const search = document.getElementById('searchInput');
    search.addEventListener('input', debounce(() => {
        articlesState.query = search.value;
        renderArticlesList();
    }, 200));

    // Клик по статье открывает её без перезагрузки
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-article-id]');
        if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        const id = parseInt(link.dataset.articleId);
        history.pushState(null, '', `articles.html?article=${id}`);
        showFullArticle(id);
    });

    window.addEventListener('popstate', () => {
        const id = new URLSearchParams(location.search).get('article');
        if (id) showFullArticle(parseInt(id));
        else articlesView('list');
    });

    if (params.get('random') === 'true') {
        const articles = await sitLoadArticles();
        if (articles.length) {
            const pick = articles[Math.floor(Math.random() * articles.length)];
            history.replaceState(null, '', `articles.html?article=${pick.id}`);
            showFullArticle(pick.id);
        }
    } else if (params.get('article')) {
        showFullArticle(parseInt(params.get('article')));
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-articles-list]')) initArticlesPage();
});
