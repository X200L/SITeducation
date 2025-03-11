// Пример статьи в формате Markdown
const sampleArticles = [
    {
        id: 1,
        title: "Введение в Markdown",
        content: `# Введение в Markdown

Markdown - это легкий язык разметки, который позволяет форматировать текст с помощью простых символов.

## Основные элементы

- Заголовки
- Списки
- *Курсив*
- **Жирный текст**
- \`Код\`

### Пример кода

\`\`\`javascript
console.log("Hello, World!");
\`\`\`
`,
        author: "Иван Петров",
        date: "2024-03-20",
        likes: 42
    }
];

// Функция для отображения полной статьи
function showFullArticle(articleId) {
    const article = sampleArticles.find(a => a.id === articleId);
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
                ${marked.parse(article.content)}
            </div>
            <button onclick="showArticlesList()" class="back-button">← Назад к списку</button>
        </div>
    `;
}

// Функция для возврата к списку статей
function showArticlesList() {
    const articlesContainer = document.querySelector('.articles');
    articlesContainer.innerHTML = '';
    renderArticles();
}

// Обновленная функция рендеринга статей
function renderArticles() {
    const articlesContainer = document.querySelector('.articles');
    
    sampleArticles.forEach(article => {
        const articleHtml = `
            <div class="article-card" onclick="showFullArticle(${article.id})">
                <h2 class="article-title">${article.title}</h2>
                <div class="article-preview">
                    ${marked.parse(article.content.substring(0, 200) + '...')}
                </div>
                <div class="article-meta">
                    <span>${article.author}</span>
                    <span>${article.date}</span>
                    <span>❤️ ${article.likes}</span>
                </div>
            </div>
        `;
        articlesContainer.innerHTML += articleHtml;
    });
}

// Проверяем, находимся ли мы на странице со статьями
function initializePage() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Рендерим статьи только если мы на странице articles.html
    if (window.location.pathname.includes('articles.html')) {
        renderArticles();
    }
}

document.addEventListener('DOMContentLoaded', initializePage); 