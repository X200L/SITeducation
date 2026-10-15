// Олимпиады и конкурсы: два направления, фильтр по типу и поиск. Данные — olympiads.json.
(function () {
    const GROUPS = [
        { type: 'rsosh', title: 'Перечневые олимпиады' },
        { type: 'olymp', title: 'Олимпиады' },
        { type: 'contest', title: 'Конкурсы и соревнования' },
    ];
    const TYPE_LABEL = { rsosh: 'РСОШ', olymp: 'Олимпиада', contest: 'Конкурс' };

    const state = { direction: 'robotics', type: 'all', query: '' };
    let data;

    const switcher = document.querySelector('[data-directions]');
    const filters = document.querySelector('[data-type-filter]');
    const list = document.querySelector('[data-olympiads]');
    const search = document.getElementById('olympiadSearch');
    const updated = document.querySelector('[data-updated]');

    function href(site) {
        return `https://${site}`;
    }

    function siteLabel(site) {
        const [host, ...path] = site.split('/');
        return path.length
            ? `${sitEscape(host)}<span class="olymp-path">/${sitEscape(path.join('/'))}</span>`
            : sitEscape(host);
    }

    function render() {
        const direction = data.directions.find((d) => d.id === state.direction) || data.directions[0];
        const q = state.query.trim().toLowerCase();
        // Номер — позиция в полном списке направления, как в исходной таблице
        const items = direction.items
            .map((item, i) => ({ ...item, n: i + 1 }))
            .filter((item) => state.type === 'all' || item.type === state.type)
            .filter((item) => !q || `${item.name} ${item.sub || ''} ${item.site} ${item.note || ''}`.toLowerCase().includes(q));

        switcher.querySelectorAll('[data-direction]').forEach((b) => {
            const on = b.dataset.direction === direction.id;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', String(on));
        });
        filters.querySelectorAll('[data-type]').forEach((b) => {
            const on = b.dataset.type === state.type;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', String(on));
            const n = b.dataset.type === 'all'
                ? direction.items.length
                : direction.items.filter((i) => i.type === b.dataset.type).length;
            b.querySelector('small').textContent = n;
        });

        if (!items.length) {
            list.innerHTML = '<div class="no-results"><h2>Ничего не нашлось</h2><p>Измените запрос или выберите другой тип.</p></div>';
            return;
        }

        list.innerHTML = GROUPS.map((group) => {
            const rows = items.filter((i) => i.type === group.type);
            if (!rows.length) return '';
            return `
                <section class="olymp-group" aria-label="${group.title}">
                    <h2 class="olymp-group-title">${group.title} <small>${rows.length}</small></h2>
                    ${rows.map((item) => `
                        <a class="olymp-row" href="${href(item.site)}" target="_blank" rel="noreferrer">
                            <span class="olymp-n">${String(item.n).padStart(2, '0')}</span>
                            <span class="olymp-name"><strong>${sitEscape(item.name)}</strong>${item.sub ? ` <span>${sitEscape(item.sub)}</span>` : ''}${item.note ? `<small class="olymp-note">${sitEscape(item.note)}</small>` : ''}</span>
                            <span class="olymp-type is-${item.type}"${item.level ? ` title="Уровень ${item.level} по перечню РСОШ"` : ''}>${TYPE_LABEL[item.type]}${item.level ? ` ${item.level}` : ''}</span>
                            <span class="olymp-site">${siteLabel(item.site)} <span class="ext">↗</span></span>
                        </a>`).join('')}
                </section>`;
        }).join('');
    }

    function setDirection(id, push) {
        state.direction = id;
        if (push) history.replaceState(null, '', `#${id}`);
        render();
    }

    switcher.addEventListener('click', (e) => {
        const b = e.target.closest('[data-direction]');
        if (b) setDirection(b.dataset.direction, true);
    });
    filters.addEventListener('click', (e) => {
        const b = e.target.closest('[data-type]');
        if (!b) return;
        state.type = b.dataset.type;
        render();
    });
    // Переход по ссылке #robotics / #ai / #programming на этой же странице
    window.addEventListener('hashchange', () => {
        const id = location.hash.slice(1);
        if (data && data.directions.some((d) => d.id === id)) setDirection(id, false);
    });
        search.addEventListener('input', () => {
        state.query = search.value;
        render();
    });

    fetch('olympiads.json')
        .then((r) => r.json())
        .then((json) => {
            data = json;
            const hash = location.hash.slice(1);
            if (data.directions.some((d) => d.id === hash)) state.direction = hash;
            const q = new URLSearchParams(location.search).get('q');
            if (q) {
                state.query = q;
                search.value = q;
                // Ищем в том направлении, где есть совпадение
                const hit = data.directions.find((d) => d.items.some((i) => `${i.name} ${i.sub || ''}`.toLowerCase().includes(q.toLowerCase())));
                if (hit && !hash) state.direction = hit.id;
            }
            updated.textContent = `Сезон ${data.season}, список обновлён ${sitFormatDate(data.updated)}`;
            const source = document.querySelector('[data-source]');
            if (source && data.source) source.textContent = `Перечневые олимпиады и их уровни сверены с документом: ${data.source}.`;
            render();
        })
        .catch(() => {
            list.innerHTML = '<div class="error-message"><h2>Список не загрузился</h2><p>Проверьте соединение и обновите страницу.</p><button type="button" onclick="location.reload()">Обновить страницу</button></div>';
        });
})();
