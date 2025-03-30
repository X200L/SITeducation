# Разработка GUI на C с использованием GTK: Краткое руководство

GTK (GIMP Toolkit) — это кроссплатформенная библиотека для создания графических пользовательских интерфейсов (GUI). Она написана на языке C и предоставляет широкий набор виджетов и инструментов для разработки приложений с современным и привлекательным интерфейсом.

## 1. Основы GTK

### 1.1. Что такое GTK?

GTK — это мощный и гибкий инструмент для создания GUI-приложений на языке C. Она предоставляет набор виджетов (кнопки, текстовые поля, окна и т.д.), которые можно использовать для построения интерфейса вашего приложения. GTK является кроссплатформенной библиотекой, что означает, что вы можете разрабатывать приложения, которые будут работать на различных операционных системах, таких как Linux, Windows и macOS.

### 1.2. Установка GTK

Прежде чем начать разработку с использованием GTK, необходимо установить библиотеку на вашу систему. Инструкции по установке могут различаться в зависимости от вашей операционной системы.

**Linux (Debian/Ubuntu):**

```bash
sudo apt-get update
sudo apt-get install libgtk-3-dev
```

**Windows:**

*   Установите MSYS2 с сайта [https://www.msys2.org/](https://www.msys2.org/).
*   Откройте MSYS2 MinGW 64-bit shell и выполните:

```bash
pacman -S mingw-w64-x86_64-gtk3
```

**macOS:**

*   Установите Homebrew с сайта [https://brew.sh/](https://brew.sh/).
*   Откройте Terminal и выполните:

```bash
brew install gtk+3
```

### 1.3. Компиляция GTK-приложений

После установки GTK вы можете скомпилировать ваш код следующим образом:

```bash
gcc -o myapp myapp.c `pkg-config --cflags --libs gtk+-3.0`
```

## 2. Основные функции и методы GTK

### 2.1. Инициализация и завершение работы GTK

*   **`gtk_init(int *argc, char ***argv)`**: Инициализирует GTK и парсит аргументы командной строки. Должна быть вызвана перед использованием любых других функций GTK.
*   **`gtk_main()`**: Запускает главный цикл обработки событий GTK. Этот цикл будет работать до тех пор, пока не будет вызвана функция `gtk_main_quit()`.
*   **`gtk_main_quit()`**: Завершает главный цикл обработки событий GTK, что приводит к завершению работы приложения.

### 2.2. Создание и управление окнами

*   **`GtkWidget *gtk_window_new(GtkWindowType type)`**: Создает новое окно. `GtkWindowType` может быть `GTK_WINDOW_TOPLEVEL` (обычное окно) или `GTK_WINDOW_POPUP` (всплывающее окно).
*   **`void gtk_window_set_title(GtkWindow *window, const gchar *title)`**: Устанавливает заголовок окна.
*   **`void gtk_window_set_default_size(GtkWindow *window, gint width, gint height)`**: Устанавливает размеры окна по умолчанию.
*   **`void gtk_window_set_position(GtkWindow *window, GtkWindowPosition position)`**: Устанавливает позицию окна на экране. Например, `GTK_WIN_POS_CENTER` для центрирования окна.
*   **`void gtk_widget_show(GtkWidget *widget)`**: Отображает виджет (окно, кнопку и т.д.).
*   **`void gtk_widget_show_all(GtkWidget *widget)`**: Отображает виджет и все его дочерние элементы.
*   **`void gtk_widget_hide(GtkWidget *widget)`**: Скрывает виджет.

### 2.3. Создание и управление кнопками

*   **`GtkWidget *gtk_button_new_with_label(const gchar *label)`**: Создает кнопку с текстовой меткой.
*   **`void gtk_button_set_label(GtkButton *button, const gchar *label)`**: Устанавливает текстовую метку на кнопке.
*   **`const gchar *gtk_button_get_label(GtkButton *button)`**: Возвращает текстовую метку кнопки.

### 2.4. Создание и управление текстовыми полями

*   **`GtkWidget *gtk_entry_new()`**: Создает текстовое поле для ввода.
*   **`void gtk_entry_set_text(GtkEntry *entry, const gchar *text)`**: Устанавливает текст в текстовом поле.
*   **`const gchar *gtk_entry_get_text(GtkEntry *entry)`**: Возвращает текст из текстового поля.

### 2.5. Создание и управление контейнерами

*   **`GtkWidget *gtk_box_new(GtkOrientation orientation, gint spacing)`**: Создает контейнер для размещения виджетов в виде строки или столбца. `GtkOrientation` может быть `GTK_ORIENTATION_HORIZONTAL` (горизонтальный) или `GTK_ORIENTATION_VERTICAL` (вертикальный). `spacing` задает расстояние между элементами.
*   **`void gtk_box_pack_start(GtkBox *box, GtkWidget *child, gboolean expand, gboolean fill, guint padding)`**: Добавляет виджет в контейнер. `expand` указывает, должен ли виджет занимать все доступное пространство, `fill` указывает, должен ли виджет заполнять это пространство, `padding` задает отступ вокруг виджета.
*   **`GtkWidget *gtk_grid_new()`**: Создает контейнер в виде сетки для размещения виджетов.
*   **`void gtk_grid_attach(GtkGrid *grid, GtkWidget *child, gint left, gint top, gint width, gint height)`**: Добавляет виджет в сетку. `left` и `top` задают позицию виджета в сетке, `width` и `height` задают размеры виджета.

### 2.6. Обработка событий

*   **`gulong g_signal_connect(gpointer instance, const gchar *detailed_signal, GCallback c_handler, gpointer data)`**: Подключает обработчик события к виджету. `instance` — это виджет, `detailed_signal` — имя события (например, "clicked" для кнопки), `c_handler` — функция-обработчик, `data` — дополнительные данные, передаваемые в обработчик.
*   **`gboolean g_timeout_add(guint interval, GSourceFunc function, gpointer data)`**: Устанавливает таймер, который вызывает функцию через указанный интервал времени (в миллисекундах).

### 2.7. Диалоговые окна

*   **`GtkWidget *gtk_message_dialog_new(GtkWindow *parent, GtkDialogFlags flags, GtkMessageType type, GtkButtonsType buttons, const gchar *message_format, ...)`**: Создает диалоговое окно с сообщением. `flags` задает флаги диалога, `type` задает тип сообщения (например, `GTK_MESSAGE_INFO`), `buttons` задает кнопки в диалоге (например, `GTK_BUTTONS_OK`).
*   **`gint gtk_dialog_run(GtkDialog *dialog)`**: Отображает диалоговое окно и ожидает его закрытия. Возвращает код нажатой кнопки.

### 2.8. Управление памятью

*   **`void g_object_unref(gpointer object)`**: Уменьшает счетчик ссылок на объект. Когда счетчик ссылок достигает нуля, объект удаляется.
*   **`void g_object_ref(gpointer object)`**: Увеличивает счетчик ссылок на объект.

## 3. Пример создания простого приложения

Давайте создадим простое приложение с окном, кнопкой и текстовым полем. При нажатии на кнопку в текстовое поле будет добавляться текст.

```c
#include <gtk/gtk.h>

// Функция-обработчик нажатия на кнопку
void on_button_clicked(GtkWidget *widget, gpointer data) {
    GtkWidget *entry = GTK_WIDGET(data); // Получаем указатель на текстовое поле
    const gchar *text = gtk_entry_get_text(GTK_ENTRY(entry)); // Получаем текущий текст
    gchar *new_text = g_strconcat(text, " Кнопка нажата!", NULL); // Добавляем текст
    gtk_entry_set_text(GTK_ENTRY(entry), new_text); // Устанавливаем новый текст
    g_free(new_text); // Освобождаем выделенную память
}

int main(int argc, char *argv[]) {
    // Инициализация GTK
    gtk_init(&argc, &argv);

    // 1. Создание окна
    GtkWidget *window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
    gtk_window_set_title(GTK_WINDOW(window), "Пример GTK");
    gtk_window_set_default_size(GTK_WINDOW(window), 400, 300);
    gtk_window_set_position(GTK_WINDOW(window), GTK_WIN_POS_CENTER);

    // 2. Создание виджетов
    GtkWidget *button = gtk_button_new_with_label("Нажми меня");
    GtkWidget *entry = gtk_entry_new();

    // 3. Создание контейнера и добавление виджетов
    GtkWidget *box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 5);
    gtk_box_pack_start(GTK_BOX(box), entry, TRUE, TRUE, 0);
    gtk_box_pack_start(GTK_BOX(box), button, TRUE, TRUE, 0);

    // 4. Добавление контейнера в окно
    gtk_container_add(GTK_CONTAINER(window), box);

    // 5. Подключение обработчиков событий
    g_signal_connect(button, "clicked", G_CALLBACK(on_button_clicked), entry); // Передаем entry в качестве данных
    g_signal_connect(window, "destroy", G_CALLBACK(gtk_main_quit), NULL);

    // 6. Отображение окна и всех виджетов
    gtk_widget_show_all(window);

    // 7. Запуск главного цикла GTK
    gtk_main();

    return 0;
}
```

**Пояснения к коду:**

1.  **`on_button_clicked`**: Функция-обработчик события нажатия на кнопку. Она получает указатель на текстовое поле (`entry`) через аргумент `data`, добавляет текст " Кнопка нажата!" к текущему тексту в текстовом поле и устанавливает новый текст.
2.  **`gtk_init`**: Инициализирует GTK.
3.  **`gtk_window_new`**: Создает новое окно верхнего уровня.
4.  **`gtk_window_set_title`**: Устанавливает заголовок окна.
5.  **`gtk_window_set_default_size`**: Устанавливает размеры окна по умолчанию.
6.  **`gtk_window_set_position`**: Устанавливает позицию окна по центру экрана.
7.  **`gtk_button_new_with_label`**: Создает кнопку с текстовой меткой "Нажми меня".
8.  **`gtk_entry_new`**: Создает текстовое поле для ввода.
9.  **`gtk_box_new`**: Создает вертикальный контейнер для размещения виджетов.
10. **`gtk_box_pack_start`**: Добавляет виджеты (текстовое поле и кнопку) в контейнер.
11. **`gtk_container_add`**: Добавляет контейнер в окно.
12. **`g_signal_connect`**: Подключает обработчики событий к кнопке (нажатие) и окну (закрытие).
13. **`gtk_widget_show_all`**: Отображает окно и все его дочерние виджеты.
14. **`gtk_main`**: Запускает главный цикл обработки событий GTK.

## 4. Заключение

GTK — это мощный инструмент для создания GUI-приложений на языке C. В этом кратком руководстве мы рассмотрели основные концепции и функции GTK, а также создали простое приложение с окном, кнопкой и текстовым полем. Для более глубокого изучения рекомендуется обратиться к официальной документации GTK и другим ресурсам.