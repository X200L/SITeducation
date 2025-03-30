# Создаем продвинутый веб-калькулятор: стань повелителем цифр! 👑

Привет, веб-мастера! В этот раз мы создадим не просто калькулятор, а настоящего цифрового монстра, который умеет все! 🧮💪

## Наш арсенал: Инструменты ниндзя-кодера

Для создания этого шедевра нам понадобятся:

*   **HTML:** Для создания структуры (кнопки, дисплей и т.д.).
*   **CSS:** Чтобы придать калькулятору стильный вид.
*   **JavaScript:** Чтобы оживить его и заставить считать как профи.

## План действий: Шаг за шагом к величию

1.  **HTML-скелет:** Создаем прочную основу для нашего калькулятора.
2.  **CSS-тюнинг:** Делаем его красивым и удобным в использовании.
3.  **JavaScript-магия:** Пишем код, который обрабатывает ввод, вычисляет результаты и показывает их на экране.

## HTML-код: Создаем фундамент

Создайте файл `index.html` и вставьте следующий код:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Продвинутый веб-калькулятор</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="calculator">
        <input type="text" id="display" readonly>
        <div class="buttons">
            <button onclick="clearDisplay()">C</button>
            <button onclick="operate('(')">(</button>
            <button onclick="operate(')')">)</button>
            <button onclick="operate('/')">/</button>
            <button onclick="operate('7')">7</button>
            <button onclick="operate('8')">8</button>
            <button onclick="operate('9')">9</button>
            <button onclick="operate('*')">*</button>
            <button onclick="operate('4')">4</button>
            <button onclick="operate('5')">5</button>
            <button onclick="operate('6')">6</button>
            <button onclick="operate('-')">-</button>
            <button onclick="operate('1')">1</button>
            <button onclick="operate('2')">2</button>
            <button onclick="operate('3')">3</button>
            <button onclick="operate('+')">+</button>
            <button onclick="operate('0')">0</button>
            <button onclick="operate('.')">.</button>
            <button onclick="calculate()">=</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

## CSS-стили: Наводим красоту

Создайте файл `style.css` и добавьте следующие стили:

```css
.calculator {
    width: 300px;
    margin: 50px auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    background-color: #f9f9f9;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

#display {
    width: 100%;
    padding: 10px;
    font-size: 24px;
    text-align: right;
    border: none;
    background-color: #fff;
    color: #333;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

button {
    padding: 20px;
    font-size: 20px;
    border: none;
    background-color: #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

button:hover {
    background-color: #e0e0e0;
}

button:active {
    background-color: #ddd;
}
```

## JavaScript-код: Запускаем двигатель

Создайте файл `script.js` и вставьте следующий код:

```javascript
let display = document.getElementById('display');
let currentInput = '';

function operate(value) {
    currentInput += value;
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
}

function calculate() {
    try {
        // Используем eval() с осторожностью!
        let result = eval(currentInput);
        display.value = result;
        currentInput = result.toString(); // Сохраняем результат для дальнейших операций
    } catch (error) {
        display.value = 'Ошибка! 🤯';
    }
}
```

## Разбор полетов: Что здесь происходит?

*   **HTML:** Создает структуру калькулятора с кнопками и дисплеем.
*   **CSS:** Задает стили для калькулятора, чтобы он выглядел круто.
*   **JavaScript:**
    *   `operate(value)`: Добавляет введенные символы на дисплей.
    *   `clearDisplay()`: Очищает дисплей.
    *   `calculate()`: Вычисляет результат с помощью `eval()` (будьте осторожны с этой функцией!) и показывает его на дисплее.

## Запускаем нашего зверя: Проверяем, как он работает

1.  Сохраните все три файла (HTML, CSS и JavaScript) в одной папке.
2.  Откройте `index.html` в браузере.
3.  Наслаждайтесь своим новым продвинутым веб-калькулятором! 🎉

## Дополнительные возможности: Превращаем калькулятор в супергероя

*   Добавьте поддержку клавиатуры, чтобы можно было вводить цифры и операции с клавиатуры.
*   Реализуйте историю вычислений, чтобы можно было просматривать предыдущие результаты.
*   Добавьте больше математических функций (синус, косинус, тангенс, логарифмы и т.д.).
*   Сделайте возможность изменять тему оформления калькулятора.

## Советы для профи: Как избежать ошибок

*   Будьте осторожны с функцией `eval()`, так как она может быть опасной, если вы не уверены в источнике входных данных.
*   Используйте инструменты разработчика в браузере для отладки JavaScript-кода.
*   Проверяйте, что все файлы подключены правильно в HTML-файле.

## Заключение: Ты - король калькуляторов!

Создание веб-калькулятора - это отличный способ улучшить свои навыки веб-разработки. Вы можете экспериментировать с кодом, добавлять новые функции и делать свой калькулятор еще круче. Главное - не останавливаться на достигнутом и продолжать учиться! 😉

Удачи в ваших проектах! 🚀 