// Информация о статьях


// Функция для загрузки статей из JSON файла
async function loadArticles() {
    try {
        const response = await fetch('articles.json');
        if (!response.ok) {
            throw new Error('Failed to load articles');
        }
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error('Error loading articles:', error);
        return [];
    }
}

// Функция для загрузки содержимого статьи
async function loadArticleContent(fileName) {
    try {
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
    const articles = await loadArticles();
    const article = articles.find(a => a.id === articleId);
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
            <div class="article-content markdown-body">
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

    // Обработка блоков кода для адаптивности
    document.querySelectorAll('.article-content pre code').forEach((block) => {
        block.classList.add('responsive-code');
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        block.parentNode.parentNode.insertBefore(wrapper, block.parentNode);
        wrapper.appendChild(block.parentNode);
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
        const articles = await loadArticles();
        // Sort articles by date in descending order (newest first)
        const sortedArticles = [...articles].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        articlesContainer.innerHTML = sortedArticles.map(article => `
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
async function searchArticles(query) {
    const articles = await loadArticles();
    if (!query) {
        return articles;
    }
    
    query = query.toLowerCase();
    return articles.filter(article => {
        const titleMatch = article.title.toLowerCase().includes(query);
        const tagsMatch = article.tags.some(tag => tag.toLowerCase().includes(query));
        const previewMatch = article.preview.toLowerCase().includes(query);
        return titleMatch || tagsMatch || previewMatch;
    });
}

// Функция для отображения уникальных тегов
async function renderTagFilters() {
    const filterContainer = document.querySelector('.filter-tags');
    const articles = await loadArticles();
    const uniqueTags = [...new Set(articles.flatMap(article => article.tags))];
    
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
async function updateSearch() {
    const searchQuery = document.getElementById('searchInput').value;
    const activeFilters = Array.from(document.querySelectorAll('.filter-tag.active'))
        .map(tag => tag.dataset.tag);
    
    let filteredArticles = await searchArticles(searchQuery);

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

// Функция для отправки ссылки на статью
async function shareArticle(articleId) {
    const articles = await loadArticles();
    const article = articles.find(a => a.id === articleId);
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

// Функция для загрузки новостей
async function loadLatestNews() {
    try {
        // Определяем, находимся ли мы на GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io');
        const basePath = isGitHubPages ? '/SITeducation' : '';
        
        const response = await fetch(`${basePath}/news/index.json`);
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки новостей (статус: ${response.status})`);
        }
        const news = await response.json();
        
        // Сортируем новости по дате (от новых к старым)
        const sortedNews = news.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        // Отображаем только 3 последние новости
        displayLatestNews(sortedNews.slice(0, 3), basePath);
    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
        const newsContainer = document.querySelector('.news-container');
        if (newsContainer) {
            newsContainer.innerHTML = `
                <div class="news-error">
                    <i class="fas fa-newspaper"></i>
                    <p>Не удалось загрузить новости</p>
                    <button onclick="loadLatestNews()" class="retry-button">
                        Попробовать снова
                    </button>
                </div>
            `;
        }
    }
}

// Функция для отображения новостей
function displayLatestNews(news, basePath = '') {
    const newsContainer = document.querySelector('.news-container');
    const defaultImage = `${basePath}/images/default-news.png`;
    
    newsContainer.innerHTML = news.map(item => {
        // Формируем правильный путь к изображению
        const imagePath = item.image.startsWith('./') ? 
            `${basePath}${item.image.slice(1)}` : // Если путь начинается с ./
            `${basePath}/${item.image}`; // Если путь не начинается с ./

        // Форматируем дату для отображения
        const newsDate = new Date(item.date);
        const formattedDate = newsDate.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="news-item">
                <div class="news-image">
                    <img src="${imagePath}" 
                         alt="${item.title}"
                         onerror="this.src='${defaultImage}'; this.onerror=null;"
                         loading="lazy">
                </div>
                <div class="news-content">
                    <h3>${item.title}</h3>
                    <p>${item.preview}</p>
                    <div class="news-meta">
                        <span class="news-date"><i class="fas fa-calendar"></i> ${formattedDate}</span>
                        <a href="${basePath}/news.html">Подробнее <span class="arrow">→</span></a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Обновляем функцию инициализации
async function initializePage() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Проверяем, есть ли на странице контейнер для новостей
    const newsContainer = document.querySelector('.news-container');
    if (newsContainer) {
        loadLatestNews();
    }
    
    if (window.location.pathname.includes('articles.html')) {
        // Загружаем статьи
        await renderArticles();
        
        // Проверяем наличие контейнера для тегов фильтрации
        const filterContainer = document.querySelector('.filter-tags');
        if (filterContainer) {
            await renderTagFilters();
        }

        // Добавляем обработчик поиска
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(() => updateSearch(), 300));
        }
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

document.addEventListener('DOMContentLoaded', initializePage); 
