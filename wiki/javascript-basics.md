# JavaScript: Краткий справочник

Этот документ представляет собой краткий справочник по языку программирования JavaScript, основанный на ключевых концепциях и примерах.

## 1. Введение в JavaScript

### 1.1. Первая программа: "Hello, World!"

```javascript
console.log("Hello, World!");
```

**Пояснение:**
* `console.log()`: Метод для вывода информации в консоль браузера.
* Строки можно заключать как в одинарные, так и в двойные кавычки.

## 2. Типы данных и переменные

### 2.1. Базовые типы данных

* `Number`: Число (например, `let age = 25`)
* `String`: Строка (например, `let name = "Иван"`)
* `Boolean`: Логический тип (например, `let isStudent = true`)
* `undefined`: Неопределенное значение
* `null`: Пустое значение
* `Object`: Объект
* `Array`: Массив

**Пример:**

```javascript
// Числа
let age = 25;
let height = 1.75;

// Строки
let name = "Иван";
let message = 'Привет';

// Булевы значения
let isStudent = true;
let isWorking = false;

console.log(`Возраст: ${age}`);        // Вывод: 25
console.log(`Рост: ${height}`);        // Вывод: 1.75
console.log(`Имя: ${name}`);           // Вывод: Иван
console.log(`Студент: ${isStudent}`);  // Вывод: true
```

### 2.2. Операторы

* **Арифметические операторы**: `+` (сложение), `-` (вычитание), `*` (умножение), `/` (деление), `%` (остаток от деления), `**` (возведение в степень)
* **Операторы сравнения**: `==` (равно), `===` (строго равно), `!=` (не равно), `!==` (строго не равно), `>` (больше), `<` (меньше), `>=` (больше или равно), `<=` (меньше или равно)
* **Логические операторы**: `&&` (логическое И), `||` (логическое ИЛИ), `!` (логическое НЕ)

**Пример:**

```javascript
let a = 5;
let b = 3;

console.log(`a + b = ${a + b}`);    // Сложение: 8
console.log(`a > b = ${a > b}`);    // Сравнение: true
console.log(`!(a > b) = ${!(a > b)}`);  // Логическое НЕ: false
```

## 3. Управляющие конструкции

### 3.1. Условные операторы

#### `if-else`

```javascript
let age = 18;

if (age >= 18) {
    console.log("Вы совершеннолетний");
} else {
    console.log("Вы несовершеннолетний");
}
```

#### `else if`

```javascript
let score = 85;

if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else {
    grade = "F";
}

console.log(`Оценка: ${grade}`);
```

### 3.2. Циклы

#### `for`

```javascript
// Цикл по диапазону
for (let i = 0; i < 5; i++) {
    console.log(i);  // Вывод: 0 1 2 3 4
}

// Цикл по массиву
const fruits = ["яблоко", "банан", "апельсин"];
for (let fruit of fruits) {
    console.log(fruit);
}
```

#### `while`

```javascript
let count = 0;
while (count < 5) {
    console.log(count);
    count++;
}
```

## 4. Функции

### 4.1. Объявление и вызов функций

```javascript
function add(a, b) {
    return a + b;
}

const result = add(5, 3);  // Вызов функции
console.log(`5 + 3 = ${result}`);  // Вывод: 8
```

### 4.2. Стрелочные функции

```javascript
const add = (a, b) => a + b;
const greet = (name = "Гость") => `Привет, ${name}!`;

console.log(greet());           // Вывод: Привет, Гость!
console.log(greet("Иван"));    // Вывод: Привет, Иван!
```

## 5. Структуры данных

### 5.1. Массивы

```javascript
// Создание массива
const numbers = [1, 2, 3, 4, 5];

// Добавление элементов
numbers.push(6);
numbers.unshift(0);

// Удаление элементов
numbers.pop();
numbers.shift();

// Сортировка
numbers.sort();
numbers.sort((a, b) => b - a);

// Срезы
const firstThree = numbers.slice(0, 3);
const lastTwo = numbers.slice(-2);
```

### 5.2. Объекты

```javascript
// Создание объекта
const person = {
    name: "Иван",
    age: 25,
    city: "Москва"
};

// Доступ к значениям
const name = person.name;
const age = person["age"];

// Добавление и изменение значений
person.job = "Программист";
person.age = 26;

// Удаление свойств
delete person.city;
```

## 6. Работа с DOM

### 6.1. Выбор элементов

```javascript
// Выбор по ID
const element = document.getElementById("myId");

// Выбор по классу
const elements = document.getElementsByClassName("myClass");

// Выбор по тегу
const paragraphs = document.getElementsByTagName("p");

// Современный способ
const element = document.querySelector(".myClass");
const elements = document.querySelectorAll(".myClass");
```

