# Язык программирования C: Краткий справочник

Этот документ представляет собой краткий справочник по языку программирования C, основанный на ключевых концепциях и примерах.

## 1. Введение в язык Си

### 1.1. Первая программа: "Hello, World!"

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

**Пояснение:**

*   `#include <stdio.h>`: Подключение стандартной библиотеки ввода-вывода, необходимой для использования функции `printf`.
*   `main()`: Главная функция, с которой начинается выполнение любой программы на C.
*   `printf("Hello, World!\n");`: Функция `printf` выводит текст "Hello, World!" на экран. `\n` добавляет символ новой строки.
*   `return 0;`: Возвращает 0, сигнализируя об успешном завершении программы.

## 2. Типы, операторы и выражения

### 2.1. Базовые типы данных

*   `int`: Целое число (например, `int a = 10;`).
*   `float`: Число с плавающей точкой (например, `float b = 3.14;`).
*   `double`: Число с двойной точностью (например, `double c = 2.71828;`).
*   `char`: Символ (например, `char d = 'A';`).

**Пример:**

```c
#include <stdio.h>

int main() {
    int a = 10;
    float b = 3.14;
    double c = 2.71828;
    char d = 'A';

    printf("int: %d\n", a);       // Вывод: 10
    printf("float: %f\n", b);     // Вывод: 3.140000
    printf("double: %lf\n", c);    // Вывод: 2.718280
    printf("char: %c\n", d);       // Вывод: A

    return 0;
}
```

**Пояснение:**

*   `%d`: Спецификатор формата для вывода целых чисел (`int`).
*   `%f`: Спецификатор формата для вывода чисел с плавающей точкой (`float`).
*   `%lf`: Спецификатор формата для вывода чисел с двойной точностью (`double`).
*   `%c`: Спецификатор формата для вывода символов (`char`).

### 2.2. Операторы

*   **Арифметические операторы**: `+` (сложение), `-` (вычитание), `*` (умножение), `/` (деление), `%` (остаток от деления).
*   **Операторы сравнения**: `==` (равно), `!=` (не равно), `>` (больше), `<` (меньше), `>=` (больше или равно), `<=` (меньше или равно).
*   **Логические операторы**: `&&` (логическое И), `||` (логическое ИЛИ), `!` (логическое НЕ).

**Пример:**

```c
#include <stdio.h>

int main() {
    int a = 5, b = 3;

    printf("a + b = %d\n", a + b);   // Сложение: 8
    printf("a > b = %d\n", a > b);   // Сравнение: 1 (true)
    printf("!(a > b) = %d\n", !(a > b)); // Логическое НЕ: 0 (false)

    return 0;
}
```

## 3. Управляющие конструкции

### 3.1. Условные операторы

#### `if-else`

```c
#include <stdio.h>

int main() {
    int age = 18;

    if (age >= 18) {
        printf("Вы совершеннолетний.\n");
    } else {
        printf("Вы несовершеннолетний.\n");
    }

    return 0;
}
```

#### `switch-case`

```c
#include <stdio.h>

int main() {
    int day = 3;

    switch (day) {
        case 1: printf("Понедельник\n"); break;
        case 2: printf("Вторник\n"); break;
        case 3: printf("Среда\n"); break;
        default: printf("Другой день\n");
    }

    return 0;
}
```

### 3.2. Циклы

#### `for`

```c
#include <stdio.h>

int main() {
    for (int i = 0; i < 5; i++) {
        printf("%d\n", i);  // Вывод: 0 1 2 3 4
    }

    return 0;
}
```

#### `while`

```c
#include <stdio.h>

int main() {
    int i = 0;

    while (i < 5) {
        printf("%d\n", i);
        i++;
    }

    return 0;
}
```

#### `do-while`

```c
#include <stdio.h>

int main() {
    int i = 0;

    do {
        printf("%d\n", i);
        i++;
    } while (i < 5);

    return 0;
}
```

## 4. Функции и структура программы

### 4.1. Объявление и вызов функций

```c
#include <stdio.h>

// Объявление функции
int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(5, 3);  // Вызов функции
    printf("5 + 3 = %d\n", result);  // Вывод: 8
    return 0;
}
```

