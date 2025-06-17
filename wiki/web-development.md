# Веб-разработка: HTML и CSS

Этот документ представляет собой подробное руководство по созданию веб-сайтов с использованием HTML и CSS, основанное на современных практиках и примерах.

## 1. Введение в HTML

### 1.1. Базовая структура HTML-документа

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Мой первый сайт</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Добро пожаловать</h1>
    </header>
    <main>
        <p>Это мой первый веб-сайт!</p>
    </main>
    <footer>
        <p>&copy; 2024 Мой сайт</p>
    </footer>
</body>
</html>
```

### 1.2. Семантические элементы HTML5

```html
<!-- Семантическая структура страницы -->
<header>
    <nav>
        <ul>
            <li><a href="#home">Главная</a></li>
            <li><a href="#about">О нас</a></li>
            <li><a href="#contact">Контакты</a></li>
        </ul>
    </nav>
</header>

<main>
    <section id="home">
        <h2>Главная страница</h2>
        <article>
            <h3>Новости</h3>
            <p>Содержимое статьи...</p>
        </article>
    </section>

    <aside>
        <h3>Боковая панель</h3>
        <p>Дополнительная информация...</p>
    </aside>
</main>

<footer>
    <p>Контактная информация</p>
</footer>
```

## 2. Работа с формами

### 2.1. Создание форм

```html
<form action="/submit" method="POST">
    <fieldset>
        <legend>Контактная информация</legend>
        
        <div class="form-group">
            <label for="name">Имя:</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        </div>

        <div class="form-group">
            <label for="message">Сообщение:</label>
            <textarea id="message" name="message" rows="4"></textarea>
        </div>

        <div class="form-group">
            <label for="country">Страна:</label>
            <select id="country" name="country">
                <option value="ru">Россия</option>
                <option value="by">Беларусь</option>
                <option value="kz">Казахстан</option>
            </select>
        </div>

        <button type="submit">Отправить</button>
    </fieldset>
</form>
```

### 2.2. Валидация форм

```html
<form novalidate>
    <div class="form-group">
        <label for="username">Имя пользователя:</label>
        <input type="text" 
               id="username" 
               name="username" 
               required 
               minlength="3" 
               maxlength="20" 
               pattern="[A-Za-z0-9]+"
               title="Только буквы и цифры">
    </div>

    <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" 
               id="password" 
               name="password" 
               required 
               minlength="8"
               pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
               title="Минимум 8 символов, включая цифры, строчные и заглавные буквы">
    </div>
</form>
```

## 3. Основы CSS

### 3.1. Селекторы и специфичность

```css
/* Базовые селекторы */
.element { }           /* По классу */
#id { }               /* По ID */
div { }               /* По тегу */
div.class { }         /* Комбинация */
div > p { }           /* Дочерний элемент */
div + p { }           /* Соседний элемент */
div ~ p { }           /* Все соседние элементы */

/* Атрибутные селекторы */
[type="text"] { }     /* Точное совпадение */
[class*="btn"] { }    /* Содержит */
[class^="btn"] { }    /* Начинается с */
[class$="btn"] { }    /* Заканчивается на */

/* Псевдоклассы */
:hover { }            /* При наведении */
:focus { }            /* При фокусе */
:first-child { }      /* Первый элемент */
:last-child { }       /* Последний элемент */
:nth-child(n) { }     /* n-й элемент */
```

### 3.2. Боксовая модель

```css
.box {
    /* Размеры */
    width: 300px;
    height: 200px;
    
    /* Отступы */
    padding: 20px;
    margin: 10px;
    
    /* Границы */
    border: 2px solid #333;
    border-radius: 5px;
    
    /* Фон */
    background-color: #f0f0f0;
    
    /* Тень */
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    
    /* Позиционирование */
    position: relative;
    top: 0;
    left: 0;
}
```

## 4. Flexbox и Grid

### 4.1. Flexbox

```css
/* Контейнер */
.flex-container {
    display: flex;
    flex-direction: row;          /* row | column */
    flex-wrap: wrap;             /* wrap | nowrap */
    justify-content: space-between; /* flex-start | center | space-around */
    align-items: center;         /* stretch | flex-start | flex-end */
    gap: 20px;                   /* Отступы между элементами */
}

/* Элементы */
.flex-item {
    flex: 1;                     /* flex-grow | flex-shrink | flex-basis */
    order: 1;                    /* Порядок элемента */
    align-self: flex-start;      /* Выравнивание отдельного элемента */
}
```

### 4.2. Grid

```css
/* Контейнер */
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);  /* 3 колонки равной ширины */
    grid-template-rows: auto;               /* Автоматическая высота строк */
    gap: 20px;                              /* Отступы между элементами */
    
    /* Области сетки */
    grid-template-areas:
        "header header header"
        "sidebar main main"
        "footer footer footer";
}

