class HackathonManager {
    constructor() {
        this.hackathonsContainer = document.getElementById('hackathonsList');
        this.searchInput = document.getElementById('searchHackathons');
        this.categoryButtons = document.querySelectorAll('.filter-tag');
        this.currentCategory = 'all';
        this.hackathons = [];

        this.init();
    }

    async init() {
        await this.loadHackathons();
        this.setupEventListeners();
    }

    async loadHackathons() {
        try {
            const response = await fetch('hackathons/index.json');
            const hackathonsIndex = await response.json();
            this.hackathons = hackathonsIndex;
            this.renderHackathons(this.hackathons);
        } catch (error) {
            console.error('Ошибка загрузки хакатонов:', error);
            this.showError();
        }
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterHackathons());
        
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentCategory = button.dataset.category;
                this.filterHackathons();
            });
        });
    }

    filterHackathons() {
        const searchQuery = this.searchInput.value.toLowerCase();
        const filteredHackathons = this.hackathons.filter(hackathon => {
            const matchesSearch = hackathon.title.toLowerCase().includes(searchQuery) ||
                                hackathon.preview.toLowerCase().includes(searchQuery);
            const matchesCategory = this.currentCategory === 'all' || 
                                  hackathon.category === this.currentCategory;
            return matchesSearch && matchesCategory;
        });

        this.renderHackathons(filteredHackathons);
    }

    async loadHackathonContent(filename) {
        try {
            const response = await fetch(`hackathons/${filename}`);
            const content = await response.text();
            return marked.parse(content);
        } catch (error) {
            console.error('Ошибка загрузки содержимого хакатона:', error);
            return 'Ошибка загрузки содержимого';
        }
    }

    renderHackathons(hackathons) {
        if (hackathons.length === 0) {
            this.hackathonsContainer.innerHTML = `
                <div class="no-results">
                    <h2>Хакатоны не найдены</h2>
                    <p>Попробуйте изменить параметры поиска</p>
                </div>
            `;
            return;
        }

        this.hackathonsContainer.innerHTML = hackathons.map(hackathon => `
            <article class="hackathon-card" data-category="${hackathon.category}">
                ${hackathon.image ? `
                <div class="hackathon-image">
                    <img src="${hackathon.image}" alt="${hackathon.title}">
                </div>
                ` : ''}
                <div class="hackathon-content">
                    <h2 class="hackathon-title">${hackathon.title}</h2>
                    <p class="hackathon-preview">${hackathon.preview}</p>
                    <div class="hackathon-meta">
                        <span class="hackathon-date">
                            <i class="far fa-calendar"></i>
                            ${new Date(hackathon.date).toLocaleDateString('ru-RU')}
                        </span>
                        <span class="hackathon-category">
                            <i class="fas fa-tag"></i>
                            ${hackathon.category}
                        </span>
                    </div>
                    <div class="hackathon-details">
                        <span class="hackathon-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${hackathon.location}
                        </span>
                        <span class="hackathon-deadline">
                            <i class="fas fa-hourglass-end"></i>
                            Регистрация до: ${new Date(hackathon.registrationDeadline).toLocaleDateString('ru-RU')}
                        </span>
                    </div>
                    <button class="read-more" onclick="hackathonManager.showFullHackathon('${hackathon.filename}')">
                        Подробнее
                    </button>
                </div>
            </article>
        `).join('');
    }

    async showFullHackathon(filename) {
        const content = await this.loadHackathonContent(filename);
        const modal = document.createElement('div');
        modal.className = 'hackathon-modal';
        modal.innerHTML = `
            <div class="hackathon-modal-content">
                <button class="close-modal" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="hackathon-full-content">
                    ${content}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showError() {
        this.hackathonsContainer.innerHTML = `
            <div class="error-message">
                <h2>Ошибка загрузки хакатонов</h2>
                <p>Пожалуйста, попробуйте позже</p>
                <button onclick="hackathonManager.loadHackathons()">Повторить попытку</button>
            </div>
        `;
    }
}

// Инициализация при загрузке страницы
let hackathonManager;
document.addEventListener('DOMContentLoaded', () => {
    hackathonManager = new HackathonManager();
}); 