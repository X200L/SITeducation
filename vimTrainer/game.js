        // DOM Elements
        const editorDisplay = document.getElementById('vim-editor-display');
        const editorInput = document.getElementById('vim-editor-input');
        const statusBar = document.getElementById('status-bar');
        const instructionsEl = document.getElementById('instructions');
        const levelIndicator = document.getElementById('level-indicator');
        const commandLogEl = document.getElementById('command-log');
        const editorContainer = document.getElementById('editor-container');
        const resetBtn = document.getElementById('reset-btn');
        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modal-content');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const nextLevelBtn = document.getElementById('next-level-btn');
        const celebration = document.getElementById('celebration');
        const celebrationRestartBtn = document.getElementById('celebration-restart');
        const levelSelectionContainer = document.getElementById('level-selection');
        const challengeToggleBtn = document.getElementById('challenge-toggle');
        const challengeContainer = document.getElementById('challenge-container');
        const challengeInstructions = document.getElementById('challenge-instructions');
        const challengeTimer = document.getElementById('timer');
        const challengeProgress = document.getElementById('challenge-progress');
        const challengeTotal = document.getElementById('challenge-total');
        const challengeScore = document.getElementById('challenge-score');
        const badgeSection = document.getElementById('badge-section');
        const badgeBar = document.getElementById('badge-bar');
        const badgeCount = document.getElementById('badge-count');
        const badgeToast = document.getElementById('badge-toast');
        const cheatPanel = document.getElementById('cheat-panel');
        const cheatOverlay = document.getElementById('cheat-overlay');
        const cheatCloseBtn = document.getElementById('cheat-close');
        const cheatSearch = document.getElementById('cheat-search');
        const cheatContent = document.getElementById('cheat-content');

        // Game State
        let content = [];
        let cursor = { row: 0, col: 0 };
        let mode = 'NORMAL';
        let currentLevel = 0;
        let commandHistory = '';
        let commandLog = [];
        let yankedLine = null;
        let replacePending = false;
        let countBuffer = '';
        let undoStack = [];
        let redoStack = [];
        let level12Undo = false;
        let level12RedoAfterUndo = false;
        let lastExCommand = null;
        let searchMode = false;
        let searchQuery = '';
        let lastSearchQuery = null;
        let lastSearchDirection = 'forward'; // 'forward' | 'backward'
        let searchMatches = []; // { row, start, end }
        let currentMatchIndex = -1;
        let usedSearchInLevel = false;
        let navCountSinceSearch = 0;
        let badges = new Set();
        let practicedCommands = new Set();

        // Challenge Mode State
        let challengeMode = false;
        let currentChallenge = null;
        let challengeTimerInterval = null;
        let challengeStartTime = null;
        let challengeScoreValue = 0;
        let challengeProgressValue = 0;
        let currentTaskIndex = 0;

        // Challenge Definitions
        const challenges = [
            {
                name: "Скоростная навигация",
                description: "Доберитесь до цели максимально быстро!",
                timeLimit: 30,
                tasks: [
                    {
                        instruction: "Переместитесь к слову 'target' используя 3w",
                        validation: () => cursor.row === 0 && cursor.col === 14,
                        hint: "Используйте 3w для прыжка на 3 слова вперёд"
                    },
                    {
                        instruction: "Перейдите в конец строки с помощью $",
                        validation: () => cursor.col === 23,
                        hint: "Используйте $ для перехода в конец строки"
                    },
                    {
                        instruction: "Перейдите на первую строку с помощью gg",
                        validation: () => cursor.row === 0 && cursor.col === 0,
                        hint: "Используйте gg для перехода на первую строку"
                    }
                ],
                initialContent: [
                    "one two three target here at end",
                    "second line for practice"
                ]
            },
            {
                name: "Быстрое удаление",
                description: "Удаляйте и изменяйте текст быстро!",
                timeLimit: 45,
                tasks: [
                    {
                        instruction: "Поставьте курсор на 'r' в 'remove' и удалите слово с dw",
                        validation: () => content[0].includes("delete this line") && !content[0].includes("remove"),
                        hint: "Используйте h/l для перехода к 'r' в 'remove', затем dw"
                    },
                    {
                        instruction: "Перейдите на вторую строку и удалите её полностью с dd",
                        validation: () => content.length === 2,
                        hint: "Используйте j для перехода вниз, затем dd для удаления строки"
                    },
                    {
                        instruction: "Перейдите на третью строку, поставьте курсор на 'B' в 'BAD' и измените на 'GOOD' с cw",
                        validation: () => content[1].includes("GOOD") && !content[1].includes("BAD"),
                        hint: "Используйте j для перехода вниз, поставьте курсор на 'B', используйте cw затем введите 'GOOD'"
                    }
                ],
                initialContent: [
                    "delete this remove line",
                    "delete this line too",
                    "This is BAD text"
                ]
            },
            {
                name: "Продвинутые команды",
                description: "Освойте сложные комбинации команд!",
                timeLimit: 60,
                tasks: [
                    {
                        instruction: "Скопируйте первую строку 'first line to copy' с yy",
                        validation: () => yankedLine === "first line to copy",
                        hint: "Используйте yy для копирования текущей строки"
                    },
                    {
                        instruction: "Перейдите на третью строку (пустую) и вставьте с p",
                        validation: () => content.length === 4 && content[3] === "first line to copy",
                        hint: "Используйте j для перехода на 2 строки вниз, затем p для вставки"
                    },
                    {
                        instruction: "Перейдите на вторую строку, поставьте курсор на 'x' и замените на '!' используя r",
                        validation: () => content[1].includes("!") && !content[1].includes("x"),
                        hint: "Используйте k для перехода вверх, поставьте курсор на 'x', используйте r затем !"
                    }
                ],
                initialContent: [
                    "first line to copy",
                    "replace this x",
                    ""
                ]
            }
        ];

        const cloneState = () => ({
            content: [...content],
            cursor: { row: cursor.row, col: cursor.col },
            mode,
            yankedLine
        });
        const pushUndo = () => {
            undoStack.push(cloneState());
            if (undoStack.length > 200) undoStack.shift();
            redoStack = [];
        };

        // Utils
        const escapeHtml = (s) => s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        // Treat Ctrl-[ as Escape (common Vim alias). Avoid Shift/Alt/Meta to not clash with other combos
        const isEscapeKey = (e) => e.key === 'Escape' || (e.key === '[' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey);

        const levels = [
            // Level 1: Exiting Vim (fun intro)
            {
                name: "Как выйти (Ex команды)",
                instructions: "Введите :q для выхода, или :wq для сохранения и выхода. Нажмите Enter после команды.",
                initialContent: [
                    "Добро пожаловать в VIM Master!",
                    "Самый частый вопрос: как выйти из Vim?",
                    "Попробуйте ввести :q и нажать Enter (или :wq)."
                ],
                exCommands: ["q", "wq"],
                setup: () => { cursor = { row: 0, col: 0 }; commandHistory = ''; }
            },
            // Level 1: Basic Movement
            {
                name: "Базовое перемещение",
                instructions: "Используйте h, j, k, l для перемещения курсора. Достигните целевого символа '$'.",
                initialContent: [
                    "Перемещайтесь с h(влево), j(вниз), k(вверх), l(вправо).",
                    "Ваш курсор начинается здесь.",
                    "",
                    "Цель - добраться до знака доллара.",
                    "Практикуйте перемещение по тексту.",
                    "Когда освоитесь, переместитесь на '$'."
                ],
                target: { row: 5, col: 39 },
                setup: () => { cursor = { row: 1, col: 5 }; }
            },
            // Level 2: Word Movement
            {
                name: "Перемещение по словам",
                instructions: "Используйте w (следующее слово), b (назад), e (конец слова). Доберитесь до конца слова 'destination'.",
                initialContent: [
                    "Перемещение между словами намного быстрее.",
                    "Используйте 'w' для прыжка вперёд к началу следующего слова.",
                    "Используйте 'b' для прыжка назад к началу предыдущего слова.",
                    "Используйте 'e' для прыжка в конец текущего слова.",
                    "Найдите конечную цель."
                ],
                target: { row: 4, col: 28 },
                setup: () => { cursor = { row: 0, col: 0 }; }
            },
            // Level 3: Line Jumps
            {
                name: "Переход по строкам",
                instructions: "Используйте gg для перехода на первую строку, и G для перехода на последнюю. Перейдите на последний символ последней строки.",
                initialContent: [
                    "Это первая строка. Используйте 'gg' чтобы вернуться сюда.",
                    "...",
                    "...",
                    "...",
                    "Это последняя строка. Используйте 'G' для перехода сюда.",
                    "Цель находится на слове 'here'."
                ],
                target: { row: 5, col: 32 },
                setup: () => { cursor = { row: 2, col: 0 }; commandHistory = ''; }
            },
            // Level 4: Insert Mode
            {
                name: "Режим вставки",
                instructions: "Нажмите 'a' для добавления после курсора. Введите ' is awesome!' и нажмите Esc для возврата в NORMAL режим.",
                initialContent: [
                    "В VIM есть несколько режимов. Вы находитесь в NORMAL режиме.",
                    "Нажмите 'a' для добавления после курсора и начала ввода.",
                    "Когда закончите, нажмите 'Escape' для возврата.",
                    "Ваша задача: завершите предложение ниже.",
                    "Learning VIM"
                ],
                targetText: { line: 4, text: "Learning VIM is awesome!" },
                setup: () => { cursor = { row: 4, col: 11 }; }
            },
             // Level 5: Delete Basics
            {
                name: "Основы удаления",
                instructions: "Используйте dd для удаления всей средней строки. Затем используйте dw для удаления слова 'mistake' в последней строке. Можете использовать x для удаления одного символа при необходимости.",
                initialContent: [
                    "Оставьте эту строку.",
                    "Удалите эту строку полностью.",
                    "Исправьте эту ошибку здесь."
                ],
                targetContent: [
                    "Оставьте эту строку.",
                    "Исправьте эту здесь."
                ],
                setup: () => { cursor = { row: 0, col: 0 }; commandHistory = ''; }
            },
            // Level 6: Yank & Put
            {
                name: "Копировать и вставить (Yank & Put)",
                instructions: "Используйте yy для копирования строки и p для вставки. Продублируйте вторую строку.",
                initialContent: [
                    "Давайте скопируем и вставим.",
                    "Скопируйте эту строку!",
                    "И вставьте её ниже.",
                    ""
                ],
                targetContent: [
                    "Давайте скопируем и вставим.",
                    "Скопируйте эту строку!",
                    "И вставьте её ниже.",
                    "Скопируйте эту строку!",
                ],
                setup: () => { cursor = { row: 1, col: 0 }; commandHistory = ''; }
            },
            // Level 7: Line Start/End
            {
                name: "Начало и конец строки (0 и $)",
                instructions: "Используйте 0 для перехода в начало строки и $ для перехода в конец. Перейдите на последний символ первой строки.",
                initialContent: [
                    "Перейдите в начало и конец этой строки.",
                    "Практика делает мастера."
                ],
                target: { row: 0, col: 38 },
                setup: () => { cursor = { row: 0, col: 0 }; }
            },
            // Level 8: Append and Open Lines
            {
                name: "Добавление и создание строк",
                instructions: "Используйте a для добавления после курсора. Используйте o для создания новой строки ниже, и O для создания выше. Добавьте новую строку между двумя строками с текстом 'Inserted here'.",
                initialContent: [
                    "Первая строка.",
                    "Вторая строка."
                ],
                targetContent: [
                    "Первая строка.",
                    "Inserted here",
                    "Вторая строка."
                ],
                setup: () => { cursor = { row: 0, col: 5 }; }
            },
            // Level 9: Change Word (cw)
            {
                name: "Изменение слова (cw)",
                instructions: "Используйте cw для изменения слова 'bad' на 'good'. Нажмите Esc когда закончите.",
                initialContent: [
                    "This is a bad example."
                ],
                targetText: { line: 0, text: "This is a good example." },
                setup: () => { cursor = { row: 0, col: 10 }; }
            },
            // Level 10: Delete to End (D) and Replace (r)
            {
                name: "Удаление до конца и замена",
                instructions: "Используйте D для удаления от курсора до конца строки, затем используйте r для замены 'x' на '!'.",
                initialContent: [
                    "Оставьте это → удалите отсюда до конца",
                    "Замените этот x"
                ],
                targetContent: [
                    "Оставьте это → ",
                    "Замените этот !"
                ],
                setup: () => { cursor = { row: 0, col: 12 }; }
            },
            // Level 11: Numeric Counts (3w)
            {
                name: "Счётчики: двигайтесь быстрее",
                instructions: "Используйте счётчик с командами перемещения. Нажмите 3 затем w для прыжка на три слова и попадания на 'target'.",
                initialContent: [
                    "one two three target here"
                ],
                target: { row: 0, col: 14 },
                setup: () => { cursor = { row: 0, col: 0 }; }
            },
            // Level 12: Undo and Redo
            {
                name: "Отмена / Повтор",
                instructions: "Удалите среднюю строку с dd, отмените с u, затем повторите с Ctrl+r для завершения с удалённой строкой.",
                initialContent: [
                    "Верхняя строка.",
                    "Удали меня.",
                    "Нижняя строка."
                ],
                targetContent: [
                    "Верхняя строка.",
                    "Нижняя строка."
                ],
                setup: () => { cursor = { row: 1, col: 0 }; }
            }
            ,
            // Level 13: Forward Search
            {
                name: "Поиск вперёд (/)",
                instructions: "Нажмите / затем введите 'target' и Enter, затем нажмите n один раз для перехода к следующему вхождению.",
                initialContent: [
                    "find the target here",
                    "another target and another target",
                    "no match on this line"
                ],
                target: { row: 1, col: 27 },
                setup: () => { cursor = { row: 2, col: 0 }; }
            }
            ,
            // Level 14: Backward Search
            {
                name: "Поиск назад (?)",
                instructions: "Нажмите ? затем введите 'alpha' и Enter, затем нажмите N один раз для перехода к предыдущему вхождению.",
                initialContent: [
                    "alpha beta gamma",
                    "delta epsilon alpha",
                    "zeta eta theta"
                ],
                target: { row: 0, col: 0 },
                setup: () => { cursor = { row: 2, col: 5 }; }
            }
            ,
            // Level 15: Search Navigation (n/N)
            {
                name: "Навигация по поиску (n/N)",
                instructions: "Найдите 'foo' с /foo затем нажмите n дважды для достижения третьего вхождения.",
                initialContent: [
                    "foo bar baz",
                    "qux foo quux",
                    "corge grault foo"
                ],
                target: { row: 2, col: 13 },
                setup: () => { cursor = { row: 0, col: 0 }; }
            }
        ];

        // --- RENDER FUNCTIONS ---
        function renderEditor() {
            let html = '';
            const isInMatch = (row, col) => {
                for (let i = 0; i < searchMatches.length; i++) {
                    const m = searchMatches[i];
                    if (m.row === row && col >= m.start && col < m.end) return true;
                }
                return false;
            };
            content.forEach((line, rowIndex) => {
                html += `<div class="flex"><span class="line-number w-10">${rowIndex + 1}</span><span class="flex-1">`;
                for (let colIndex = 0; colIndex < line.length; colIndex++) {
                    const char = line[colIndex];
                    const safeChar = escapeHtml(char);
                    if (rowIndex === cursor.row && colIndex === cursor.col && mode === 'NORMAL') {
                        html += `<span class="cursor">${safeChar}</span>`;
                    } else {
                        if (lastSearchQuery && isInMatch(rowIndex, colIndex)) {
                            html += `<span class="bg-yellow-800/60">${safeChar}</span>`;
                        } else {
                            html += safeChar;
                        }
                    }
                }
                if (rowIndex === cursor.row && (cursor.col === line.length || line.length === 0)) {
                     if (mode === 'NORMAL') {
                        html += `<span class="cursor">&nbsp;</span>`;
                     } else {
                        html += `<span class="inline-block w-px h-6 bg-yellow-400 animate-pulse -mb-1"></span>`;
                     }
                }
                html += `</span></div>`;
            });
            editorDisplay.innerHTML = html;
        }

        function updateStatusBar() {
            let text = `-- ${mode.toUpperCase()} --`;
            if (searchMode) {
                const prefix = lastSearchDirection === 'backward' ? '?' : '/';
                text += ` ${prefix}${searchQuery}`;
            } else if (lastSearchQuery) {
                const total = searchMatches.length;
                const current = currentMatchIndex >= 0 ? currentMatchIndex + 1 : 0;
                const dir = lastSearchDirection === 'backward' ? '?' : '/';
                text += ` ${dir}${lastSearchQuery} ${current}/${total}`;
            }
            statusBar.textContent = text;
            statusBar.className = `status-bar px-2 py-1 rounded-md text-sm ${mode === 'NORMAL' ? 'bg-yellow-400 text-gray-900' : 'bg-green-400 text-gray-900'}`;
        }

        // --- BADGES ---
        function renderBadges() {
            badgeBar.innerHTML = '';
            const badgeDefs = {
                beginner: { label: 'Новичок', emoji: '🟢', title: 'Завершил базовые уроки перемещения' },
                searchmaster: { label: 'Мастер поиска', emoji: '🔎', title: 'Использовал / ? n N для поиска' }
            };
            const earned = Array.from(badges);
            if (earned.length === 0) {
                badgeSection.classList.add('hidden');
                return;
            }
            badgeSection.classList.remove('hidden');
            badgeCount.textContent = `(${earned.length} получено)`;
            earned.forEach((key) => {
                const def = badgeDefs[key];
                if (!def) return;
                const el = document.createElement('div');
                el.className = 'badge-card bg-blue-900/70 border border-blue-700 text-blue-100 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-transform';
                el.title = def.title;
                el.innerHTML = `<span>${def.emoji}</span><span>${def.label}</span>`;
                badgeBar.appendChild(el);
            });
        }

        // --- CHEAT MODE ---
        const commandCatalog = [
            {
                category: 'Перемещение',
                items: [
                    { key: 'h / j / k / l', id: 'hjkL', desc: 'Перемещение влево/вниз/вверх/вправо', example: 'Перемещайте курсор по тексту.' },
                    { key: 'w / b / e', id: 'wbe', desc: 'Перемещение по словам: вперёд/назад/конец', example: 'Быстро перемещайтесь между словами.' },
                    { key: 'gg / G', id: 'ggG', desc: 'Переход на первую/последнюю строку', example: 'Переход к границам файла.' },
                    { key: '0 / $', id: '0$', desc: 'Начало / конец строки', example: 'Переход в начало или конец строки.' },
                ]
            },
            {
                category: 'Редактирование',
                items: [
                    { key: 'i / a', id: 'ia', desc: 'Вставка/добавление текста', example: 'Вход в режим вставки для ввода.' },
                    { key: 'x', id: 'x', desc: 'Удаление символа', example: 'Удаление одного символа.' },
                    { key: 'dd', id: 'dd', desc: 'Удаление строки', example: 'Удаление всей строки.' },
                    { key: 'dw', id: 'dw', desc: 'Удаление слова', example: 'Удаление слова от курсора.' },
                    { key: 'yy / p', id: 'yyp', desc: 'Копировать и вставить строку', example: 'Копирование и вставка строки.' },
                    { key: 'cw', id: 'cw', desc: 'Изменить слово', example: 'Удалить слово и войти в режим вставки.' },
                    { key: 'D', id: 'D', desc: 'Удалить до конца строки', example: 'Обрезать строку от курсора до конца.' },
                    { key: 'r', id: 'r', desc: 'Заменить один символ', example: 'Замена символа под курсором.' },
                ]
            },
            {
                category: 'Поиск',
                items: [
                    { key: '/текст', id: 'search-forward', desc: 'Поиск вперёд по тексту', example: 'Используйте / затем Enter для перехода.' },
                    { key: '?текст', id: 'search-backward', desc: 'Поиск назад по тексту', example: 'Используйте ? затем Enter для перехода.' },
                    { key: 'n / N', id: 'nN', desc: 'Следующее / предыдущее совпадение', example: 'Навигация по результатам поиска.' },
                ]
            },
            {
                category: 'Другое',
                items: [
                    { key: 'u / Ctrl+r', id: 'undo-redo', desc: 'Отмена / повтор изменений', example: 'Отменить или повторить правки.' },
                    { key: ':q / :wq', id: 'ex', desc: 'Выйти / сохранить и выйти', example: 'Использование ex-команд.' },
                ]
            }
        ];

        function renderCheatList(filter = '') {
            const q = filter.trim().toLowerCase();
            cheatContent.innerHTML = '';
            commandCatalog.forEach(group => {
                const matchedItems = group.items.filter(it => {
                    if (!q) return true;
                    return it.key.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q);
                });
                if (matchedItems.length === 0) return;
                const section = document.createElement('div');
                section.innerHTML = `<div class="text-blue-300 font-bold mb-2">${group.category}</div>`;
                const list = document.createElement('div');
                list.className = 'grid grid-cols-1 gap-2';
                matchedItems.forEach(it => {
                    const tried = practicedCommands.has(it.id);
                    const card = document.createElement('button');
                    card.className = `text-left bg-gray-900 border ${tried ? 'border-green-600' : 'border-gray-700'} hover:border-yellow-500 rounded-md p-3 flex items-center justify-between`;
                    card.innerHTML = `
                        <div>
                            <div class="text-yellow-300 font-mono">${it.key}</div>
                            <div class="text-gray-300 text-sm">${it.desc}</div>
                            <div class="text-gray-500 text-xs">${it.example}</div>
                        </div>
                        <div class="text-xs ${tried ? 'text-green-400' : 'text-blue-400'}">${tried ? 'Изучено' : 'Практика'}</div>
                    `;
                    card.addEventListener('click', () => startCheatPractice(it));
                    list.appendChild(card);
                });
                section.appendChild(list);
                cheatContent.appendChild(section);
            });
        }

        function openCheat() {
            cheatOverlay.classList.remove('hidden');
            cheatPanel.classList.remove('translate-x-full');
            cheatSearch.value = '';
            renderCheatList('');
            cheatSearch.focus();
        }
        function closeCheat() {
            cheatOverlay.classList.add('hidden');
            cheatPanel.classList.add('translate-x-full');
            editorInput.focus();
        }

        function startCheatPractice(item) {
            // Minimal practice: load a tiny buffer and set expectations based on command id
            // Save current level context
            const returnLevel = currentLevel;
            const practiceLevels = {
                'hjkL': {
                    instructions: "Практикуйте перемещение к '$' используя h/j/k/l.",
                    initialContent: ["move to the $"], target: { row: 0, col: 12 }
                },
                'wbe': {
                    instructions: "Используйте w для прыжка к 'target'.", initialContent: ["one two three target"], target: { row: 0, col: 14 }
                },
                'ggG': {
                    instructions: "Нажмите G для перехода на последнюю строку.", initialContent: ["a","b","c"], target: { row: 2, col: 0 }
                },
                '0$': {
                    instructions: "Нажмите $ для перехода в конец строки.", initialContent: ["line end here"], target: { row: 0, col: 12 }
                },
                'ia': {
                    instructions: "Нажмите a затем введите ! затем Esc.", initialContent: ["Hello"], targetText: { line: 0, text: "Hello!" }
                },
                'x': {
                    instructions: "Удалите x.", initialContent: ["ax"], targetText: { line: 0, text: "a" }
                },
                'dd': {
                    instructions: "Удалите единственную строку.", initialContent: ["remove me"], targetContent: [""]
                },
                'dw': {
                    instructions: "Удалите 'bad' используя dw.", initialContent: ["good bad"], targetText: { line: 0, text: "good " }
                },
                'yyp': {
                    instructions: "Скопируйте затем вставьте строку (yy затем p).", initialContent: ["copy"], targetContent: ["copy","copy"]
                },
                'cw': {
                    instructions: "Измените 'bad' на 'good'.", initialContent: ["bad"], targetText: { line: 0, text: "good" }
                },
                'D': {
                    instructions: "Удалите до конца от курсора.", initialContent: ["keep remove"], setup: () => { cursor = { row:0, col: 5 }; }, targetText: { line:0, text: "keep " }
                },
                'r': {
                    instructions: "Замените x на ! используя r.", initialContent: ["x"], targetText: { line:0, text: "!" }
                },
                'search-forward': {
                    instructions: "Поиск /target Enter для перехода.", initialContent: ["find target"], target: { row:0, col:5 }
                },
                'search-backward': {
                    instructions: "Поиск ?alpha Enter для перехода назад.", initialContent: ["alpha","beta alpha"], setup: () => { cursor = { row:1, col: 4 }; }, target: { row:0, col:0 }
                },
                'nN': {
                    instructions: "Поиск /foo затем нажмите n для перехода к следующему.", initialContent: ["foo","bar foo"], target: { row:1, col:4 }
                },
                'undo-redo': {
                    instructions: "Удалите строку с dd, отмените с u, повторите с Ctrl+r.", initialContent: ["x","y"], targetContent: ["y"], setup: () => { cursor={row:0,col:0}; }
                },
                'ex': {
                    instructions: "Введите :q затем Enter.", initialContent: ["exit lesson"], exCommands: ["q"], setup: () => { cursor={row:0,col:0}; }
                }
            };
            const pl = practiceLevels[item.id];
            if (!pl) return;
            closeCheat();
            // Inject a temporary level definition at the end and load it
            levels.push({
                name: `Практика: ${item.key}`,
                instructions: pl.instructions,
                initialContent: pl.initialContent,
                target: pl.target,
                targetText: pl.targetText,
                targetContent: pl.targetContent,
                exCommands: pl.exCommands,
                setup: pl.setup || (() => { cursor = { row:0, col:0 }; })
            });
            const practiceIndex = levels.length - 1;
            loadLevel(practiceIndex);
            // Hook into completion to return after win
            const originalShowModal = showModal;
            showModal = function() {
                // mark practiced
                practicedCommands.add(item.id);
                renderCheatList(cheatSearch.value);
                // restore and remove practice level, then return to previous level
                levels.pop();
                showModal = originalShowModal;
                currentLevel = returnLevel;
                loadLevel(currentLevel);
                openCheat();
            };
        }

        function showBadgeToast(message) {
            badgeToast.textContent = message;
            badgeToast.classList.remove('hidden');
            setTimeout(() => badgeToast.classList.add('hidden'), 2200);
        }

        function maybeAwardBadges() {
            // Beginner: after finishing levels up to basic movement group (1-3)
            if (!badges.has('beginner') && currentLevel >= 2) {
                badges.add('beginner');
                renderBadges();
                showBadgeToast('🟢 Получено звание Новичка!');
            }
            // Search Master: after completing any of the search levels while using search
            const searchNames = ['Поиск вперёд (/)','Поиск назад (?)','Навигация по поиску (n/N)'];
            if (!badges.has('searchmaster') && searchNames.includes(levels[currentLevel].name) && usedSearchInLevel) {
                badges.add('searchmaster');
                renderBadges();
                showBadgeToast('🔎 Получено звание Мастера Поиска!');
            }
        }

        function renderCommandLog() {
            commandLogEl.textContent = commandLog.slice(-10).join('');
        }

        // --- GAME LOGIC ---
        function checkWinCondition() {
            const level = levels[currentLevel];
            let won = false;
            
            if (level.exCommands) {
                if (lastExCommand && level.exCommands.includes(lastExCommand)) won = true;
            } else if (level.target) {
                // For search-focused levels, require actual search usage
                const searchLevelNames = ['Search Forward (/)','Search Backward (?)','Search Navigation (n/N)'];
                const isSearchLevel = searchLevelNames.includes(level.name);
                if (cursor.row === level.target.row && cursor.col === level.target.col) {
                    if (!isSearchLevel) {
                        won = true;
                    } else {
                        if (level.name === 'Search Navigation (n/N)') {
                            // Require at least two 'n' presses after search to reach 3rd occurrence
                            if (usedSearchInLevel && navCountSinceSearch >= 2 && lastSearchQuery && lastSearchQuery.toLowerCase() === 'foo' && lastSearchDirection === 'forward') won = true;
                        } else if (level.name === 'Search Forward (/)') {
                            // Now require one 'n' after search to reach second occurrence
                            if (usedSearchInLevel && lastSearchDirection === 'forward' && lastSearchQuery && lastSearchQuery.toLowerCase() === 'target' && navCountSinceSearch >= 1) {
                                won = true;
                            }
                        } else if (level.name === 'Search Backward (?)') {
                            // Require one 'N' after search to reach previous occurrence
                            if (usedSearchInLevel && lastSearchDirection === 'backward' && lastSearchQuery && lastSearchQuery.toLowerCase() === 'alpha' && navCountSinceSearch >= 1) {
                                won = true;
                            }
                        }
                    }
                }
            
            } else if (level.targetText) {
                if (content[level.targetText.line] === level.targetText.text && mode === 'NORMAL') won = true;
            
            } else if (level.targetContent) {
                // Compare lines after trimming trailing whitespace and ignoring trailing blank lines
                const trimLineEnd = (line) => line.replace(/\s+$/, '');
                const stripTrailingBlankLines = (lines) => {
                    const result = [...lines];
                    while (result.length > 0 && trimLineEnd(result[result.length - 1]) === '') {
                        result.pop();
                    }
                    return result;
                };
                const currentLines = stripTrailingBlankLines(content.map(trimLineEnd));
                const targetLines = stripTrailingBlankLines(level.targetContent.map(trimLineEnd));
                if (currentLines.length === targetLines.length && currentLines.every((l, i) => l === targetLines[i])) {
                    if (level.name === 'Undo / Redo') {
                        if (level12RedoAfterUndo) won = true;
                    } else {
                        won = true;
                    }
                }
            }

            if (won) {
                editorContainer.classList.add('level-complete-flash');
                setTimeout(() => {
                    maybeAwardBadges();
                    showModal();
                    editorContainer.classList.remove('level-complete-flash');
                }, 500);
            }
        }

        function showModal() {
            if (currentLevel === levels.length - 1) {
                showCelebration();
                return;
            }
            modalTitle.textContent = `Уровень ${currentLevel + 1} пройден!`;
            modalMessage.textContent = `Вы освоили: ${levels[currentLevel].name}.`;
            nextLevelBtn.textContent = "Следующий уровень";
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modalContent.classList.remove('scale-95');

            // Allow advancing with Enter key while modal is visible
            const handleEnterAdvance = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Advance level same as clicking next
                    if (currentLevel === levels.length - 1) {
                        currentLevel = 0;
                    } else {
                        currentLevel++;
                    }
                    loadLevel(currentLevel);
                    hideModal();
                    editorInput.focus();
                    window.removeEventListener('keydown', handleEnterAdvance, true);
                }
            };
            // Use capture to ensure we catch it even if focus is elsewhere
            window.addEventListener('keydown', handleEnterAdvance, true);
        }
        
        function hideModal() {
            modal.classList.add('opacity-0', 'pointer-events-none');
            modalContent.classList.add('scale-95');
        }

        // Celebration helpers
        function spawnConfettiOnce() {
            // clear previous
            celebration.querySelectorAll('.confetti').forEach(n => n.remove());
            const emojis = ['🎉','✨','🎊','⭐','💥','🔥'];
            const pieces = 60;
            for (let i = 0; i < pieces; i++) {
                const span = document.createElement('span');
                span.className = 'confetti';
                span.textContent = emojis[i % emojis.length];
                span.style.left = Math.random() * 100 + 'vw';
                span.style.animationDuration = (5 + Math.random() * 3).toFixed(2) + 's';
                span.style.animationDelay = (Math.random() * 1.5).toFixed(2) + 's';
                span.style.transform = `translateY(${Math.random()*-40}vh)`;
                celebration.appendChild(span);
            }
        }

        function showCelebration() {
            celebration.classList.remove('hidden');
            // force layout to center on current viewport
            celebration.style.left = '0';
            celebration.style.top = '0';
            celebration.style.right = '0';
            celebration.style.bottom = '0';
            spawnConfettiOnce();
            const handleEnterRestart = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    restartFromCelebration();
                    window.removeEventListener('keydown', handleEnterRestart, true);
                }
            };
            window.addEventListener('keydown', handleEnterRestart, true);
        }

        function hideCelebration() {
            celebration.classList.add('hidden');
            celebration.style.left = '';
            celebration.style.top = '';
            celebration.style.right = '';
            celebration.style.bottom = '';
            celebration.querySelectorAll('.confetti').forEach(n => n.remove());
        }

        function restartFromCelebration() {
            currentLevel = 0;
            loadLevel(currentLevel);
            hideCelebration();
            editorInput.focus();
        }

        function createLevelButtons() {
            levelSelectionContainer.innerHTML = ''; // Clear existing buttons
            levels.forEach((level, index) => {
                const button = document.createElement('button');
                button.textContent = `${index + 1}`;
                button.dataset.level = index;
                button.className = `w-8 h-8 flex items-center justify-center rounded-md transition-colors font-bold`;
                if (index === currentLevel) {
                    button.classList.add('bg-yellow-400', 'text-gray-900');
                } else {
                    button.classList.add('bg-gray-700', 'text-gray-300', 'hover:bg-gray-600');
                }
                levelSelectionContainer.appendChild(button);
            });
        }

        function loadLevel(levelIndex) {
            currentLevel = levelIndex;
            if (levelIndex >= levels.length) {
                currentLevel = 0;
            }
            const level = levels[currentLevel];
            content = [...level.initialContent];
            instructionsEl.textContent = level.instructions;
            levelIndicator.textContent = `Level: ${currentLevel + 1} / ${levels.length}`;
            level.setup();
            mode = 'NORMAL';
            commandHistory = '';
            commandLog = [];
            yankedLine = null;
            level12Undo = false;
            level12RedoAfterUndo = false;
            lastExCommand = null;
            usedSearchInLevel = false;
            searchMode = false;
            searchQuery = '';
            lastSearchQuery = null;
            lastSearchDirection = 'forward';
            searchMatches = [];
            currentMatchIndex = -1;
            navCountSinceSearch = 0;
            updateStatusBar();
            renderCommandLog();
            renderEditor();
            createLevelButtons();
            renderBadges();
        }

        // --- INPUT HANDLING ---
        function handleNormalMode(e) {
            e.preventDefault();
            const key = e.key;
            const isWordChar = (char) => /\w/.test(char);
            // Enter search mode
            if (key === '/' || key === '?') {
                searchMode = true;
                searchQuery = '';
                lastSearchDirection = key === '?' ? 'backward' : 'forward';
                mode = 'NORMAL';
                updateStatusBar();
                return;
            }

            // n / N navigation for last search
            if ((key === 'n' || key === 'N') && lastSearchQuery) {
                const forward = (key === 'n') ? (lastSearchDirection === 'forward') : (lastSearchDirection === 'backward');
                if (searchMatches.length === 0) {
                    updateStatusBar();
                    return;
                }
                if (currentMatchIndex === -1) currentMatchIndex = 0;
                if (forward) {
                    currentMatchIndex = (currentMatchIndex + 1) % searchMatches.length;
                } else {
                    currentMatchIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
                }
                const m = searchMatches[currentMatchIndex];
                cursor.row = m.row;
                cursor.col = Math.max(0, m.start);
                navCountSinceSearch++;
                updateStatusBar();
                renderEditor();
                checkWinCondition();
                return;
            }

            // Redo (Ctrl+r) should be handled before any other 'r' logic
            if (key === 'r' && e.ctrlKey) {
                const next = redoStack.pop();
                if (next) {
                    undoStack.push(cloneState());
                    content = [...next.content];
                    cursor = { ...next.cursor };
                    mode = next.mode;
                    yankedLine = next.yankedLine;
                }
                if (levels[currentLevel].name === 'Undo / Redo' && level12Undo) {
                    level12RedoAfterUndo = true;
                }
                renderEditor();
                checkWinCondition();
                return;
            }

            // Handle Ex commands on Enter: parse from last ':'
            if (key === 'Enter') {
                const idx = commandHistory.lastIndexOf(':');
                if (idx !== -1) {
                    const cmd = commandHistory.slice(idx + 1).trim();
                    lastExCommand = cmd;
                }
                commandHistory = '';
                commandLog = [];
                renderCommandLog();
                checkWinCondition();
                return;
            }

            // Start single-char replace immediately so it doesn't get logged in command history
            if (key === 'r' && !replacePending) {
                replacePending = true;
                commandLog = [];
                return;
            }

            // Handle pending single-char replace (r)
            if (replacePending) {
                // Ignore modifier keys while waiting for the actual replacement character
                if (key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta') {
                    return;
                }
                // Allow cancel with Escape
                if (isEscapeKey(e)) {
                    replacePending = false;
                    renderEditor();
                    return;
                }
                if (key.length === 1) {
                    let line = content[cursor.row];
                    if (cursor.col < line.length) {
                        content[cursor.row] = line.slice(0, cursor.col) + key + line.slice(cursor.col + 1);
                    } else {
                        // If at end, append
                        content[cursor.row] = line + key;
                    }
                    replacePending = false;
                    renderEditor();
                    checkWinCondition();
                    return;
                }
                // For other non-printable keys, do nothing but keep waiting
                return;
            }

            // Handle counts
            if (/^[0-9]$/.test(key)) {
                if (!(key === '0' && countBuffer === '')) {
                    countBuffer += key;
                    commandLog.push(key);
                    renderCommandLog();
                    return;
                }
            }
            if (key.length === 1 && key !== 'Shift' && key !== 'Control' && key !== 'Alt') {
                commandLog.push(key);
                commandHistory += key;
                renderCommandLog();
            }

            // Movement
            const count = countBuffer ? Math.max(1, parseInt(countBuffer, 10)) : 1;
            const repeat = (n, fn) => { for (let i = 0; i < n; i++) fn(i); };
            if (key === 'h') repeat(count, () => { if (cursor.col > 0) cursor.col--; });
            if (key === 'l') repeat(count, () => { if (cursor.col < content[cursor.row].length - 1) cursor.col++; });
            if (key === 'k') repeat(count, () => { if (cursor.row > 0) cursor.row--; });
            if (key === 'j') repeat(count, () => { if (cursor.row < content.length - 1) cursor.row++; });
            if (key === '0') { cursor.col = 0; }
            if (key === '$') { const line = content[cursor.row]; cursor.col = Math.max(0, line.length - 1); }

            // Word movement
            // Avoid moving on 'w' when it's part of operators like 'dw' or 'cw'
            if (key === 'w' && !(commandHistory.endsWith('dw') || commandHistory.endsWith('cw'))) {
                repeat(count, () => {
                    const line = content[cursor.row];
                    const match = line.substring(cursor.col).match(/\s\S/);
                    if (match) {
                        cursor.col += match.index + 1;
                    } else if (cursor.row < content.length - 1) {
                        cursor.row++;
                        cursor.col = 0;
                    }
                });
            }
            if (key === 'b') {
                repeat(count, () => {
                    const line = content[cursor.row];
                    const sub = line.substring(0, cursor.col).trimEnd();
                    const lastSpace = sub.lastIndexOf(' ');
                    cursor.col = lastSpace !== -1 ? lastSpace + 1 : 0;
                });
            }
            if (key === 'e') {
                repeat(count, () => {
                    const line = content[cursor.row];
                    let i = cursor.col;
                    if (i < line.length - 1) { i++; }
                    while (i < line.length && !isWordChar(line[i])) { i++; }
                    while (i < line.length - 1 && isWordChar(line[i + 1])) { i++; }
                    if (isWordChar(line[i])) { cursor.col = i; }
                });
            }

            // Line jumps
            if (commandHistory.endsWith('gg')) {
                cursor.row = 0;
                cursor.col = 0;
                commandHistory = ''; commandLog = [];
            }
            if (key === 'G') {
                if (countBuffer) {
                    const lineNum = Math.max(1, parseInt(countBuffer, 10));
                    cursor.row = Math.min(content.length - 1, lineNum - 1);
                    cursor.col = 0;
                } else {
                    cursor.row = content.length - 1;
                    cursor.col = 0;
                }
            }

            // Mode change
            if (key === 'i') {
                mode = 'INSERT';
                commandLog = [];
            }
            if (key === 'a') {
                pushUndo();
                const line = content[cursor.row];
                if (cursor.col < line.length) cursor.col++;
                mode = 'INSERT';
                commandLog = [];
            }
            if (key === 'o') {
                pushUndo();
                cursor.row++;
                content.splice(cursor.row, 0, "");
                cursor.col = 0;
                mode = 'INSERT';
                commandLog = [];
            }
            if (key === 'O') {
                pushUndo();
                content.splice(cursor.row, 0, "");
                cursor.col = 0;
                mode = 'INSERT';
                commandLog = [];
            }
            
            // Deletion
            if (key === 'x') {
                pushUndo();
                const count = countBuffer ? Math.max(1, parseInt(countBuffer, 10)) : 1;
                for (let i = 0; i < count; i++) {
                    let line = content[cursor.row];
                    if (cursor.col < line.length) {
                        content[cursor.row] = line.slice(0, cursor.col) + line.slice(cursor.col + 1);
                    }
                }
            }
            if (commandHistory.endsWith('dw')) {
                pushUndo();
                const count = countBuffer ? Math.max(1, parseInt(countBuffer, 10)) : 1;
                for (let i = 0; i < count; i++) {
                    let line = content[cursor.row];
                    let start = cursor.col;
                    let endOfWord = line.substring(start).search(/\s|$/);
                    if (endOfWord === -1) { endOfWord = line.length; } else { endOfWord += start; }
                    let startOfNextWord = line.substring(endOfWord).search(/\S/);
                    if (startOfNextWord === -1) { startOfNextWord = line.length; } else { startOfNextWord += endOfWord; }
                    content[cursor.row] = line.slice(0, start) + line.slice(startOfNextWord);
                }
                commandHistory = ''; commandLog = [];
            }
            if (commandHistory.endsWith('cw')) {
                pushUndo();
                // Change word: delete to end of current word and enter insert mode
                let line = content[cursor.row];
                let start = cursor.col;
                let endRel = line.substring(start).search(/\s|$/);
                let end = endRel === -1 ? line.length : start + endRel;
                content[cursor.row] = line.slice(0, start) + line.slice(end);
                mode = 'INSERT';
                commandHistory = ''; commandLog = [];
            }
            if (key === 'D') {
                // Delete to end of line
                pushUndo();
                let line = content[cursor.row];
                content[cursor.row] = line.slice(0, cursor.col);
                commandLog = [];
            }
            // 'r' handled above
            if (commandHistory.endsWith('dd')) {
                pushUndo();
                const count = countBuffer ? Math.max(1, parseInt(countBuffer, 10)) : 1;
                for (let i = 0; i < count; i++) {
                    yankedLine = content.splice(cursor.row, 1)[0];
                    if (content.length === 0) content.push("");
                    if (cursor.row >= content.length) cursor.row = content.length - 1;
                }
                cursor.col = 0;
                commandHistory = ''; commandLog = [];
            }
            
            // Yank & Put
            if (commandHistory.endsWith('yy')) {
                const count = countBuffer ? Math.max(1, parseInt(countBuffer, 10)) : 1;
                yankedLine = content[Math.min(content.length - 1, cursor.row + count - 1)];
                commandHistory = ''; commandLog = [];
            }
            if (key === 'p' && yankedLine !== null) {
                pushUndo();
                const count = countBuffer ? Math.max(1, parseInt(countBuffer, 10)) : 1;
                for (let i = 0; i < count; i++) {
                    content.splice(cursor.row + 1, 0, yankedLine);
                }
            }

            // Clear operator combos when standalone keys are pressed

            if (['h','j','k','l','w','b','e','G','i','a','o','O','x','p','0','$','D'].includes(key)) {
                commandLog = [];
            }

            // Undo / Redo
            if (key === 'u') {
                const prev = undoStack.pop();
                if (prev) {
                    redoStack.push(cloneState());
                    content = [...prev.content];
                    cursor = { ...prev.cursor };
                    mode = prev.mode;
                    yankedLine = prev.yankedLine;
                }
                if (levels[currentLevel].name === 'Undo / Redo') {
                    level12Undo = true;
                    level12RedoAfterUndo = false;
                }
                renderEditor();
                checkWinCondition();
                return;
            }

            // Reset count when a non-digit key processed
            if (!/^[0-9]$/.test(key)) countBuffer = '';

            // Ensure cursor is within bounds
            if (cursor.row >= content.length) cursor.row = content.length - 1;
            if (cursor.col > content[cursor.row].length) cursor.col = content[cursor.row].length;
            if (cursor.col < 0) cursor.col = 0;
            if(mode === 'NORMAL' && cursor.col === content[cursor.row].length && content[cursor.row].length > 0) {
                cursor.col--;
            }

            updateStatusBar();
            renderEditor();
            if (mode === 'NORMAL') checkWinCondition();
        }

        function recomputeSearchMatches() {
            searchMatches = [];
            if (!lastSearchQuery || lastSearchQuery.length === 0) return;
            const needle = lastSearchQuery.toLowerCase();
            for (let r = 0; r < content.length; r++) {
                const line = content[r];
                const lineLower = line.toLowerCase();
                let idx = 0;
                while (true) {
                    const found = lineLower.indexOf(needle, idx);
                    if (found === -1) break;
                    searchMatches.push({ row: r, start: found, end: found + needle.length });
                    idx = found + (needle.length > 0 ? Math.max(1, needle.length) : 1);
                }
            }
        }

        function jumpToFirstMatchFromCursor() {
            if (searchMatches.length === 0) { currentMatchIndex = -1; return; }
            const startRow = cursor.row;
            const startCol = cursor.col;
            let bestIndex = -1;
            if (lastSearchDirection === 'forward') {
                // first match at or after cursor position scanning forward through lines
                for (let i = 0; i < searchMatches.length; i++) {
                    const m = searchMatches[i];
                    if (m.row < startRow) continue;
                    if (m.row === startRow && m.start < startCol) continue;
                    bestIndex = i; break;
                }
                if (bestIndex === -1) bestIndex = 0; // wrap
            } else {
                // first match at or before cursor scanning backward
                for (let i = searchMatches.length - 1; i >= 0; i--) {
                    const m = searchMatches[i];
                    if (m.row > startRow) continue;
                    if (m.row === startRow && m.start > startCol) continue;
                    bestIndex = i; break;
                }
                if (bestIndex === -1) bestIndex = searchMatches.length - 1; // wrap
            }
            currentMatchIndex = bestIndex;
            const m = searchMatches[currentMatchIndex];
            cursor.row = m.row;
            cursor.col = Math.max(0, m.start);
        }

        function handleSearchMode(e) {
            e.preventDefault();
            const key = e.key;
            if (isEscapeKey(e)) {
                searchMode = false;
                searchQuery = '';
                updateStatusBar();
                return;
            }
            if (key === 'Backspace') {
                searchQuery = searchQuery.slice(0, -1);
                updateStatusBar();
                return;
            }
            if (key === 'Enter') {
                lastSearchQuery = searchQuery;
                usedSearchInLevel = true;
                searchMode = false;
                currentMatchIndex = -1;
                recomputeSearchMatches();
                jumpToFirstMatchFromCursor();
                navCountSinceSearch = 0;
                updateStatusBar();
                renderEditor();
                checkWinCondition();
                return;
            }
            if (key.length === 1) {
                searchQuery += key;
                updateStatusBar();
            }
        }

        function handleInsertMode(e) {
            e.preventDefault();
            let line = content[cursor.row];
            if (isEscapeKey(e)) {
                mode = 'NORMAL';
                if (cursor.col > 0) cursor.col--;
            } else if (e.key === 'Backspace') {
                if (cursor.col > 0) {
                    content[cursor.row] = line.slice(0, cursor.col - 1) + line.slice(cursor.col);
                    cursor.col--;
                }
            } else if (e.key.length === 1) {
                content[cursor.row] = line.slice(0, cursor.col) + e.key + line.slice(cursor.col);
                cursor.col++;
            }
            updateStatusBar();
            renderEditor();
            if (mode === 'NORMAL') checkWinCondition();
        }

        // --- EVENT LISTENERS ---
        editorInput.addEventListener('keydown', (e) => {
            if (searchMode) {
                handleSearchMode(e);
                return;
            }
            if (mode === 'NORMAL') {
                handleNormalMode(e);
            } else {
                handleInsertMode(e);
            }
        });

        editorContainer.addEventListener('click', () => editorInput.focus());
        
        nextLevelBtn.addEventListener('click', () => {
            if (currentLevel === levels.length - 1) {
                showCelebration();
            } else {
                currentLevel++;
                loadLevel(currentLevel);
                hideModal();
                editorInput.focus();
            }
        });

        celebrationRestartBtn.addEventListener('click', restartFromCelebration);

        resetBtn.addEventListener('click', () => {
            loadLevel(currentLevel);
            editorInput.focus();
        });

        levelSelectionContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const levelIndex = parseInt(e.target.dataset.level, 10);
                if (levelIndex !== currentLevel) {
                    loadLevel(levelIndex);
                }
                editorInput.focus();
            }
        });

        // Ensure Ctrl+R redo is not swallowed by browser reload even if focus drifts
        window.addEventListener('keydown', (e) => {
            if (mode === 'NORMAL' && e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                handleNormalMode(e);
            }
            // Toggle Cheat Mode with Ctrl+/
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                if (cheatPanel.classList.contains('translate-x-full')) {
                    openCheat();
                } else {
                    closeCheat();
                }
            }
        }, true);

        challengeToggleBtn.addEventListener('click', () => {
            challengeMode = !challengeMode;
            if (challengeMode) {
                challengeContainer.classList.remove('hidden');
                startChallenge();
            } else {
                challengeContainer.classList.add('hidden');
                // If in challenge mode, return to current level
                loadLevel(currentLevel);
                editorInput.focus();
            }
        });

        // Cheat panel controls
        const cheatToggleBtn = document.getElementById('cheat-toggle');
        if (cheatToggleBtn) {
            cheatToggleBtn.addEventListener('click', () => {
                if (cheatPanel.classList.contains('translate-x-full')) openCheat(); else closeCheat();
            });
        }
        cheatOverlay.addEventListener('click', closeCheat);
        cheatCloseBtn.addEventListener('click', closeCheat);
        cheatSearch.addEventListener('input', (e) => renderCheatList(e.target.value));

        // --- INITIAL LOAD ---
        loadLevel(currentLevel);
        editorInput.focus();

        // --- CHALLENGE FUNCTIONS ---

        // --- DEV TESTING UTILITIES ---
        // Simple input simulation to verify Ctrl-[ behaves like Escape
        window.simulateEscapeEquivalence = () => {
            // Prepare a tiny scenario: enter insert, type 'x', then exit with Esc and with Ctrl-[ and compare states
            const snapshotState = () => ({
                content: [...content],
                cursor: { ...cursor },
                mode
            });

            // Baseline: reset level and go to insert
            const original = cloneState();
            mode = 'INSERT';
            const beforeEsc = snapshotState();
            // Simulate Escape
            handleInsertMode({ key: 'Escape', preventDefault: () => {} });
            const afterEsc = snapshotState();

            // Restore and simulate Ctrl-[
            content = [...original.content];
            cursor = { ...original.cursor };
            mode = 'INSERT';
            const beforeCtrl = snapshotState();
            handleInsertMode({ key: '[', ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, preventDefault: () => {} });
            const afterCtrl = snapshotState();

            return {
                beforeEsc,
                afterEsc,
                beforeCtrl,
                afterCtrl,
                equal: JSON.stringify(afterEsc) === JSON.stringify(afterCtrl)
            };
        };
        function startChallenge() {
            if (currentChallenge) return;
            
            // Select a random challenge
            const challengeIndex = Math.floor(Math.random() * challenges.length);
            currentChallenge = challenges[challengeIndex];
            currentTaskIndex = 0;
            challengeScoreValue = 0;
            challengeProgressValue = 0;
            challengeStartTime = Date.now();
            
            // Update UI
            challengeInstructions.textContent = `${currentChallenge.description} (Editor is focused - commands ready!)`;
            challengeTotal.textContent = currentChallenge.tasks.length;
            challengeProgress.textContent = '0';
            challengeScore.textContent = '0';
            
            // Load challenge content
            content = [...currentChallenge.initialContent];
            cursor = { row: 0, col: 0 };
            mode = 'NORMAL';
            renderEditor();
            
            // Start timer
            const timeLeft = currentChallenge.timeLimit;
            challengeTimer.textContent = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
            
            challengeTimerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - challengeStartTime) / 1000);
                const remaining = currentChallenge.timeLimit - elapsed;
                
                if (remaining <= 0) {
                    endChallenge(false);
                    return;
                }
                
                const minutes = Math.floor(remaining / 60);
                const seconds = remaining % 60;
                challengeTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
            
            // Show first task
            showCurrentTask();
            
            // Focus the editor so commands work immediately
            editorInput.focus();
        }

        function showCurrentTask() {
            if (!currentChallenge || currentTaskIndex >= currentChallenge.tasks.length) return;
            
            const task = currentChallenge.tasks[currentTaskIndex];
            challengeInstructions.textContent = `Task ${currentTaskIndex + 1}: ${task.instruction}`;
        }

        function checkChallengeTask() {
            if (!currentChallenge || currentTaskIndex >= currentChallenge.tasks.length) return;
            
            const task = currentChallenge.tasks[currentTaskIndex];
            if (task.validation()) {
                // Task completed
                challengeProgressValue++;
                challengeProgress.textContent = challengeProgressValue;
                
                // Calculate score based on time
                const elapsed = Math.floor((Date.now() - challengeStartTime) / 1000);
                const timeBonus = Math.max(0, currentChallenge.timeLimit - elapsed);
                const taskScore = 100 + timeBonus;
                challengeScoreValue += taskScore;
                challengeScore.textContent = challengeScoreValue;
                
                currentTaskIndex++;
                
                if (currentTaskIndex >= currentChallenge.tasks.length) {
                    // All tasks completed
                    endChallenge(true);
                } else {
                    // Show next task
                    showCurrentTask();
                }
            }
        }

        function endChallenge(success) {
            if (challengeTimerInterval) {
                clearInterval(challengeTimerInterval);
                challengeTimerInterval = null;
            }

            if (success) {
                const elapsed = Math.floor((Date.now() - challengeStartTime) / 1000);
                const finalScore = challengeScoreValue + Math.max(0, currentChallenge.timeLimit - elapsed) * 10;

                alert(`Испытание завершено!\nИтоговый счёт: ${finalScore}\nВремя: ${elapsed}с\nОтличная работа!`);
            } else {
                alert('Время вышло! Испытание не пройдено. Попробуйте снова!');
            }

            // Reset challenge state
            challengeMode = false;
            currentChallenge = null;
            currentTaskIndex = 0;
            challengeScoreValue = 0;
            challengeProgressValue = 0;

            // Hide challenge container
            challengeContainer.classList.add('hidden');

            // Return to current level
            loadLevel(currentLevel);
            editorInput.focus();
        }

        // Add challenge task checking to win condition
        const originalCheckWinCondition = checkWinCondition;
        checkWinCondition = function() {
            if (challengeMode && currentChallenge) {
                checkChallengeTask();
            }
            return originalCheckWinCondition.call(this);
        };