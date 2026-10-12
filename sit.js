// Общее поведение страниц: хедер, мобильное меню, тема, поиск по сайту.

// Корень сайта — по адресу этого скрипта (страницы лежат и в подпапках, например vimTrainer/)
const SIT_BASE = new URL('.', document.currentScript.src).href;

const SIT_ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const SIT_PATTERNS = ['21', '22', '23', '24', '26'];

(function () {
    const header = document.querySelector('[data-header]');
    const menuButton = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');

    // Хедер становится «стеклянным» после начала прокрутки
    if (header) {
        const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    function setMenu(open) {
        if (!menuButton || !menu) return;
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
        menu.classList.toggle('is-open', open);
        menu.setAttribute('aria-hidden', String(!open));
        menu.inert = !open;
        document.body.classList.toggle('menu-open', open);
    }

    if (menuButton && menu) {
        menu.inert = true;
        menuButton.addEventListener('click', () => {
            setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
        });
        menu.addEventListener('click', (e) => {
            if (e.target.closest('a')) setMenu(false);
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1140) setMenu(false);
        });
    }

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.addEventListener('click', () => toggleTheme());
    });

    document.querySelectorAll('[data-year]').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });

    const pageSearch = document.querySelector('[data-search]');
    document.addEventListener('keydown', (e) => {
        const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)
            || document.activeElement.isContentEditable;
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            sitOpenSearch();
        } else if (e.key === '/' && !typing) {
            // «/» — поиск по текущему списку, если он есть, иначе по сайту
            e.preventDefault();
            if (pageSearch) pageSearch.focus();
            else sitOpenSearch();
        } else if (e.key === 'Escape') {
            setMenu(false);
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-search-open]')) {
            setMenu(false);
            sitOpenSearch();
        }
    });
})();

// ---------- Общие помощники ----------

function sitFormatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).replace(' г.', '');
}

