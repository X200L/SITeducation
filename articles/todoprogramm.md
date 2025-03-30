# To-do лист, делаем простое веб приложение

Привет! Планировали ли вы когда-нибудь задачи? Для этого прекрасно подходят to-do листы. Это прекрасный стартовый проект, поэтому на просторах интернета можно найти огромное количество to-do листов. Я подумал и решил, что почему бы не попробовать написать свой? Но это слишком легко, поэтому я решил написать 2 версии и статью о том, что и как делать. Начнем с более простого.

## Что такое to-do лист и как он работает?

Это простое приложение, в котором можно записывать задачи и в нужный момент отмечать выполненные. По сути, это похоже на заметки, но короче и с чекбоксами для отметки, что задача выполнена.

## Создание простого приложения

Начну с создания простого приложения. Не буду томить и долго ходить вокруг да около, вот что у нас получится:

![first app](images/firsttodo.png)

В целом, не очень красиво, но если взглянуть на код, то все координально меняется.

```html
<!DOCTYPE html>
<html>
<head>
    <title>To-Do</title>
    <style>
        body { text-align: center; }
        li { margin: 5px 0; }
        .del { color: red; cursor: pointer; }
    </style>
</head>
<body>
    <input id="task" placeholder="Что сделать?">
    <button onclick="add()">+</button>
    <ul id="list"></ul>

    <script>
        function add() {
            const task = document.getElementById('task');
            if (task.value) {
                const li = document.createElement('li');
                li.innerHTML = task.value + ' <span class="del" onclick="this.parentNode.remove()">×</span>';
                document.getElementById('list').appendChild(li);
                task.value = '';
            }
        }
        document.getElementById('task').onkeypress = function(e) {
            if (e.key === 'Enter') add();
        };
    </script>
</body>
</html>
```

Выглядит вполне компактно и несложно, давайте разберем, как это работает.

### Разбор кода

1.  **HTML структура:**
    *   `<!DOCTYPE html>`: Объявление типа документа HTML5.
    *   `<head>`: Секция с метаданными, заголовком и стилями.
        *   `<title>`: Заголовок страницы, отображаемый во вкладке браузера.
        *   `<style>`: Встроенные стили CSS для минимального оформления.
    *   `<body>`: Основное содержимое страницы.
        *   `<input id="task" placeholder="Что сделать?">`: Текстовое поле для ввода задачи.
        *   `<button onclick="add()">+</button>`: Кнопка для добавления задачи. При нажатии вызывает функцию `add()`.
        *   `<ul id="list"></ul>`: Неупорядоченный список, в который будут добавляться задачи.
2.  **CSS стили:**
    *   `body { text-align: center; }`: Выравнивание содержимого тела по центру.
    *   `li { margin: 5px 0; }`: Отступы сверху и снизу для элементов списка.
    *   `.del { color: red; cursor: pointer; }`: Стиль для элемента удаления задачи (красный цвет, курсор в виде указателя).
3.  **JavaScript логика:**
    *   `function add() { ... }`: Функция для добавления новой задачи.
        *   `const task = document.getElementById('task');`: Получение элемента текстового поля по его ID.
        *   `if (task.value) { ... }`: Проверка, что текстовое поле не пустое.
        *   `const li = document.createElement('li');`: Создание нового элемента списка `<li>`.
        *   `li.innerHTML = task.value + ' <span class="del" onclick="this.parentNode.remove()">×</span>';`: Установка содержимого элемента списка: текст задачи и кнопка удаления. При нажатии на кнопку удаления (`<span>`) удаляется родительский элемент (`<li>`).
        *   `document.getElementById('list').appendChild(li);`: Добавление нового элемента списка в список `<ul>`.
        *   `task.value = '';`: Очистка текстового поля после добавления задачи.
    *   `document.getElementById('task').onkeypress = function(e) { ... }`: Обработчик нажатия клавиш в текстовом поле.
        *   `if (e.key === 'Enter') add();`: Если нажата клавиша "Enter", вызывается функция `add()`.

### Итог работы

Это минимальная версия, и ее еще нужно сильно дорабатывать. Можно добавить дизайн и дополнительный функционал.

## Создаем продвинутое приложение to-do

![to-do design](images/todopro.png)

