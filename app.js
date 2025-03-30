// Информация о статьях
 const articlesInfo = [
    {
        id: 1,
        file: 'vscode-plugins.md',
        title: 'VS Code: Полезные плагины и симуляторы',
        author: 'S.I.T Education',
        date: '2025-03-20',
        likes: 0,
        tags: ['Разработка', 'Инструменты'],
        preview: 'Подборка самых полезных плагинов для VS Code и обзор симуляторов для тестирования кода.'
    },
    {
        id: 2,
        file: 'obsidian-guide.md',
        title: 'Obsidian: Твой личный центр знаний',
        author: 'S.I.T Education',
        date: '2025-03-24',
        likes: 0,
        tags: ['Продуктивность'],
        preview: 'Полное руководство по Obsidian: плагины, Markdown, методы организации заметок и продвинутые техники.'
    },
    {
        id: 3,
        file: 'arduino-sensors.md',
        title: 'Работа с сенсорами Arduino',
        author: 'S.I.T Education',
        date: '2025-03-25',
        likes: 0,
        tags: ['Arduino', 'Электроника', 'DIY'],
        preview: 'Практическое руководство по подключению и программированию различных сенсоров для Arduino.'
    },
    {
        id: 4,
        file: 'notes-app-tutorial.md',
        title: 'Создаем приложение для заметок',
        author: 'S.I.T Education',
        date: '2025-03-26',
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
        tags: ['Туториал', 'Git'],
        preview: 'Основы систем контроля версий Git и их использование в разработке.'
    },
    {
        id: 6,
        file: 'responsive-design-ru.md',
        title: 'Адаптивный дизайн',
        author: 'S.I.T Education',
        date: '2025-03-27',
        likes: 0,
        tags: ['Дизайн', 'Web'],
        preview: 'Основы адаптивной верстки и создания отзывчивых веб-сайтов.'
    },
    {
        id: 7,
        file: 'http.md',
        title: 'Как работает HTTP: Простыми словами',
        author: 'S.I.T Education',
        date: '2025-03-28',
        likes: 0,
        tags: ['Web', 'HTTP'],
        preview: 'Объяснение протокола HTTP простым и понятным языком.'
    },
    {
        id: 8,
        file: 'ardudino.md',
        title: 'Делаем игру "Динозаврик" на Arduino',
        author: 'S.I.T Education',
        date: '2025-03-29',
        likes: 0,
        tags: ['Arduino', 'Игра', 'DIY'],
        preview: 'Создание простой игры "Динозаврик" на Arduino с использованием LCD1602 и одной кнопки.'
    },
    {
        id: 9,
        file: 'GTK - C.md',
        title: 'Разработка GUI на C с использованием GTK',
        author: 'S.I.T Education',
        date: '2025-03-30',
        likes: 0,
        tags: ['C', 'GTK', 'GUI'],
        preview: 'Краткое руководство по разработке графических интерфейсов на C с использованием библиотеки GTK.'
    },
    {
        id: 10,
        file: 'C.md',
        title: 'Язык программирования C: Краткий справочник',
        author: 'S.I.T Education',
        date: '2025-03-30',
        likes: 0,
        tags: ['C', 'Программирование'],
        preview: 'Краткий справочник по языку программирования C, основанный на ключевых концепциях и примерах.'
    },
    {
        id: 11,
        file: 'todoprogramm.md',
        title: 'To-do лист, делаем простое веб приложение',
        author: 'S.I.T Education',
        date: '2025-03-30',
        likes: 0,
        tags: ['JavaScript', 'Web', 'Туториал'],
        preview: 'Создание простого веб-приложения To-do лист с двумя версиями: простой и продвинутой.'
    }
];

// Функция для загрузки содержимого статьи
async function loadArticleContent(fileName) {
    try {
        // Use a relative path to fetch the articles
        const response = await fetch(`articles/${fileName}`);
        if (!response.ok) {
            throw new Error(`Статья не найдена (статус: ${response.status})`);
        }
        return await response.text();
    } catch (error) {
        console.error('Ошибка загрузки статьи:', error);
        return `# Ошибка загрузки статьи\n\nК сожалению, не удалось загрузить статью. Пожалуйста, попробуйте позже.\n\nТехническая информация: ${error.message}`;
    }
}

