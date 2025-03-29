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
    const downloadButton = document.getElementById('download-button');

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
    editor.addEventListener('input', updatePreview);

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

    // Функция для скачивания статьи
    function downloadArticle(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    // Обработчик нажатия на кнопку скачивания
    downloadButton.addEventListener('click', () => {
        const title = articleTitleInput.value.trim();
        const content = editor.value.trim();
        const tagsArray = Array.from(tags);
        const filename = title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.md';

        let markdownContent = `# ${title}\n\n`;
        markdownContent += `**Теги:** ${tagsArray.join(', ')}\n\n`;
        markdownContent += content;

        downloadArticle(filename, markdownContent);
    });

    // Добавим пример текста в редактор
    editor.value = `# Добро пожаловать в редактор

Это простой пример Markdown разметки.

## Возможности

- Поддержка **жирного** текста
- Поддержка *курсива*
- Поддержка \`кода\`

\`\`\`javascript
console.log("Hello, World!");
\`\`\`
`;
    updatePreview();
}); 