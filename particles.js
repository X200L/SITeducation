class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = '#007acc';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = window.innerWidth < 768 ? 25 : 50;
        this.isLight = document.documentElement.getAttribute('data-theme') === 'light';
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.updateInterval = this.isMobile ? 30 : 16;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        document.addEventListener('theme-changed', () => {
            this.isLight = document.documentElement.getAttribute('data-theme') === 'light';
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = this.isLight ? 'rgba(0, 122, 204, 0.03)' : 'rgba(79, 193, 255, 0.03)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        this.particles.forEach(particle1 => {
            this.particles.forEach(particle2 => {
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.isLight ? 'rgba(0, 122, 204, 0.1)' : 'rgba(79, 193, 255, 0.1)';
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            });
        });

        if (this.isMobile) {
            setTimeout(() => requestAnimationFrame(() => this.animate()), this.updateInterval);
        } else {
            requestAnimationFrame(() => this.animate());
        }
    }
} 