### 6.2. Манипуляции с DOM

```javascript
// Создание элемента
const div = document.createElement("div");
div.textContent = "Новый элемент";

// Добавление элемента
document.body.appendChild(div);

// Изменение стилей
div.style.color = "red";
div.style.backgroundColor = "blue";

// Добавление классов
div.classList.add("new-class");
div.classList.remove("old-class");
```

### 6.3. Работа с HTML-контентом

```javascript
// Изменение текстового содержимого
element.textContent = "Новый текст";
element.innerText = "Новый текст с форматированием";

// Изменение HTML-содержимого
element.innerHTML = "<span>Новый HTML</span>";

// Получение и установка атрибутов
const value = element.getAttribute("data-value");
element.setAttribute("data-value", "новое значение");

// Работа с формами
const form = document.querySelector("form");
const input = form.querySelector("input");
const value = input.value;
input.value = "новое значение";

// Валидация формы
form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (input.value.trim() === "") {
        alert("Поле не может быть пустым");
        return;
    }
    // Отправка формы
});
```

### 6.4. Создание и управление элементами

```javascript
// Создание сложной структуры
function createCard(title, content) {
    const card = document.createElement("div");
    card.className = "card";
    
    const cardTitle = document.createElement("h3");
    cardTitle.textContent = title;
    
    const cardContent = document.createElement("p");
    cardContent.textContent = content;
    
    card.appendChild(cardTitle);
    card.appendChild(cardContent);
    
    return card;
}

// Использование
const container = document.querySelector(".container");
const card = createCard("Заголовок", "Содержимое");
container.appendChild(card);
```

## 7. Анимация и перемещение объектов

### 7.1. Базовые анимации

```javascript
// Анимация с помощью setInterval
function moveElement(element, distance, duration) {
    let start = null;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const position = (progress / duration) * distance;
        
        element.style.transform = `translateX(${position}px)`;
        
        if (progress < duration) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

// Использование
const box = document.querySelector(".box");
moveElement(box, 200, 1000); // Перемещение на 200px за 1 секунду
```

### 7.2. Плавные анимации

```javascript
// CSS-анимации через JavaScript
function animateElement(element, properties, duration) {
    element.style.transition = `all ${duration}ms ease`;
    Object.assign(element.style, properties);
}

// Использование
const element = document.querySelector(".animated");
animateElement(element, {
    transform: "translateX(100px) rotate(45deg)",
    opacity: 0.5,
    backgroundColor: "red"
}, 500);
```

### 7.3. Интерактивные анимации

```javascript
// Перетаскивание элемента
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    element.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Использование
const draggableElement = document.querySelector(".draggable");
makeDraggable(draggableElement);
```

### 7.4. Анимации с использованием библиотек

```javascript
// Пример с использованием GSAP
// Сначала подключите библиотеку:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.0/gsap.min.js"></script>

// Простая анимация
gsap.to(".box", {
    duration: 1,
    x: 100,
    y: 100,
    rotation: 360,
    ease: "bounce.out"
});

// Последовательность анимаций
gsap.timeline()
    .to(".box", { duration: 1, x: 100 })
    .to(".box", { duration: 1, y: 100 })
    .to(".box", { duration: 1, rotation: 360 });
```

## 8. Обработка событий

### 8.1. Слушатели событий

```javascript
// Добавление обработчика
element.addEventListener("click", function(event) {
    console.log("Элемент кликнут!");
});

// Удаление обработчика
element.removeEventListener("click", handler);

// Предотвращение стандартного поведения
form.addEventListener("submit", function(event) {
    event.preventDefault();
    // Ваш код
});
```

## 9. Асинхронное программирование

### 9.1. Промисы

```javascript
// Создание промиса
const promise = new Promise((resolve, reject) => {
    // Асинхронная операция
    if (success) {
        resolve(result);
    } else {
        reject(error);
    }
});

// Использование промиса
promise
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

### 9.2. Async/Await

```javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
```

## 10. Полезные ресурсы

1. [MDN Web Docs](https://developer.mozilla.org/ru/docs/Web/JavaScript)
2. [JavaScript.info](https://learn.javascript.ru/)
3. [Codecademy - JavaScript](https://www.codecademy.com/learn/introduction-to-javascript)
4. [Eloquent JavaScript](https://eloquentjavascript.net/)

## Заключение

Этот краткий справочник охватывает основные аспекты языка программирования JavaScript. Для более глубокого изучения рекомендуется обратиться к специализированной литературе и практике. 