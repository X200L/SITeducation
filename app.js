// Информация о статьях
 const articlesInfo = [
    {
        id: 1,
        file: 'articles/vscode-plugins.md',
        title: 'VS Code: Полезные плагины и симуляторы',
        author: 'S.I.T Education',
        date: '2024-03-20',
        likes: 0,
        tags: ['VS Code', 'Разработка', 'Инструменты'],
        preview: 'Подборка самых полезных плагинов для VS Code и обзор симуляторов для тестирования кода.'
    },
    {
        id: 2,
        file: 'articles/obsidian-guide.md',
        title: 'Obsidian: Твой личный центр знаний',
        author: 'S.I.T Education',
        date: '2024-03-24',
        likes: 0,
        tags: ['Obsidian', 'Продуктивность', 'Markdown'],
        preview: 'Полное руководство по Obsidian: плагины, Markdown, методы организации заметок и продвинутые техники.'
    },
    {
        id: 3,
        file: 'articles/arduino-sensors.md',
        title: 'Работа с сенсорами Arduino',
        author: 'S.I.T Education',
        date: '2024-03-25',
        likes: 0,
        tags: ['Arduino', 'Электроника', 'DIY'],
        preview: 'Практическое руководство по подключению и программированию различных сенсоров для Arduino.'
    },
    {
        id: 4,
        file: 'articles/notes-app-tutorial.md',
        title: 'Создаем приложение для заметок',
        author: 'S.I.T Education',
        date: '2024-03-26',
        likes: 0,
        tags: ['JavaScript', 'Web', 'Туториал'],
        preview: 'Пошаговый туториал по созданию веб-приложения для заметок с использованием современных технологий.'
    },
    {
        id: 5,
        file: 'git-basics.md',
        title: 'Системы контроля версий',
        author: 'S.I.T Education',
        date: '2025-03-27',
        likes: 0,
        tags: ['Продуктивность', 'Туториал', 'Git'],
        preview: 'Основы систем контроля версий Git и их использование в разработке.'
    },
    {
        id: 6,
        file: 'responsive-design-ru.md',
        title: 'Адаптивный дизайн',
        author: 'S.I.T Education',
        date: '2025-03-27',
        likes: 0,
        tags: ['Дизайн', 'Туториал', 'Web'],
        preview: 'Основы адаптивной верстки и создания отзывчивых веб-сайтов.'
    }
];

// Функция загрузки содержимого статьи
async function loadArticleContent(fileName) {
    try {
        const response = await fetch(fileName);
        if (!response.ok) {
            throw new Error(`Статья не найдена (статус: ${response.status})`);
        }
        return await response.text();
    } catch (error) {
        console.error('Ошибка загрузки статьи:', error);
        return `# Ошибка загрузки статьи\n\nК сожалению, не удалось загрузить статью. Пожалуйста, попробуйте позже.\n\n**Техническая информация:** ${error.message}`;
    }
}

// Функция отображения полной статьи
async function showFullArticle(articleId) {
    const article = articlesInfo.find(a => a.id === articleId);
    if (!article) return;

    const content = await loadArticleContent(article.file);
    const articlesContainer = document.querySelector('.articles');

    articlesContainer.innerHTML = `
        <div class="full-article">
            <h1>${article.title}</h1>
            <div class="article-meta">
                <span>${article.author}</span>
                <span>${article.date}</span>
                <span>❤️ ${article.likes}</span>
            </div>
            <div class="article-content">
                ${marked.parse(content)}
            </div>
            <button onclick="showArticlesList()" class="back-button">← Назад к списку</button>
        </div>
    `;
}

// Функция возврата к списку статей
function showArticlesList() {
    renderArticles();
}

// Функция рендеринга списка статей
function renderArticles() {
    const articlesContainer = document.querySelector('.articles');
    if (!articlesContainer) return;
    
    articlesContainer.innerHTML = '<div class="loading">Загрузка статей...</div>';
    
    setTimeout(() => {
        articlesContainer.innerHTML = articlesInfo.map(article => `
            <div class="article-card" onclick="showFullArticle(${article.id})">
                <h2 class="article-title">${article.title}</h2>
                <div class="article-preview">
                    <p>${article.preview}</p>
                </div>
                <div class="tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="article-meta">
                    <span>${article.author}</span>
                    <span>${article.date}</span>
                    <span>❤️ ${article.likes}</span>
                </div>
            </div>
        `).join('');
    }, 500);
}

// Функция поиска статей
function searchArticles(query) {
    if (!query) return articlesInfo;
    
    query = query.toLowerCase();
    return articlesInfo.filter(article => {
        const titleMatch = article.title.toLowerCase().includes(query);
        const tagsMatch = article.tags.some(tag => tag.toLowerCase().includes(query));
        const previewMatch = article.preview.toLowerCase().includes(query);
        return titleMatch || tagsMatch || previewMatch;
    });
}

// Функция отображения уникальных тегов
function renderTagFilters() {
    const filterContainer = document.querySelector('.filter-tags');
    if (!filterContainer) return;
    
    const uniqueTags = [...new Set(articlesInfo.flatMap(article => article.tags))];

    filterContainer.innerHTML = uniqueTags.map(tag => `
        <span class="tag filter-tag" data-tag="${tag}">${tag}</span>
    `).join('');

    // Добавляем обработчики кликов
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.target.classList.toggle('active');
            updateSearch();
        });
    });
}

// Функция обновления результатов поиска
function updateSearch() {
    const searchQuery = document.getElementById('searchInput')?.value || "";
    const activeFilters = Array.from(document.querySelectorAll('.filter-tag.active'))
        .map(tag => tag.dataset.tag);
    
    let filteredArticles = searchArticles(searchQuery);

    // Фильтрация по тегам
    if (activeFilters.length > 0) {
        filteredArticles = filteredArticles.filter(article =>
            activeFilters.every(filter => article.tags.includes(filter))
        );
    }

    renderFilteredArticles(filteredArticles);
}

// Функция отображения отфильтрованных статей
function renderFilteredArticles(articles) {
    const articlesContainer = document.querySelector('.articles');
    
    if (!articlesContainer) return;

    if (articles.length === 0) {
        articlesContainer.innerHTML = `
            <div class="no-results">
                <h2>Статьи не найдены</h2>
                <p>Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }

    articlesContainer.innerHTML = articles.map(article => `
        <div class="article-card" onclick="showFullArticle(${article.id})">
            <h2 class="article-title">${article.title}</h2>
            <div class="article-preview">
                <p>${article.preview}</p>
            </div>
            <div class="tags">
                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="article-meta">
                <span>${article.author}</span>
                <span>${article.date}</span>
                <span>❤️ ${article.likes}</span>
            </div>
        </div>
    `).join('');
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    renderTagFilters();
    renderArticles();
});