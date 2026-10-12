// Тема ставится сразу в <head>, до отрисовки — без вспышки светлой темы.
// Без сохранённого выбора берём системную тему.
(function () {
    let saved = null;
    try {
        saved = localStorage.getItem('theme');
    } catch (e) {}
    const theme = saved === 'light' || saved === 'dark'
        ? saved
        : (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
})();

// Функция для переключения темы
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
        localStorage.setItem('theme', newTheme);
    } catch (e) {}
    // Генерируем событие смены темы
    document.dispatchEvent(new Event('theme-changed'));
}