Здесь и функционал больше, есть сохранение задач, есть чекбоксы, в наличии хороший дизайн, а еще все это адаптивный дизайн, следовательно, хорошо смотрится на всех устройствах (кстати, об адаптивном дизайне тоже есть неплохая статья).

Перейдем к коду:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern To-Do List</title>
    <style>
        :root {
            --primary: #6c5ce7;
            --secondary: #a29bfe;
            --light: #f8f9fa;
            --dark: #343a40;
            --success: #00b894;
            --danger: #d63031;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #f5f6fa;
            color: var(--dark);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding: 2rem;
        }

        .container {
            width: 100%;
            max-width: 600px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 1.5rem;
            text-align: center;
        }

        .header h1 {
            font-weight: 600;
            font-size: 1.8rem;
        }

        .input-container {
            display: flex;
            padding: 1rem;
            border-bottom: 1px solid #eee;
        }

        .input-container input {
            flex: 1;
            padding: 0.8rem 1rem;
            border: 2px solid #eee;
            border-radius: 8px 0 0 8px;
            font-size: 1rem;
            outline: none;
            transition: border 0.3s;
        }

        .input-container input:focus {
            border-color: var(--secondary);
        }

        .input-container button {
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 0 1.5rem;
            border-radius: 0 8px 8px 0;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.3s;
        }

        .input-container button:hover {
            background-color: #5a4fcf;
        }

        .tasks-container {
            padding: 0 1rem;
        }

        .task {
            display: flex;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #eee;
            animation: fadeIn 0.3s ease;
        }

        .task:last-child {
            border-bottom: none;
        }

        .task-checkbox {
            margin-right: 1rem;
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .task-text {
            flex: 1;
            font-size: 1rem;
        }

        .task-text.completed {
            text-decoration: line-through;
            color: #aaa;
        }

        .task-delete {
            background: none;
            border: none;
            color: var(--danger);
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s;
            margin-left: 1rem;
        }

        .task-delete:hover {
            opacity: 1;
        }

        .empty-state {
            text-align: center;
            padding: 2rem;
            color: #aaa;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
            body {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Мой Список Дел</h1>
        </div>
        <div class="input-container">
            <input type="text" id="taskInput" placeholder="Добавьте новую задачу...">
            <button id="addTaskBtn">+</button>
        </div>
        <div class="tasks-container" id="tasksContainer">
            <!-- Задачи будут добавляться здесь -->
            <div class="empty-state" id="emptyState">Нет задач. Добавьте первую!</div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const taskInput = document.getElementById('taskInput');
            const addTaskBtn = document.getElementById('addTaskBtn');
            const tasksContainer = document.getElementById('tasksContainer');
            const emptyState = document.getElementById('emptyState');

            // Загрузка задач из localStorage
            loadTasks();

            // Добавление задачи
            addTaskBtn.addEventListener('click', addTask);
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') addTask();
            });

            function addTask() {
                const taskText = taskInput.value.trim();
                if (taskText === '') return;

                // Создаем элемент задачи
                const taskElement = document.createElement('div');
                taskElement.className = 'task';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'task-checkbox';
                checkbox.addEventListener('change', toggleTask);

                const textSpan = document.createElement('span');
                textSpan.className = 'task-text';
                textSpan.textContent = taskText;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'task-delete';
                deleteBtn.innerHTML = '&times;';
                deleteBtn.addEventListener('click', deleteTask);

                taskElement.appendChild(checkbox);
                taskElement.appendChild(textSpan);
                taskElement.appendChild(deleteBtn);

                // Добавляем перед emptyState
                if (emptyState) {
                    tasksContainer.insertBefore(taskElement, emptyState);
                } else {
                    tasksContainer.appendChild(taskElement);
                }

                // Очищаем поле ввода
                taskInput.value = '';

                // Скрываем emptyState если есть задачи
                updateEmptyState();

                // Сохраняем задачи
                saveTasks();
            }

            function toggleTask(e) {
                const taskText = e.target.nextElementSibling;
                taskText.classList.toggle('completed');
                saveTasks();
            }

            function deleteTask(e) {
                const taskElement = e.target.parentElement;
                taskElement.remove();
                updateEmptyState();
                saveTasks();
            }

            function updateEmptyState() {
                const tasks = tasksContainer.querySelectorAll('.task');
                if (tasks.length === 0) {
                    emptyState.style.display = 'block';
                } else {
                    emptyState.style.display = 'none';
                }
            }

            function saveTasks() {
                const tasks = [];
                document.querySelectorAll('.task').forEach(task => {
                    tasks.push({
                        text: task.querySelector('.task-text').textContent,
                        completed: task.querySelector('.task-checkbox').checked
                    });
                });
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            function loadTasks() {
                const savedTasks = JSON.parse(localStorage.getItem('tasks'));
                if (savedTasks && savedTasks.length > 0) {
                    savedTasks.forEach(task => {
                        // Создаем элемент задачи
                        const taskElement = document.createElement('div');
                        taskElement.className = 'task';

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.className = 'task-checkbox';
                        checkbox.checked = task.completed;
                        checkbox.addEventListener('change', toggleTask);

                        const textSpan = document.createElement('span');
                        textSpan.className = 'task-text';
                        if (task.completed) {
                            textSpan.classList.add('completed');
                        }
                        textSpan.textContent = task.text;

                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'task-delete';
                        deleteBtn.innerHTML = '&times;';
                        deleteBtn.addEventListener('click', deleteTask);

                        taskElement.appendChild(checkbox);
                        taskElement.appendChild(textSpan);
                        taskElement.appendChild(deleteBtn);

                        tasksContainer.insertBefore(taskElement, emptyState);
                    });
                    updateEmptyState();
                }
            }
        });
    </script>
