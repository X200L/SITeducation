document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('markdown-editor');
    const preview = document.getElementById('preview');
    const publishButton = document.getElementById('publish');
    const tagInput = document.getElementById('tag-input');
    const tagsContainer = document.getElementById('tags-container');
    const tags = new Set();
    const draftButton = document.getElementById('draft-button');
    const emailInput = document.getElementById('email-input');

    // Инициализация EmailJS с публичным ключом
    emailjs.init("YOUR_PUBLIC_KEY"); // Замените на ваш публичный ключ

    // Функция для обновления предпросмотра
    function updatePreview() {
        const markdownText = editor.value;
        preview.innerHTML = marked.parse(markdownText);
        setTimeout(() => {
            Prism.highlightAll();
        }, 0);
    }

    // Обработчик ввода в редакторе
    editor.addEventListener('input', updatePreview);

    // Функция для вставки Markdown разметки
    window.insertMarkdown = function(prefix, suffix) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const text = editor.value;
        const selection = text.substring(start, end);
        
        const newText = text.substring(0, start) + prefix + selection + suffix + text.substring(end);
        editor.value = newText;
        
        editor.focus();
        editor.selectionStart = start + prefix.length;
        editor.selectionEnd = end + prefix.length;
        
        updatePreview();
    };

    // Обработка тегов
    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && tagInput.value.trim()) {
            const tag = tagInput.value.trim();
            if (!tags.has(tag)) {
                tags.add(tag);
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.innerHTML = `
                    ${tag}
                    <span class="tag-remove" onclick="this.parentElement.remove()">×</span>
                `;
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
            const body = encodeURIComponent(`Заголовок: ${draftData.title}\nТеги: ${draftData.tags.join(', ')}\n\nСодержание:\n${draftData.content}`);

            window.location.href = `mailto:${draftData.email}?subject=${subject}&body=${body}`;
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка: ' + error.message);
        }
    }

    // Обработчик нажатия на кнопку сохранения черновика
    draftButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const title = document.getElementById('article-title').value.trim();
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
            const body = encodeURIComponent(`От: ${articleData.authorEmail || 'Аноним'}\nЗаголовок: ${articleData.title}\nТеги: ${articleData.tags.join(', ')}\n\nСодержание:\n${articleData.content}`);

            window.location.href = `mailto:frogeesoft.team@gmail.com?subject=${subject}&body=${body}`;
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка: ' + error.message);
        }
    }

    // Обновленный обработчик публикации
    publishButton.addEventListener('click', () => {
        const title = document.getElementById('article-title').value.trim();
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