## 5. Указатели и массивы

### 5.1. Указатели

Указатели хранят адреса переменных.

```c
#include <stdio.h>

int main() {
    int x = 10;
    int *ptr = &x;  // ptr хранит адрес переменной x

    printf("Значение x: %d\n", x);       // Вывод: 10
    printf("Адрес x: %p\n", (void*)&x);  // Вывод: Адрес x
    printf("Значение ptr: %p\n", (void*)ptr); // Вывод: Адрес x
    printf("Значение по адресу ptr: %d\n", *ptr); // Вывод: 10 (разыменование указателя)

    return 0;
}
```

### 5.2. Массивы

#### Статические массивы

```c
#include <stdio.h>

int main() {
    int arr[5] = {1, 2, 3, 4, 5};

    printf("Элементы массива: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);  // Вывод: 1 2 3 4 5
    }
    printf("\n");

    return 0;
}
```

#### Динамические массивы

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int*)malloc(5 * sizeof(int));  // Выделяем память

    if (arr == NULL) {
        printf("Ошибка выделения памяти!\n");
        return 1;
    }

    for (int i = 0; i < 5; i++) {
        arr[i] = i + 1;
    }

    printf("Элементы динамического массива: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);  // Вывод: 1 2 3 4 5
    }
    printf("\n");

    free(arr);  // Освобождаем память
    return 0;
}
```

## 6. Структуры

### 6.1. Объявление и использование структур

```c
#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main() {
    struct Point p1 = {10, 20};

    printf("Координаты точки: (%d, %d)\n", p1.x, p1.y);  // Вывод: (10, 20)
    return 0;
}
```

## 7. Ввод-вывод

### 7.1. Работа с файлами

```c
#include <stdio.h>

int main() {
    FILE *file = fopen("test.txt", "w");  // Открываем файл для записи

    if (file == NULL) {
        printf("Ошибка открытия файла!\n");
        return 1;
    }

    fprintf(file, "Hello, File!\n");  // Записываем строку в файл
    fclose(file);  // Закрываем файл

    file = fopen("test.txt", "r");  // Открываем файл для чтения

    if (file == NULL) {
        printf("Ошибка открытия файла!\n");
        return 1;
    }

    char buffer[100];
    fgets(buffer, 100, file);  // Читаем строку из файла

    printf("Содержимое файла: %s", buffer);  // Вывод: Hello, File!
    fclose(file);  // Закрываем файл

    return 0;
}
```

## 8. Препроцессор

### 8.1. Макросы

```c
#include <stdio.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main() {
    printf("Максимум из 10 и 20: %d\n", MAX(10, 20));  // Вывод: 20
    return 0;
}
```

## 9. Битовые операции

### 9.1. Побитовые операции

```c
#include <stdio.h>

int main() {
    int a = 5;  // 0101
    int b = 3;  // 0011

    printf("a & b = %d\n", a & b);  // Побитовое И: 0001 (1)
    printf("a | b = %d\n", a | b);  // Побитовое ИЛИ: 0111 (7)
    printf("a ^ b = %d\n", a ^ b);  // Побитовое XOR: 0110 (6)
    printf("~a = %d\n", ~a);     // Побитовое НЕ: 1111...1010 (-6)

    return 0;
}
```

## 10. Дополнительные темы

### 10.1. Указатели на функции

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int (*func_ptr)(int, int) = add;  // Указатель на функцию
    printf("5 + 3 = %d\n", func_ptr(5, 3));  // Вывод: 8
    return 0;
}
```

## 11. Работа с памятью

### 11.1. Динамическое выделение памяти

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int*)malloc(5 * sizeof(int));  // Выделяем память

    if (arr == NULL) {
        printf("Ошибка выделения памяти!\n");
        return 1;
    }

    for (int i = 0; i < 5; i++) {
        arr[i] = i + 1;
    }

    printf("Элементы динамического массива: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);  // Вывод: 1 2 3 4 5
    }
    printf("\n");

    free(arr);  // Освобождаем память
    return 0;
}
```

## 12. Многомерные массивы

### 12.1. Двумерные массивы

```c
#include <stdio.h>

