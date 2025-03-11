// Информация о статьях
const articlesInfo = [
    {
        id: 1,
        file: 'frontend-intro.md',
        title: 'Введение в Frontend разработку',
        author: 'S.I.T Education',
        date: '2024-03-20',
        likes: 0
    },
    {
        id: 2,
        file: 'notes-app-tutorial.md',
        title: 'Создаем веб-приложение заметок с нуля',
        author: 'S.I.T Education',
        date: '2024-03-24',
        likes: 0
    },
    {
        id: 3,
        file: 'arduino-sensors.md',
        title: 'Работа с датчиками Arduino',
        author: 'S.I.T Education',
        date: '2024-03-25',
        likes: 0
    }
];

// Функция для загрузки содержимого статьи
async function loadArticleContent(fileName) {
    try {
        const response = await fetch(`/articles/${fileName}`);
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

    // Подсветка синтаксиса для кода
    document.querySelectorAll('pre code').forEach((block) => {
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
            const content = await loadArticleContent(article.file);
            const previewContent = content.split('\n').slice(0, 3).join('\n');

            const articleHtml = `
                <div class="article-card" onclick="showFullArticle(${article.id})">
                    <h2 class="article-title">${article.title}</h2>
                    <div class="article-preview">
                        ${marked.parse(previewContent + '...')}
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

// Инициализация страницы
function initializePage() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (window.location.pathname.includes('articles.html')) {
        renderArticles();
    }
}

document.addEventListener('DOMContentLoaded', initializePage); 