const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color; // Color personalizado 
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebote superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY *= -1;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX *= -1;
    }
}

class Paddle {
    constructor(x, y, width, height, color, isPlayer = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color; // Color de paleta 
        this.isPlayer = isPlayer;
        this.speed = 7;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) this.y -= this.speed;
        if (direction === 'down' && this.y + this.height < canvas.height) this.y += this.speed;
    }

    autoMove(balls) {
        // Sigue a la primera pelota que se acerque
        const ball = balls[0];
        if (ball.y < this.y + this.height / 2) this.y -= this.speed - 2;
        else if (ball.y > this.y + this.height / 2) this.y += this.speed - 2;
    }
}

class Game {
    constructor() {
        // Requerimiento: 5 pelotas con diferentes propiedades 
        this.balls = [
            new Ball(400, 300, 10, 4, 4, 'white'),
            new Ball(400, 300, 8, -5, 3, 'yellow'),
            new Ball(400, 300, 12, 3, -6, 'cyan'),
            new Ball(400, 300, 15, -4, -4, 'magenta'),
            new Ball(400, 300, 7, 6, 2, 'orange')
        ];

        // Requerimiento: Paleta jugador con doble de alto 
        this.paddle1 = new Paddle(10, 200, 15, 200, '#4CAF50', true); 
        this.paddle2 = new Paddle(canvas.width - 25, 250, 15, 100, '#FF5252');
        
        this.keys = {};
        this.handleInput();
    }

    handleInput() {
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }

    update() {
        if (this.keys['ArrowUp']) this.paddle1.move('up');
        if (this.keys['ArrowDown']) this.paddle1.move('down');

        this.paddle2.autoMove(this.balls);

        this.balls.forEach(ball => {
            ball.move();

            // Colisión Paleta 1 (Jugador) 
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y > this.paddle1.y && ball.y < this.paddle1.y + this.paddle1.height) {
                ball.speedX *= -1;
                ball.x = this.paddle1.x + this.paddle1.width + ball.radius;
            }

            // Colisión Paleta 2 (IA)
            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y > this.paddle2.y && ball.y < this.paddle2.y + this.paddle2.height) {
                ball.speedX *= -1;
                ball.x = this.paddle2.x - ball.radius;
            }

            // Reset si sale de pantalla
            if (ball.x < 0 || ball.x > canvas.width) ball.reset();
        });
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.balls.forEach(ball => ball.draw());
        this.paddle1.draw();
        this.paddle2.draw();
    }

    run() {
        const loop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(loop);
        };
        loop();
    }
}

const game = new Game();
game.run();