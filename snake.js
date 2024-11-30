const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = 20;

let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval;
let isPaused = false;
let isGameOver = false;

// 初始化游戏
function initGame() {
    snake = [
        { x: 10, y: 10 }
    ];
    score = 0;
    scoreElement.textContent = `得分: ${score}`;
    createFood();
    dx = 0;
    dy = 0;
    isGameOver = false;
}

// 创建食物
function createFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // 确保食物不会出现在蛇身上
    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            createFood();
        }
    }
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇
    ctx.fillStyle = 'green';
    for (let part of snake) {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // 游戏结束显示
    if (isGameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('游戏结束!', canvas.width / 3, canvas.height / 2);
    }
}

// 更新游戏状态
function update() {
    if (isGameOver || isPaused) return;

    // 移动蛇
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `得分: ${score}`;
        createFood();
    } else {
        snake.pop();
    }

    // 检查碰撞
    checkCollision();
}

// 检查碰撞
function checkCollision() {
    const head = snake[0];

    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
    }

    // 检查自身碰撞
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

// 游戏结束
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
}

// 开始游戏
function startGame() {
    if (!gameInterval && !isGameOver) {
        isPaused = false;
        gameInterval = setInterval(() => {
            update();
            draw();
        }, 100);
    }
}

// 暂停游戏
function pauseGame() {
    isPaused = !isPaused;
}

// 重置游戏
function resetGame() {
    clearInterval(gameInterval);
    gameInterval = null;
    initGame();
    draw();
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
        case 's':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
        case 'a':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
        case 'd':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

// 初始化游戏
initGame();
draw(); 