// Функция для отображения полной статьи
async function showFullArticle(articleId) {
    const article = articlesInfo.find(a => a.id === articleId);
    if (!article) return;

    const content = await loadArticleContent(article.file);
    const articlesContainer = document.querySelector('.articles');
    
    articlesContainer.innerHTML = `
        <div class="full-article">
            <div class="article-header">
                <h1>${article.title}</h1>
                <div class="article-meta">
                    <span><i class="fas fa-user"></i> ${article.author}</span>
                    <span><i class="fas fa-calendar"></i> ${article.date}</span>
                    <span><i class="fas fa-heart"></i> ${article.likes}</span>
                </div>
                <div class="tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="article-content">
                ${marked.parse(content)}
            </div>
            <div class="article-actions">
                <button onclick="showArticlesList()" class="back-button">
                    <i class="fas fa-arrow-left"></i> Назад к списку
                </button>
                <button onclick="shareArticle(${article.id})" class="share-button">
                    <i class="fas fa-share-alt"></i> Поделиться
                </button>
            </div>
        </div>
    `;

    // Обработка изображений для адаптивности
    document.querySelectorAll('.article-content img').forEach(img => {
        img.classList.add('responsive-img');
        // Оборачиваем изображение в контейнер для лучшего контроля
        const wrapper = document.createElement('div');
        wrapper.className = 'img-wrapper';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
    });

    // Обработка таблиц для адаптивности
    document.querySelectorAll('.article-content table').forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });

    // Подсветка синтаксиса для кода
    document.querySelectorAll('pre code').forEach((block) => {
        block.classList.add('responsive-code');
        Prism.highlightElement(block);
    });
}

// Функция для возврата к списку статей
function showArticlesList() {
    const articlesContainer = document.querySelector('.articles');
    articlesContainer.innerHTML = '';
    renderArticles();
}

// Функция для рендеринга списка статей
async function renderArticles() {
    const articlesContainer = document.querySelector('.articles');
    articlesContainer.innerHTML = '<div class="loading">Загрузка статей...</div>';

    try {
        for (const article of articlesInfo) {
            const articleHtml = `
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
            `;
            articlesContainer.innerHTML += articleHtml;
        }
    } catch (error) {
        articlesContainer.innerHTML = `
            <div class="error-message">
                <h2>Ошибка загрузки статей</h2>
                <p>${error.message}</p>
                <button onclick="renderArticles()">Попробовать снова</button>
            </div>
        `;
    }
}

// Функция для поиска статей
function searchArticles(query) {
    if (!query) {
        return articlesInfo;
    }
    
    query = query.toLowerCase();
    return articlesInfo.filter(article => {
        const titleMatch = article.title.toLowerCase().includes(query);
        const tagsMatch = article.tags.some(tag => tag.toLowerCase().includes(query));
        const previewMatch = article.preview.toLowerCase().includes(query);
        return titleMatch || tagsMatch || previewMatch;
    });
}

// Функция для отображения уникальных тегов
function renderTagFilters() {
    const filterContainer = document.querySelector('.filter-tags');
    const uniqueTags = [...new Set(articlesInfo.flatMap(article => article.tags))];
    
    filterContainer.innerHTML = uniqueTags.map(tag => `
        <span class="tag filter-tag" data-tag="${tag}">${tag}</span>
    `).join('');

    // Добавляем обработчики для тегов
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.target.classList.toggle('active');
            updateSearch();
        });
    });
}

// Функция обновления результатов поиска
function updateSearch() {
    const searchQuery = document.getElementById('searchInput').value;
    const activeFilters = Array.from(document.querySelectorAll('.filter-tag.active'))
        .map(tag => tag.dataset.tag);
    
    let filteredArticles = searchArticles(searchQuery);

    // Применяем фильтрацию по тегам
    if (activeFilters.length > 0) {
        filteredArticles = filteredArticles.filter(article =>
            activeFilters.every(filter => article.tags.includes(filter))
        );
    }

    renderFilteredArticles(filteredArticles);
}

// Функция для отображения отфильтрованных статей
function renderFilteredArticles(articles) {
    const articlesContainer = document.querySelector('.articles');
    
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
            <div class="article-card-content">
                <h2 class="article-title">${article.title}</h2>
                <div class="article-preview">
                    <p>${article.preview}</p>
                </div>
                <div class="tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="article-meta">
                    <span><i class="fas fa-user"></i> ${article.author}</span>
                    <span><i class="fas fa-calendar"></i> ${article.date}</span>
                    <span><i class="fas fa-heart"></i> ${article.likes}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Обновляем функцию инициализации
function initializePage() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (window.location.pathname.includes('articles.html')) {
        renderTagFilters();
        renderArticles();

        // Добавляем обработчик поиска
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', debounce(updateSearch, 300));
    }
}

// Утилита для debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Функция для отправки ссылки на статью
async function shareArticle(articleId) {
    const article = articlesInfo.find(a => a.id === articleId);
    if (!article) return;

    // Construct the full article URL
    const baseUrl = 'https://x200l.github.io/SITeducation/';
    const articleUrl = `${baseUrl}articles.html?article=${articleId}`;

    try {
        await navigator.clipboard.writeText(articleUrl);
        alert('Ссылка скопирована в буфер обмена!');
    } catch (err) {
        console.error('Не удалось скопировать ссылку: ', err);
        alert('Не удалось скопировать ссылку. Пожалуйста, попробуйте вручную: ' + articleUrl);
    }
}
 
document.addEventListener('DOMContentLoaded', initializePage); 
