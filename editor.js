document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('markdown-editor');
    const preview = document.getElementById('preview');
    const publishButton = document.getElementById('publish');
    const tagInput = document.getElementById('tag-input');
    const tagsContainer = document.getElementById('tags-container');
    const tags = new Set();
    const draftButton = document.getElementById('draft-button');
    const emailInput = document.getElementById('email-input');

    // Инициализация EmailJS
    emailjs.init("YOUR_USER_ID"); // Замените на ваш User ID из EmailJS

    // Функция для обновления предпросмотра
    function updatePreview() {
        const markdownText = editor.value;
        preview.innerHTML = marked.parse(markdownText);
        Prism.highlightAll(); // Подсветка синтаксиса
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
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    service_id: 'YOUR_SERVICE_ID', // Замените на ваш ID сервиса EmailJS
                    template_id: 'YOUR_TEMPLATE_ID', // Замените на ваш ID шаблона
                    user_id: 'YOUR_USER_ID', // Замените на ваш User ID
                    template_params: {
                        to_email: draftData.email,
                        title: draftData.title,
                        content: draftData.content,
                        tags: draftData.tags.join(', ')
                    }
                })
            });

            if (response.ok) {
                alert('Черновик успешно отправлен на вашу почту!');
            } else {
                throw new Error('Ошибка при отправке');
            }
        } catch (error) {
            alert('Произошла ошибка при отправке черновика: ' + error.message);
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

    // Функция для отправки статьи на почту команды
    async function sendArticle(articleData) {
        try {
            const response = await emailjs.send(
                "YOUR_SERVICE_ID", // Замените на ваш Service ID
                "YOUR_TEMPLATE_ID", // Замените на ваш Template ID
                {
                    to_email: "frogeesoft.team@gmail.com",
                    title: articleData.title,
                    content: articleData.content,
                    tags: articleData.tags.join(', '),
                    author_email: articleData.authorEmail || 'Не указан'
                }
            );

            if (response.status === 200) {
                alert('Статья успешно отправлена на рассмотрение!');
            } else {
                throw new Error('Ошибка при отправке');
            }
        } catch (error) {
            alert('Произошла ошибка при отправке статьи: ' + error.message);
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