# Полное руководство по JavaScript для начинающих: от основ до встраивания в HTML

## Введение в JavaScript

JavaScript (JS) — это язык программирования, который делает веб-страницы интерактивными. В отличие от HTML (разметка страницы) и CSS (стили), JS добавляет динамическое поведение:

- Реагирует на действия пользователя (клики, ввод текста)
- Изменяет содержимое страницы без её перезагрузки
- Отправляет запросы к серверу (AJAX)
- Работает с cookies и локальным хранилищем

## 1. Основы синтаксиса JavaScript

### 1.1 Переменные и типы данных

```javascript
// Объявление переменных
let message = "Привет, мир!"; // строковая переменная
const PI = 3.14;              // константа
var oldVariable = 42;         // устаревший способ (не рекомендуется)

// Основные типы данных
let string = "Текст";
let number = 123;
let boolean = true; // или false
let nullValue = null;
let undefinedValue;
let object = { name: "John", age: 30 };
let array = [1, 2, 3];
```

### 1.2 Операторы

```javascript
// Арифметические
let sum = 5 + 3;  // 8
let div = 10 / 2; // 5

// Сравнения
console.log(5 == "5");  // true (нестрогое)
console.log(5 === "5"); // false (строгое)

// Логические
if (age > 18 && age < 65) {
  console.log("Вы взрослый");
}
```

### 1.3 Управляющие конструкции

```javascript
// Условные операторы
let hour = 10;
if (hour < 12) {
  console.log("Доброе утро");
} else {
  console.log("Добрый день");
}

// Циклы
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

let j = 0;
while (j < 3) {
  console.log(j); // 0, 1, 2
  j++;
}
```

## 2. Работа с функциями

```javascript
// Объявление функции
function greet(name) {
  return `Привет, ${name}!`;
}

// Вызов функции
let greeting = greet("Анна");
console.log(greeting); // Привет, Анна!

// Стрелочные функции (ES6+)
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5
```

## 3. Встраивание JavaScript в HTML

### 3.1 Внутренний JavaScript

Добавляется непосредственно в HTML-файл с помощью тега `<script>`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Пример JS в HTML</title>
  <script>
    // JavaScript код здесь
    alert('Страница загружается!');
  </script>
</head>
<body>
  <h1>Моя страница</h1>
</body>
</html>
```

### 3.2 Внешний JavaScript

Рекомендуемый способ — вынесение кода в отдельный файл:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Внешний JS</title>
  <script src="script.js" defer></script>
</head>
<body>
  <button id="myButton">Нажми меня</button>
</body>
</html>
```

Файл `script.js`:
```javascript
document.getElementById('myButton').addEventListener('click', function() {
  alert('Кнопка нажата!');
});
```

### 3.3 Атрибуты тега script

- `defer` — скрипт загружается параллельно с HTML, но выполняется после загрузки DOM
- `async` — скрипт загружается и выполняется асинхронно (порядок выполнения не гарантирован)

## 4. Доступ к элементам DOM

DOM (Document Object Model) — представление HTML-документа в виде дерева объектов.

```javascript
// Получение элементов
let elem = document.getElementById('myId');
let elems = document.querySelectorAll('.myClass');

// Изменение содержимого
elem.textContent = 'Новый текст';
elem.innerHTML = '<strong>Жирный</strong> текст';

// Создание новых элементов
let newDiv = document.createElement('div');
newDiv.className = 'alert';
document.body.appendChild(newDiv);
```

## 5. Обработка событий

```javascript
// Способ 1: через атрибут HTML
<button onclick="alert('Клик!')">Нажми</button>

// Способ 2: через свойство элемента
let btn = document.getElementById('myBtn');
btn.onclick = function() {
  console.log('Кнопка нажата');
};

// Способ 3: addEventListener (рекомендуется)
btn.addEventListener('click', function(event) {
  console.log('Координаты клика:', event.clientX, event.clientY);
});
```

## 6. Работа с формами

```html
<form id="myForm">
  <input type="text" name="username" placeholder="Имя">
  <input type="password" name="pwd" placeholder="Пароль">
  <button type="submit">Отправить</button>
</form>

<script>
  document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Отменяем стандартную отправку
    
    let username = this.elements.username.value;
    let password = this.elements.pwd.value;
    
    console.log('Отправка:', { username, password });
  });
</script>
```

## 7. Современный JavaScript (ES6+)

### 7.1 Let/Const и блочная область видимости

```javascript
if (true) {
  let x = 1;  // видна только в этом блоке
  const y = 2; // константа, видна только здесь
}
```

### 7.2 Шаблонные строки

```javascript
let name = "Иван";
console.log(`Привет, ${name}! Сегодня ${new Date().toLocaleDateString()}`);
```

### 7.3 Стрелочные функции

```javascript
const numbers = [1, 2, 3];
const squares = numbers.map(n => n * n);
```

## 8. Отладка JavaScript

1. **console.log()** — вывод в консоль браузера
2. **debugger** — остановка выполнения для отладки
3. Инструменты разработчика в браузере (F12)

## 9. Лучшие практики

1. Всегда объявляйте переменные через `let` или `const`
2. Используйте строгое сравнение (`===`)
3. Называйте переменные осмысленно
4. Комментируйте сложные участки кода
5. Разделяйте код на небольшие функции
6. Используйте внешние файлы для скриптов

## Заключение

JavaScript — мощный язык, который позволяет создавать интерактивные веб-приложения. Начните с простых скриптов, постепенно осваивая более сложные концепции. Практикуйтесь, экспериментируйте и не бойтесь ошибок — они лучший учитель!

## Дополнительные ресурсы

- [MDN JavaScript](https://developer.mozilla.org/ru/docs/Web/JavaScript) — наиболее полная документация
- [Learn JavaScript](https://learn.javascript.ru/) — современный учебник
- [JavaScript.info](https://javascript.info/) — англоязычный аналог 