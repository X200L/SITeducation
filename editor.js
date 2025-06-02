// Глобальная функция для скачивания статьи
function downloadArticle() {
    try {
        const editor = document.getElementById('markdown-editor');
        const articleTitleInput = document.getElementById('article-title');
        
        if (!editor || !articleTitleInput) {
            throw new Error('Не удалось найти необходимые элементы на странице');
        }

        const title = articleTitleInput.value.trim() || 'untitled-article';
        const content = editor.value.trim();
        const filename = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.md`;

        let markdownContent = `# ${title}\n\n`;
        markdownContent += content;

        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Ошибка при скачивании:', error);
        alert('Произошла ошибка при скачивании файла: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('markdown-editor');
    const preview = document.getElementById('preview');
    const publishButton = document.getElementById('publish');
    const tagInput = document.getElementById('tag-input');
    const tagsContainer = document.getElementById('tags-container');
    const tags = new Set();
    const draftButton = document.getElementById('draft-button');
    const emailInput = document.getElementById('email-input');
    const articleTitleInput = document.getElementById('article-title');

    // Функция для обновления предпросмотра
    function updatePreview() {
        if (editor && preview) {
            const markdownText = editor.value;
            const html = marked.parse(markdownText);
            preview.innerHTML = html;
            Prism.highlightAll();
        }
    }

    // Обработчик ввода в редакторе
    editor.addEventListener('input', () => {
        updatePreview();
        // Сохраняем содержимое редактора в localStorage
        localStorage.setItem('editorContent', editor.value);
    });

    // Функция для вставки Markdown разметки
    window.insertMarkdown = function(start, end) {
        const textarea = document.getElementById('markdown-editor');
        if (textarea) {
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            const selectedText = textarea.value.substring(startPos, endPos);
            const newText = start + selectedText + end;
            textarea.value = textarea.value.substring(0, startPos) + newText + textarea.value.substring(endPos, textarea.value.length);
            textarea.focus();
            textarea.selectionStart = startPos + start.length;
            textarea.selectionEnd = startPos + start.length + selectedText.length;
            updatePreview();
            localStorage.setItem('editorContent', textarea.value);
        }
    };

    // Обработка тегов
    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && tagInput.value.trim() !== '') {
            e.preventDefault();
            const tagText = tagInput.value.trim();
            if (!tags.has(tagText)) {
                tags.add(tagText);
                const tagElement = document.createElement('div');
                tagElement.classList.add('tag');
                tagElement.textContent = tagText;
                tagsContainer.appendChild(tagElement);
                tagInput.value = '';
            }
        }
    });

    // Функция для проверки email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Функция для отправки черновика
    async function sendDraft(draftData) {
        try {
            const subject = encodeURIComponent(`Черновик статьи: ${draftData.title}`);
            const body = encodeURIComponent(`Заголовок: ${draftData.title}\nТеги: ${Array.from(draftData.tags).join(', ')}\n\nСодержание:\n${draftData.content}`);

            window.location.href = `mailto:${draftData.email}?subject=${subject}&body=${body}`;
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка: ' + error.message);
        }
    }

    // Обработчик нажатия на кнопку сохранения черновика
    draftButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const title = articleTitleInput.value.trim();
        const content = editor.value.trim();
        const currentTags = Array.from(tags);

        if (!email) {
            alert('Пожалуйста, введите email для отправки черновика');
            return;
        }

        if (!isValidEmail(email)) {
            alert('Пожалуйста, введите корректный email');
            return;
        }

        if (!title || !content) {
            alert('Пожалуйста, заполните заголовок и содержание статьи');
            return;
        }

        const draftData = {
            email,
            title,
            content,
            tags: currentTags
        };

        sendDraft(draftData);
    });

    // Функция для отправки статьи на модерацию
    async function sendArticle(articleData) {
        try {
            const subject = encodeURIComponent(`Новая статья: ${articleData.title}`);
            const body = encodeURIComponent(`От: ${articleData.authorEmail || 'Аноним'}\nЗаголовок: ${articleData.title}\nТеги: ${Array.from(articleData.tags).join(', ')}\n\nСодержание:\n${articleData.content}`);

            window.location.href = `mailto:frogeesoft.team@gmail.com?subject=${subject}&body=${body}`;
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка: ' + error.message);
        }
    }

    // Обновленный обработчик публикации
    publishButton.addEventListener('click', () => {
        const title = articleTitleInput.value.trim();
        const content = editor.value.trim();
        const currentTags = Array.from(tags);
        const authorEmail = emailInput.value.trim();

        if (!title || !content) {
            alert('Пожалуйста, заполните заголовок и содержание статьи');
            return;
        }

        const articleData = {
            title,
            content,
            tags: currentTags,
            authorEmail
        };

        // Отправляем статью на почту команды
        sendArticle(articleData);
    });

    // Пример текста
    const exampleText = `# Добро пожаловать в редактор

Это простой пример Markdown разметки.

## Возможности

- Поддержка **жирного** текста
- Поддержка *курсива*
- Поддержка \`кода\`

\`\`\`javascript
console.log("Hello, World!");
\`\`\`
`;

    // Загружаем сохраненное содержимое или используем пример
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
        editor.value = savedContent;
    } else {
        editor.value = exampleText;
        localStorage.setItem('editorContent', exampleText);
    }
    updatePreview();
}); 