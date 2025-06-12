# Python: Краткий справочник

Этот документ представляет собой краткий справочник по языку программирования Python, основанный на ключевых концепциях и примерах.

## 1. Введение в Python

### 1.1. Первая программа: "Hello, World!"

```python
print("Hello, World!")
```

**Пояснение:**
* `print()`: Встроенная функция для вывода текста на экран.
* Строки можно заключать как в одинарные, так и в двойные кавычки.

## 2. Типы данных и переменные

### 2.1. Базовые типы данных

* `int`: Целое число (например, `age = 25`)
* `float`: Число с плавающей точкой (например, `height = 1.75`)
* `str`: Строка (например, `name = "Иван"`)
* `bool`: Логический тип (например, `is_student = True`)

**Пример:**

```python
# Числа
age = 25
height = 1.75

# Строки
name = "Иван"
message = 'Привет'

# Булевы значения
is_student = True
is_working = False

print(f"Возраст: {age}")        # Вывод: 25
print(f"Рост: {height}")        # Вывод: 1.75
print(f"Имя: {name}")           # Вывод: Иван
print(f"Студент: {is_student}") # Вывод: True
```

### 2.2. Операторы

* **Арифметические операторы**: `+` (сложение), `-` (вычитание), `*` (умножение), `/` (деление), `//` (целочисленное деление), `%` (остаток от деления), `**` (возведение в степень)
* **Операторы сравнения**: `==` (равно), `!=` (не равно), `>` (больше), `<` (меньше), `>=` (больше или равно), `<=` (меньше или равно)
* **Логические операторы**: `and` (логическое И), `or` (логическое ИЛИ), `not` (логическое НЕ)

**Пример:**

```python
a = 5
b = 3

print(f"a + b = {a + b}")    # Сложение: 8
print(f"a > b = {a > b}")    # Сравнение: True
print(f"not (a > b) = {not (a > b)}")  # Логическое НЕ: False
```

## 3. Управляющие конструкции

### 3.1. Условные операторы

#### `if-else`

```python
age = 18

if age >= 18:
    print("Вы совершеннолетний")
else:
    print("Вы несовершеннолетний")
```

#### `elif`

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Оценка: {grade}")
```

### 3.2. Циклы

#### `for`

```python
# Цикл по диапазону
for i in range(5):
    print(i)  # Вывод: 0 1 2 3 4

# Цикл по списку
fruits = ["яблоко", "банан", "апельсин"]
for fruit in fruits:
    print(fruit)
```

#### `while`

```python
count = 0
while count < 5:
    print(count)
    count += 1
```

## 4. Функции

### 4.1. Объявление и вызов функций

```python
def add(a, b):
    return a + b

result = add(5, 3)  # Вызов функции
print(f"5 + 3 = {result}")  # Вывод: 8
```

### 4.2. Функции с параметрами по умолчанию

```python
def greet(name="Гость"):
    return f"Привет, {name}!"

print(greet())           # Вывод: Привет, Гость!
print(greet("Иван"))    # Вывод: Привет, Иван!
```

## 5. Структуры данных

### 5.1. Списки

```python
# Создание списка
numbers = [1, 2, 3, 4, 5]

# Добавление элементов
numbers.append(6)
numbers.insert(0, 0)

# Удаление элементов
numbers.remove(3)
popped_number = numbers.pop()

# Сортировка
numbers.sort()
numbers.sort(reverse=True)

# Срезы
first_three = numbers[:3]
last_two = numbers[-2:]
```

### 5.2. Словари

```python
# Создание словаря
person = {
    "name": "Иван",
    "age": 25,
    "city": "Москва"
}

# Доступ к значениям
name = person["name"]
age = person.get("age")

# Добавление и изменение значений
person["job"] = "Программист"
person["age"] = 26

# Удаление элементов
del person["city"]
```

## 6. Работа с файлами

### 6.1. Запись в файл

```python
with open("example.txt", "w", encoding="utf-8") as file:
    file.write("Привет, мир!")
```

### 6.2. Чтение из файла

```python
with open("example.txt", "r", encoding="utf-8") as file:
    content = file.read()
    print(content)
```

## 7. Обработка ошибок

### 7.1. Try-except

```python
try:
    number = int(input("Введите число: "))
    result = 10 / number
except ValueError:
    print("Ошибка: введите корректное число")
except ZeroDivisionError:
    print("Ошибка: деление на ноль невозможно")
except Exception as e:
    print(f"Произошла ошибка: {e}")
else:
    print(f"Результат: {result}")
finally:
    print("Программа завершена")
```

## 8. Модули и пакеты

### 8.1. Импорт модулей

```python
# Импорт всего модуля
import math

# Импорт конкретной функции
from random import randint

# Импорт с псевдонимом
import numpy as np

# Использование
print(math.pi)
print(randint(1, 10))
```


## 9. Полезные ресурсы

1. [Официальная документация Python](https://docs.python.org/3/)
2. [Python для начинающих](https://pythonworld.ru/)
3. [Stepik - курсы по Python](https://stepik.org/course/67/promo)
4. [Codecademy - Python](https://www.codecademy.com/learn/learn-python)

## Заключение

Этот краткий справочник охватывает основные аспекты языка программирования Python. Для более глубокого изучения рекомендуется обратиться к специализированной литературе и практике. 