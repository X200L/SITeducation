// Страница курса в стиле Сириус Wiki: шапка раздела, список уроков слева, урок справа.
// Уроки уже лежат в разметке как <div class="lesson" id="lesson-N">; скрипт перестраивает
// вокруг них интерфейс и подменяет старую навигацию.
(function () {
    const body = document.body;
    const lessons = [...document.querySelectorAll('.lesson[id^="lesson-"]')]
        .sort((a, b) => lessonNumber(a) - lessonNumber(b));
    if (!lessons.length) {
        body.classList.remove('course-pending');
        return;
    }

    function lessonNumber(el) {
        return parseInt(el.id.split('-')[1], 10);
    }

    // Название урока — первый заголовок h2 внутри урока
    const titles = lessons.map((lesson) => {
        const h2 = lesson.querySelector('h2');
        return h2 ? h2.textContent.replace(/:\s*$/, '').trim() : `Урок ${lessonNumber(lesson)}`;
    });

    const total = lessons.length;
    const page = document.createElement('main');
    page.id = 'main';
    page.className = 'page course-page';
    page.innerHTML = `
        <a class="back-link" href="courses.html">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg> Все курсы
        </a>
        <div class="page-top">
            <h1>${sitEscape(body.dataset.courseTitle || document.title)}</h1>
        </div>
        <div class="content-layout">
            <aside class="sidebar lesson-nav" aria-label="Уроки курса">
                <p class="sidebar-title">Уроки: ${total}</p>
                ${lessons.map((lesson, i) => `
                    <button type="button" class="sidebar-item lesson-link" data-lesson="${lessonNumber(lesson)}">
                        <span class="lesson-link-num">${i + 1}</span>
                        <span class="lesson-link-title">${sitEscape(titles[i])}</span>
                    </button>`).join('')}
            </aside>
            <div class="lesson-area">
                <div class="lesson-progress" aria-hidden="true"><span></span></div>
                <header class="lesson-head">
                    <div class="article-kicker" data-lesson-kicker></div>
                    <h2 data-lesson-title></h2>
                </header>
                <div class="lesson-stage"></div>
                <nav class="lesson-pager" aria-label="Соседние уроки"></nav>
            </div>
        </div>`;

    // Переносим уроки в новую разметку и убираем старый интерфейс
    const stage = page.querySelector('.lesson-stage');
    lessons.forEach((lesson, i) => {
        lesson.removeAttribute('style');
        lesson.hidden = true;
        const firstH2 = lesson.querySelector('h2');
        if (firstH2) firstH2.remove();
        lesson.classList.add('markdown-body');
        stage.appendChild(lesson);
    });
    // В старой разметке <main> бывает не закрыт, и футер оказывается внутри него —
    // сначала выносим страницу и футер в конец body, потом удаляем старое
    const footer = document.querySelector('.site-footer');
    body.append(page, footer);
    document.querySelectorAll('main:not(.course-page), body > .container, .next-lesson-btn').forEach((el) => el.remove());

    const links = [...page.querySelectorAll('.lesson-link')];
    const kicker = page.querySelector('[data-lesson-kicker]');
    const title = page.querySelector('[data-lesson-title]');
    const pager = page.querySelector('.lesson-pager');
    const bar = page.querySelector('.lesson-progress span');
    const arrowLeft = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
    const arrowRight = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

    function open(index, { scroll = true, push = true } = {}) {
        index = Math.max(0, Math.min(total - 1, index));
        lessons.forEach((lesson, i) => {
            // Старый window.onload страницы проставляет display:none — сбрасываем
            lesson.style.removeProperty('display');
            lesson.hidden = i !== index;
            lesson.classList.toggle('active', i === index);
        });
        links.forEach((link, i) => {
            link.classList.toggle('active', i === index);
            if (i === index) link.setAttribute('aria-current', 'step');
            else link.removeAttribute('aria-current');
        });
        kicker.textContent = `Урок ${index + 1} из ${total}`;
        title.textContent = titles[index];
        bar.style.width = `${((index + 1) / total) * 100}%`;

        const prev = index > 0 ? `
            <a class="pager-link prev" href="#lesson-${lessonNumber(lessons[index - 1])}" data-go="${index - 1}">
                <span class="round-arrow">${arrowLeft}</span>
                <span><small>Предыдущий урок</small>${sitEscape(titles[index - 1])}</span>
            </a>` : '<span></span>';
        const next = index < total - 1 ? `
            <a class="pager-link next" href="#lesson-${lessonNumber(lessons[index + 1])}" data-go="${index + 1}">
                <span><small>Следующий урок</small>${sitEscape(titles[index + 1])}</span>
                <span class="round-arrow">${arrowRight}</span>
            </a>` : `
            <a class="pager-link next" href="courses.html">
                <span><small>Курс пройден</small>Выбрать следующий курс</span>
                <span class="round-arrow">${arrowRight}</span>
            </a>`;
        pager.innerHTML = prev + next;

        const hash = `#${lessons[index].id}`;
        if (push && location.hash !== hash) history.pushState(null, '', hash);
        if (scroll) page.querySelector('.content-layout').scrollIntoView({ block: 'start' });
        links[index].scrollIntoView({ block: 'nearest' });
    }

    page.querySelector('.lesson-nav').addEventListener('click', (e) => {
        const link = e.target.closest('.lesson-link');
        if (link) open(links.indexOf(link));
    });
    pager.addEventListener('click', (e) => {
        const link = e.target.closest('[data-go]');
        if (!link) return;
        e.preventDefault();
        open(parseInt(link.dataset.go, 10));
    });

    function fromHash() {
        const index = lessons.findIndex((l) => `#${l.id}` === location.hash);
        return index >= 0 ? index : 0;
    }
    window.addEventListener('popstate', () => open(fromHash(), { push: false }));

    // Старые функции страницы ведут в новую навигацию
    window.showLesson = (event, n) => open(lessons.findIndex((l) => lessonNumber(l) === Number(n)));
    window.nextLesson = () => open(lessons.findIndex((l) => !l.hidden) + 1);

    // Тест: подсветка классами вместо цветного текста
    window.checkQuiz = (button) => {
        const section = button.closest('.section');
        let right = 0;
        const questions = section.querySelectorAll('.quiz-question');
        questions.forEach((question) => {
            question.querySelectorAll('label').forEach((l) => l.classList.remove('is-correct', 'is-wrong'));
            const inputs = [...question.querySelectorAll('input[type="radio"]')];
            const chosen = inputs.find((i) => i.checked);
            const correct = inputs.find((i) => i.hasAttribute('correct'));
            if (correct) correct.parentElement.classList.add('is-correct');
            if (chosen && chosen !== correct) chosen.parentElement.classList.add('is-wrong');
            if (chosen && chosen === correct) right += 1;
        });
        let result = section.querySelector('.quiz-result');
        if (!result) {
            result = document.createElement('p');
            result.className = 'quiz-result';
            result.setAttribute('aria-live', 'polite');
            button.after(result);
        }
        result.textContent = `Правильных ответов: ${right} из ${questions.length}`;
    };

    open(fromHash(), { scroll: false, push: false });
    body.classList.remove('course-pending');

    // Старый обработчик load показывал первый урок — возвращаем выбранный
    window.addEventListener('load', () => open(fromHash(), { scroll: false, push: false }));
})();
