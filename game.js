const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scale = 20; // Size of the grid
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let apple;
let speed;
let score;
let powerUp;

document.addEventListener("keydown", changeDirection);

(function setup() {
    snake = new Snake();
    apple = new Apple();
    speed = 5;
    score = 0;
    powerUp = null;
    window.setInterval(updateGame, 1000 / speed);
})();

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    snake.draw();

    apple.draw();

    if (powerUp) {
        powerUp.draw();
        if (snake.x === powerUp.x && snake.y === powerUp.y) {
            powerUp.activate(snake);
        }
    }

    if (snake.eat(apple)) {
        score += 10;
        document.getElementById("score").textContent = score;
        apple = new Apple();
        if (score % 50 === 0) speedUp();
    }

    if (snake.collide()) {
        resetGame();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;

    if (keyPressed === 37 && snake.direction !== "RIGHT") {
        snake.setDirection("LEFT");
    } else if (keyPressed === 38 && snake.direction !== "DOWN") {
        snake.setDirection("UP");
    } else if (keyPressed === 39 && snake.direction !== "LEFT") {
        snake.setDirection("RIGHT");
    } else if (keyPressed === 40 && snake.direction !== "UP") {
        snake.setDirection("DOWN");
    }
}

function speedUp() {
    if (speed < 20) speed++;
    document.getElementById("speed").textContent = speed;
}

function resetGame() {
    snake = new Snake();
    score = 0;
    speed = 5;
    document.getElementById("score").textContent = score;
    document.getElementById("speed").textContent = speed;
}

function Snake() {
    this.x = 5;
    this.y = 5;
    this.snakeArray = [{ x: this.x, y: this.y }];
    this.direction = "RIGHT";

    this.update = function() {
        const head = { x: this.x, y: this.y };

        switch (this.direction) {
            case "LEFT":
                this.x -= 1;
                break;
            case "UP":
                this.y -= 1;
                break;
            case "RIGHT":
                this.x += 1;
                break;
            case "DOWN":
                this.y += 1;
                break;
        }

        this.snakeArray.unshift({ x: this.x, y: this.y });

        if (this.snakeArray.length > score / 10 + 1) {
            this.snakeArray.pop();
        }
    };

    this.draw = function() {
        this.snakeArray.forEach(function(part) {
            ctx.fillStyle = "#00ff00";
            ctx.fillRect(part.x * scale, part.y * scale, scale, scale);
        });
    };

    this.eat = function(apple) {
        return this.x === apple.x && this.y === apple.y;
    };

    this.collide = function() {
        if (this.x < 0 || this.x >= columns || this.y < 0 || this.y >= rows) return true;

        for (let i = 1; i < this.snakeArray.length; i++) {
            if (this.x === this.snakeArray[i].x && this.y === this.snakeArray[i].y) return true;
        }

        return false;
    };

    this.setDirection = function(newDirection) {
        this.direction = newDirection;
    };
}

function Apple() {
    this.x = Math.floor(Math.random() * columns);
    this.y = Math.floor(Math.random() * rows);

    this.draw = function() {
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
    };
}

function PowerUp() {
    this.x = Math.floor(Math.random() * columns);
    this.y = Math.floor(Math.random() * rows);
    this.type = Math.random() > 0.5 ? "speed" : "grow";

    this.draw = function() {
        ctx.fillStyle = this.type === "speed" ? "#ffff00" : "#0000ff";
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
    };

    this.activate = function(snake) {
        if (this.type === "speed") {
            speedUp();
        } else if (this.type === "grow") {
            snake.snakeArray.push({ x: snake.x, y: snake.y });
        }
        powerUp = null;
    };
}

setInterval(() => {
    if (!powerUp && Math.random() < 0.1) {
        powerUp = new PowerUp();
    }
}, 3000);