function sitEscape(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function sitByDate(list) {
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
}

let sitArticlesPromise;
function sitLoadArticles() {
    sitArticlesPromise = sitArticlesPromise || fetch(SIT_BASE + 'articles.json')
        .then((r) => r.json())
        .then((d) => d.articles)
        .catch(() => []);
    return sitArticlesPromise;
}

let sitWikiPromise;
function sitLoadWiki() {
    sitWikiPromise = sitWikiPromise || fetch(SIT_BASE + 'wiki/index.json')
        .then((r) => r.json())
        .then((d) => d.items)
        .catch(() => []);
    return sitWikiPromise;
}

// Плитка статьи в стиле Сириус Wiki: тема и дата, заголовок, круглая стрелка, узор в углу
function sitArticleTile(article, i = 0) {
    const art = SIT_PATTERNS[i % SIT_PATTERNS.length];
    return `
        <a class="article-tile" href="${SIT_BASE}articles.html?article=${article.id}" data-article-id="${article.id}">
            <div class="tile-meta">
                <span class="tile-subject">${sitEscape(article.tags[0] || 'Статья')}</span>
                <span class="tile-date">${sitFormatDate(article.date)}</span>
            </div>
            <div class="tile-body">
                <h3>${sitEscape(article.title)}</h3>
                <p>${sitEscape(article.preview)}</p>
            </div>
            <div class="tile-foot">
                <span class="round-arrow">${SIT_ARROW}</span>
                <img class="tile-art" src="${SIT_BASE}images/patterns/pattern-${art}.svg" alt="" loading="lazy">
            </div>
        </a>`;
}

// Строка статьи в списке раздела
function sitArticleRow(article) {
    return `
        <a class="entry-row" href="${SIT_BASE}articles.html?article=${article.id}" data-article-id="${article.id}">
            <span class="entry-label">${sitEscape(article.tags[0] || 'Статья')}<small>${sitFormatDate(article.date)}</small></span>
            <div>
                <h3>${sitEscape(article.title)}</h3>
                <p>${sitEscape(article.preview)}</p>
            </div>
            <svg class="entry-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>`;
}

// Темы статей с количеством, самые частые первыми
function sitTopics(articles) {
    const counts = new Map();
    articles.forEach((a) => a.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'));
}

// Markdown часто начинается с того же заголовка, что уже стоит в шапке страницы — убираем повтор
function sitDropDuplicateTitle(body, title) {
    const first = body.firstElementChild;
    const norm = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    if (first && first.tagName === 'H1' && norm(first.textContent) === norm(title)) first.remove();
}

// Подсветка кода Prism. В Markdown встречаются ```arduino и ```html —
// у Prism это cpp и markup.
function sitHighlight(block) {
    if (typeof Prism === 'undefined') return;
    const aliases = { arduino: 'cpp', ino: 'cpp', html: 'markup', xml: 'markup', sh: 'bash', js: 'javascript', py: 'python' };
    const cls = [...block.classList].find((c) => c.startsWith('language-'));
    if (!cls) return;
    const lang = aliases[cls.slice(9)] || cls.slice(9);
    if (!Prism.languages[lang]) return;
    block.classList.remove(cls);
    block.classList.add(`language-${lang}`);
    Prism.highlightElement(block);
}

// ---------- Поиск по сайту (Ctrl/⌘ K) ----------

const SIT_PAGES = [
    { title: 'Статьи', label: 'Раздел', href: 'articles.html', text: 'туториалы разборы заметки' },
    { title: 'База знаний', label: 'Раздел', href: 'wiki.html', text: 'справочники шпаргалки' },
    { title: 'Курсы', label: 'Раздел', href: 'courses.html', text: 'arduino frontend vim уроки' },
    { title: 'VIM-тренажёр', label: 'Курс', href: 'vimTrainer/index.html', text: 'vim горячие клавиши' },
    { title: 'Проекты', label: 'Раздел', href: 'projects.html', text: 'проекты команды' },
    { title: 'Олимпиады и конкурсы', label: 'Раздел', href: 'olympiads.html', text: 'олимпиады конкурсы хакатоны рсош соревнования' },
    { title: 'Команда', label: 'Раздел', href: 'team.html', text: 'участники авторы' },
    { title: 'FgSNotes', label: 'Редактор статей', href: 'https://github.com/ArduRadioKot/FgSNotes', text: 'написать статью markdown редактор' },
];

let sitSearchIndex;
async function sitBuildSearchIndex() {
    if (sitSearchIndex) return sitSearchIndex;
    const [articles, wiki, olympiads] = await Promise.all([
        sitLoadArticles(),
        sitLoadWiki(),
        fetch(SIT_BASE + 'olympiads.json').then((r) => r.json()).catch(() => ({ directions: [] })),
    ]);
    const typeLabel = { rsosh: 'РСОШ', olymp: 'Олимпиада', contest: 'Конкурс' };
    sitSearchIndex = [
        ...sitByDate(articles).map((a) => ({
            title: a.title,
            label: `Статья · ${a.tags[0] || ''}`,
            href: `articles.html?article=${a.id}`,
            text: `${a.preview} ${a.tags.join(' ')}`,
        })),
        ...wiki.map((w) => ({
            title: w.title,
            label: 'База знаний',
            href: `wiki.html?item=${encodeURIComponent(w.id)}`,
            text: `${w.description} ${w.tags.join(' ')}`,
        })),
        ...olympiads.directions.flatMap((d) => d.items.map((o) => ({
            title: o.sub ? `${o.name}: ${o.sub}` : o.name,
            label: `${typeLabel[o.type]} · ${d.title}`,
            href: `olympiads.html?q=${encodeURIComponent(o.name)}#${d.id}`,
            text: `${o.site} олимпиада конкурс`,
        }))),
        ...SIT_PAGES,
    ];
    return sitSearchIndex;
}

function sitSearchScore(item, tokens) {
    const title = item.title.toLowerCase();
    const text = item.text.toLowerCase();
    let score = 0;
    for (const t of tokens) {
        if (title.includes(t)) score += title.startsWith(t) ? 6 : 4;
        else if (text.includes(t)) score += 1;
        else return 0;
    }
    return score;
}

async function sitRenderSearch(query) {
    const results = document.querySelector('[data-search-results]');
    if (!results) return;
    const index = await sitBuildSearchIndex();
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const rows = tokens.length
        ? index
            .map((item) => ({ item, score: sitSearchScore(item, tokens) }))
            .filter((r) => r.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((r) => r.item)
        : index.slice(0, 8);
    results.innerHTML = rows.slice(0, 14).map((item, i) => `
        <a class="search-result${i === 0 ? ' is-active' : ''}" href="${/^https?:/.test(item.href) ? item.href : SIT_BASE + item.href}">
            <strong>${sitEscape(item.title)}</strong>
            <span>${sitEscape(item.label)}</span>
        </a>`).join('')
        || `<div class="search-empty">По запросу «${sitEscape(query)}» ничего нет. Попробуйте другое слово или откройте <a class="text-link" href="${SIT_BASE}articles.html">все статьи</a>.</div>`;
}

function sitOpenSearch() {
    const dialog = document.querySelector('[data-search-dialog]');
    if (!dialog || dialog.open) return;
    const input = dialog.querySelector('[data-search-input]');
    input.value = '';
    sitRenderSearch('');
    dialog.showModal();
    input.focus();
}

(function () {
    const dialog = document.querySelector('[data-search-dialog]');
    if (!dialog) return;
    const input = dialog.querySelector('[data-search-input]');
    input.addEventListener('input', () => sitRenderSearch(input.value));
    // Стрелки двигают выделение, Enter открывает выбранный результат
    input.addEventListener('keydown', (e) => {
        const items = [...dialog.querySelectorAll('.search-result')];
        if (!items.length) return;
        let i = items.findIndex((el) => el.classList.contains('is-active'));
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            items[i]?.classList.remove('is-active');
            i = (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
            items[i].classList.add('is-active');
            items[i].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            (items[i] || items[0]).click();
        }
    });
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog || e.target.closest('[data-search-close]')) dialog.close();
        if (e.target.closest('.search-result')) dialog.close();
    });
})();

// ---------- Главная ----------

(async function () {
    const latest = document.querySelector('[data-latest-articles]');
    const topics = document.querySelector('[data-topics]');
    if (!latest && !topics) return;
    const articles = await sitLoadArticles();
    if (!articles.length) {
        if (latest) latest.innerHTML = '<div class="empty-state">Статьи не загрузились. Обновите страницу или откройте <a class="text-link" href="articles.html">список статей</a>.</div>';
        return;
    }
    if (latest) latest.innerHTML = sitByDate(articles).slice(0, 6).map(sitArticleTile).join('');
    document.querySelectorAll('[data-article-count]').forEach((el) => { el.textContent = articles.length; });
    if (topics) {
        topics.innerHTML = sitTopics(articles).map(([tag, n]) =>
            `<a class="topic" href="articles.html?tag=${encodeURIComponent(tag)}">${sitEscape(tag)} <small>${n}</small></a>`).join('');
    }
})();