</body>
</html>
```

Ох, чувствуете, насколько больше файл получился? Но ничего страшного, тут все довольно просто, сейчас я объясню.

### Разбор кода

1.  #### **HTML структура:**
    *   `<!DOCTYPE html>`: Объявление типа документа HTML5.
    *   `<html lang="ru">`: Корневой элемент HTML с указанием языка "ru" (русский).
    *   `<head>`: Секция с метаданными, заголовком и стилями.
        *   `<meta charset="UTF-8">`: Установка кодировки UTF-8 для поддержки кириллицы.
        *   `<meta name="viewport" content="width=device-width, initial-scale=1.0">`: Метатег для адаптивного дизайна.
        *   `<title>Modern To-Do List</title>`: Заголовок страницы.
        *   `<style>`: Встроенные стили CSS для оформления.
    *   `<body>`: Основное содержимое страницы.
        *   `<div class="container">`: Основной контейнер для всего содержимого.
            *   `<div class="header">`: Шапка приложения.
                *   `<h1>Мой Список Дел</h1>`: Заголовок списка дел.
            *   `<div class="input-container">`: Контейнер для поля ввода и кнопки добавления.
                *   `<input type="text" id="taskInput" placeholder="Добавьте новую задачу...">`: Текстовое поле для ввода новой задачи.
                *   `<button id="addTaskBtn">+</button>`: Кнопка для добавления задачи.
            *   `<div class="tasks-container" id="tasksContainer">`: Контейнер для отображения списка задач.
                *   `<div class="empty-state" id="emptyState">Нет задач. Добавьте первую!</div>`: Сообщение, отображаемое, когда нет задач.
2.  #### **CSS стили:**
    *   `:root { ... }`: Определение CSS переменных для цветовой палитры.
    *   `* { ... }`: Сброс стандартных стилей для всех элементов.
    *   `body { ... }`: Стили для тела страницы (фон, цвет текста, выравнивание).
    *   `.container { ... }`: Стили для основного контейнера (ширина, фон, тени).
    *   `.header { ... }`: Стили для шапки (фон, цвет текста, выравнивание).
    *   `.input-container { ... }`: Стили для контейнера ввода (отображение, отступы, границы).
    *   `.input-container input { ... }`: Стили для текстового поля (ширина, отступы, границы, шрифт).
    *   `.input-container button { ... }`: Стили для кнопки добавления (фон, цвет текста, границы, шрифт).
    *   `.tasks-container { ... }`: Стили для контейнера задач (отступы).
    *   `.task { ... }`: Стили для элемента задачи (отображение, выравнивание, границы).
    *   `.task-checkbox { ... }`: Стили для чекбокса (размеры, курсор).
    *   `.task-text { ... }`: Стили для текста задачи (шрифт).
    *   `.task-text.completed { ... }`: Стили для текста выполненной задачи (перечеркивание, цвет).
    *   `.task-delete { ... }`: Стили для кнопки удаления (фон, цвет текста, шрифт, прозрачность).
    *   `.empty-state { ... }`: Стили для сообщения о пустом списке (выравнивание, отступы, цвет).
    *   `@keyframes fadeIn { ... }`: Анимация появления задачи.
    *   `@media (max-width: 600px) { ... }`: Медиа-запрос для адаптивного дизайна на маленьких экранах.
3.  #### **JavaScript логика:**
    *   `document.addEventListener('DOMContentLoaded', function() { ... }`: Обработчик события загрузки DOM.
    *   `const taskInput = document.getElementById('taskInput');`: Получение элемента текстового поля по его ID.
    *   `const addTaskBtn = document.getElementById('addTaskBtn');`: Получение элемента кнопки добавления по его ID.
    *   `const tasksContainer = document.getElementById('tasksContainer');`: Получение элемента контейнера задач по его ID.
    *   `const emptyState = document.getElementById('emptyState');`: Получение элемента сообщения о пустом списке по его ID.
    *   `loadTasks();`: Загрузка задач из localStorage при загрузке страницы.
    *   `addTaskBtn.addEventListener('click', addTask);`: Установка обработчика события нажатия на кнопку добавления.
    *   `taskInput.addEventListener('keypress', function(e) { ... });`: Установка обработчика события нажатия клавиш в текстовом поле.
    *   `function addTask() { ... }`: Функция для добавления новой задачи.
        *   `const taskText = taskInput.value.trim();`: Получение текста задачи из текстового поля и удаление лишних пробелов.
        *   `if (taskText === '') return;`: Проверка, что текстовое поле не пустое.
        *   Создание элементов задачи (div, input, span, button) и установка их свойств и стилей.
        *   Добавление элементов задачи в контейнер задач.
        *   Очистка текстового поля после добавления задачи.
        *   `updateEmptyState();`: Обновление видимости сообщения о пустом списке.
        *   `saveTasks();`: Сохранение задач в localStorage.
    *   `function toggleTask(e) { ... }`: Функция для переключения состояния задачи (выполнена/не выполнена).
        *   `const taskText = e.target.nextElementSibling;`: Получение элемента текста задачи.
        *   `taskText.classList.toggle('completed');`: Переключение класса "completed" для текста задачи.
        *   `saveTasks();`: Сохранение задач в localStorage.
    *   `function deleteTask(e) { ... }`: Функция для удаления задачи.
        *   `const taskElement = e.target.parentElement;`: Получение элемента задачи.
        *   `taskElement.remove();`: Удаление элемента задачи из DOM.
        *   `updateEmptyState();`: Обновление видимости сообщения о пустом списке.
        *   `saveTasks();`: Сохранение задач в localStorage.
    *   `function updateEmptyState() { ... }`: Функция для обновления видимости сообщения о пустом списке.
        *   Проверка, есть ли задачи в контейнере задач.
        *   Установка свойства `display` для элемента сообщения о пустом списке в зависимости от наличия задач.
    *   `function saveTasks() { ... }`: Функция для сохранения задач в localStorage.
        *   Создание массива задач.
        *   Обход всех элементов задач и добавление информации о задаче (текст, состояние) в массив.
        *   Сохранение массива задач в localStorage в формате JSON.
    *   `function loadTasks() { ... }`: Функция для загрузки задач из localStorage.
        *   Загрузка массива задач из localStorage из формата JSON.
        *   Обход всех задач в массиве и создание элементов задач для каждой задачи.
        *   Добавление элементов задач в контейнер задач.
        *   `updateEmptyState();`: Обновление видимости сообщения о пустом списке.

### Итог создания второй версии

Вторая версия to-do листа имеет более сложный и функциональный код. Здесь используется адаптивный дизайн, сохранение задач в localStorage, добавление и удаление задач, а также отметка задач как выполненных. Подобным приложением уже даже можно полдьзоваться на повседневной     основе!

## Итог статьи

В этой статье мы рассмотрели создание двух версий to-do листа: простой и продвинутой. Простая версия подходит для начинающих, а продвинутая версия имеет больше функциональности и лучший дизайн. Вы можете использовать эти примеры в качестве основы для создания своего собственного to-do листа.