/* Элементы */
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }

/* Отдельный элемент */
.grid-item {
    grid-column: 1 / 3;          /* Занимает колонки с 1 по 3 */
    grid-row: 1 / 2;             /* Занимает строки с 1 по 2 */
}
```

## 5. Адаптивный дизайн

### 5.1. Медиа-запросы

```css
/* Базовые стили для мобильных устройств */
.container {
    width: 100%;
    padding: 10px;
}

/* Планшеты (768px и выше) */
@media (min-width: 768px) {
    .container {
        width: 750px;
        margin: 0 auto;
    }
}

/* Десктопы (992px и выше) */
@media (min-width: 992px) {
    .container {
        width: 970px;
    }
}

/* Большие экраны (1200px и выше) */
@media (min-width: 1200px) {
    .container {
        width: 1170px;
    }
}
```

### 5.2. Адаптивные изображения

```css
/* Базовые стили для изображений */
img {
    max-width: 100%;
    height: auto;
}

/* Адаптивные изображения с разными размерами */
.responsive-img {
    width: 100%;
    height: auto;
    object-fit: cover;
}

/* Фоновые изображения */
.hero {
    background-image: url('small.jpg');
    background-size: cover;
    background-position: center;
}

@media (min-width: 768px) {
    .hero {
        background-image: url('medium.jpg');
    }
}

@media (min-width: 1200px) {
    .hero {
        background-image: url('large.jpg');
    }
}
```

## 6. Анимации и переходы

### 6.1. CSS-переходы

```css
.button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    transition: all 0.3s ease;
}

.button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
```

### 6.2. CSS-анимации

```css
@keyframes slideIn {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.animated-element {
    animation: slideIn 0.5s ease-out;
}

/* Бесконечная анимация */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.spinner {
    animation: spin 2s linear infinite;
}
```

## 7. Оптимизация производительности

### 7.1. Оптимизация CSS

```css
/* Использование CSS-переменных */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --font-family: 'Arial', sans-serif;
}

/* Минимизация использования !important */
.button {
    color: var(--primary-color);
    font-family: var(--font-family);
}

/* Использование сокращенных свойств */
.element {
    margin: 10px 20px;
    padding: 15px;
    border: 1px solid #ddd;
}
```

### 7.2. Оптимизация изображений

```css
/* Ленивая загрузка изображений */
.lazy-image {
    opacity: 0;
    transition: opacity 0.3s;
}

.lazy-image.loaded {
    opacity: 1;
}

/* Оптимизация фоновых изображений */
.optimized-bg {
    background-image: url('image.webp');
    background-size: cover;
    background-position: center;
    will-change: transform;
}
```

## 8. Доступность (A11Y)

### 8.1. ARIA-атрибуты

```html
<!-- Пример использования ARIA -->
<nav role="navigation" aria-label="Главное меню">
    <ul>
        <li><a href="#" aria-current="page">Главная</a></li>
        <li><a href="#">О нас</a></li>
    </ul>
</nav>

<button aria-label="Закрыть меню" aria-expanded="false">
    <span class="icon">×</span>
</button>
```

### 8.2. Стили для доступности

```css
/* Фокус для клавиатурной навигации */
:focus {
    outline: 3px solid #007bff;
    outline-offset: 2px;
}

/* Увеличение контрастности */
.high-contrast {
    color: #000;
    background-color: #fff;
}

/* Скрытие элементов для скринридеров */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}
```

## 9. Полезные ресурсы

1. [MDN Web Docs](https://developer.mozilla.org/ru/)
2. [CSS-Tricks](https://css-tricks.com/)
3. [W3Schools](https://www.w3schools.com/)
4. [Can I Use](https://caniuse.com/)
5. [Web.dev](https://web.dev/)
6. [A11Y Project](https://www.a11yproject.com/)
7. [Наш курс](https://x200l.github.io/SITeducation/course.html)

## Заключение

Этот справочник охватывает основные аспекты веб-разработки с использованием HTML и CSS. Для успешной работы в области веб-разработки рекомендуется:

1. Изучать современные стандарты и спецификации
2. Практиковаться в создании адаптивных и доступных сайтов
3. Следить за новыми технологиями и инструментами
4. Участвовать в сообществах разработчиков
5. Изучать лучшие практики и паттерны дизайна

Помните, что хороший веб-разработчик должен не только создавать красивые сайты, но и обеспечивать их производительность, доступность и удобство использования. 