int main() {
    int matrix[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    printf("Двумерный массив:\n");
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", matrix[i][j]);
        }
        printf("\n");
    }

    return 0;
}
```

## 13. Объединения

### 13.1. Использование объединений

```c
#include <stdio.h>

union Data {
    int i;
    float f;
    char str[20];
};

int main() {
    union Data data;
    data.i = 10;
    printf("data.i = %d\n", data.i);  // Вывод: 10
    data.f = 3.14;
    printf("data.f = %f\n", data.f);  // Вывод: 3.140000
    return 0;
}
```

## 14. Вложенные структуры

### 14.1. Пример вложенных структур

```c
#include <stdio.h>
#include <string.h>

struct Address {
    char city[50];
    char street[50];
};

struct Person {
    char name[50];
    int age;
    struct Address address;
};

int main() {
    struct Person p1;
    strcpy(p1.name, "Иван");
    p1.age = 25;
    strcpy(p1.address.city, "Москва");
    strcpy(p1.address.street, "Ленина");

    printf("Имя: %s, Возраст: %d, Город: %s, Улица: %s\n", p1.name, p1.age, p1.address.city, p1.address.street);
    return 0;
}
```

## 15. Указатели на структуры

### 15.1. Пример использования

```c
#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main() {
    struct Point p1 = {10, 20};
    struct Point *ptr = &p1;

    printf("Координаты точки: (%d, %d)\n", ptr->x, ptr->y);  // Вывод: (10, 20)
    return 0;
}
```

## 16. Ввод данных с клавиатуры

### 16.1. Ввод целых чисел (`int`)

```c
#include <stdio.h>

int main() {
    int number;
    printf("Введите целое число: ");
    scanf("%d", &number);  // Ввод целого числа
    printf("Вы ввели: %d\n", number);
    return 0;
}
```

### 16.2. Ввод чисел с плавающей точкой (`float` и `double`)

```c
#include <stdio.h>

int main() {
    float number_float;
    double number_double;

    printf("Введите число с плавающей точкой (float): ");
    scanf("%f", &number_float);
    printf("Вы ввели (float): %f\n", number_float);

    printf("Введите число с плавающей точкой (double): ");
    scanf("%lf", &number_double);
    printf("Вы ввели (double): %lf\n", number_double);

    return 0;
}
```

### 16.3. Ввод символов (`char`)

```c
#include <stdio.h>

int main() {
    char symbol;
    printf("Введите символ: ");
    scanf(" %c", &symbol);  // Ввод символа
    printf("Вы ввели: %c\n", symbol);
    return 0;
}
```

### 16.4. Ввод строк (`char[]`)

```c
#include <stdio.h>

int main() {
    char name[50];
    printf("Введите ваше имя: ");
    fgets(name, 50, stdin);  // Ввод строки (включая пробелы)
    printf("Привет, %s", name);
    return 0;
}
```

## 17. Типы с фиксированным размером (`<stdint.h>`)

### 17.1. Целочисленные типы

```c
#include <stdio.h>
#include <stdint.h>

int main() {
    uint8_t a = 255;  // 8-битное беззнаковое число
    int16_t b = -32768;  // 16-битное знаковое число

    printf("uint8_t a = %u\n", a);
    printf("int16_t b = %d\n", b);

    return 0;
}
```

### 17.2. Типы для хранения указателей

```c
#include <stdio.h>
#include <stdint.h>

int main() {
    int x = 10;
    uintptr_t ptr = (uintptr_t)&x;  // Сохраняем адрес x в uintptr_t

    printf("Адрес x: %p\n", (void*)ptr);
    return 0;
}
```

### 17.3. Типы для работы с размерами объектов

```c
#include <stdio.h>
#include <stddef.h>

int main() {
    size_t size = sizeof(int);  // Размер типа int
    printf("Размер int: %zu байт\n", size);
    return 0;
}
```

## Заключение

Этот краткий справочник охватывает основные аспекты языка программирования C. Для более глубокого изучения рекомендуется обратиться к специализированной литературе и практике.