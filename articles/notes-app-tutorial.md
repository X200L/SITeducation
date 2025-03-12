# Создаём простое веб-приложение для заметок

Привет! Сегодня мы с нуля создадим простое, но полезное веб-приложение для заметок. Никаких сложностей - только HTML, CSS и чистый JavaScript. Давайте начнём!

## Что мы будем делать?

Мы создадим приложение, где можно:
- Добавлять заметки
- Сохранять их в браузере
- Удалять ненужные
- И всё это с приятным дизайном!

## Шаг 1: Создаём HTML-структуру

Сначала создадим файл `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Мои заметки</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Мои заметки ✍️</h1>
        
        <!-- Форма для новой заметки -->
        <div class="note-form">
            <input 
                type="text" 
                id="noteTitle" 
                placeholder="Название заметки..."
            >
            <textarea 
                id="noteText" 
                placeholder="Текст заметки..."
            ></textarea>
            <button id="addNote">Добавить заметку</button>
        </div>

        <!-- Здесь будут наши заметки -->
        <div id="notesList"></div>
    </div>
    <script src="app.js"></script>
</body>
</html>
```

## Шаг 2: Добавляем стили

Теперь сделаем наше приложение красивым. Создаём файл `style.css`:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    line-height: 1.6;
    background: #f5f5f5;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}

/* Стили для формы */
.note-form {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}

input, textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

textarea {
    height: 100px;
    resize: vertical;
}

button {
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background: #45a049;
}

/* Стили для заметок */
.note {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 15px;
    position: relative;
}

.note h2 {
    color: #333;
    margin-bottom: 10px;
}

.note p {
    color: #666;
}

.delete-note {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #ff4444;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
}

.delete-note:hover {
    background: #cc0000;
}
```

## Шаг 3: Добавляем JavaScript

Теперь самое интересное - делаем наше приложение живым! Создаём файл `app.js`:

```javascript
class NotesApp {
    constructor() {
        // Находим все нужные элементы
        this.titleInput = document.getElementById('noteTitle');
        this.textInput = document.getElementById('noteText');
        this.addButton = document.getElementById('addNote');
        this.notesList = document.getElementById('notesList');

        // Загружаем заметки из localStorage
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];

        // Привязываем обработчики событий
        this.addButton.addEventListener('click', () => this.addNote());
        
        // Показываем заметки при запуске
        this.displayNotes();
    }

    // Добавление новой заметки
    addNote() {
        const title = this.titleInput.value.trim();
        const text = this.textInput.value.trim();

        // Проверяем, что поля не пустые
        if (!title || !text) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        // Создаём новую заметку
        const note = {
            id: Date.now(), // Используем timestamp как ID
            title: title,
            text: text,
            date: new Date().toLocaleString()
        };

        // Добавляем заметку в массив
        this.notes.push(note);
        
        // Сохраняем в localStorage
        this.saveNotes();
        
        // Обновляем отображение
        this.displayNotes();
        
        // Очищаем поля ввода
        this.titleInput.value = '';
        this.textInput.value = '';
    }

    // Удаление заметки
    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotes();
        this.displayNotes();
    }

    // Сохранение заметок в localStorage
    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    // Отображение всех заметок
    displayNotes() {
        this.notesList.innerHTML = this.notes.map(note => `
            <div class="note">
                <h2>${note.title}</h2>
                <p>${note.text}</p>
                <small>${note.date}</small>
                <button 
                    class="delete-note"
                    onclick="notesApp.deleteNote(${note.id})"
                >
                    Удалить
                </button>
            </div>
        `).join('');
    }
}

// Создаём экземпляр приложения
const notesApp = new NotesApp();
```

## Как это работает?

1. **HTML** создаёт структуру: форму для ввода и место для заметок
2. **CSS** делает всё красивым и отзывчивым
3. **JavaScript** добавляет функциональность:
   - Создание заметок
   - Сохранение в localStorage (они не пропадут после перезагрузки страницы)
   - Удаление заметок
   - Отображение даты создания

## Что можно улучшить?

1. **Редактирование заметок**
   - Добавить возможность изменять существующие заметки

2. **Категории**
   - Добавить возможность группировать заметки по категориям

3. **Поиск**
   - Добавить поиск по заголовкам и содержимому

4. **Markdown**
   - Добавить поддержку форматирования текста

5. **Drag and Drop**
   - Добавить возможность менять порядок заметок

## Заключение

Вот и всё! Теперь у вас есть рабочее приложение для заметок. Оно простое, но его легко расширять новыми функциями. 

Попробуйте добавить что-то своё - может быть, тёмную тему или возможность прикреплять картинки? В веб-разработке важно экспериментировать и пробовать новое!

Удачи в разработке! 😊 