let inputDir = {x: 0, y: 0};
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameOver.mp3');
const moveSound = new Audio('move.mp3');
let speed = 6;
let lastPaintTime = 0;
let score = 0;
let isPaused = true;
let snakeArr = [
    {x: 13, y: 15}
];
let food = {x: 6, y: 7};

const scoreBox = document.getElementById('scoreBox');
const hightScoreBox = document.getElementById('hightScoreBox');
const playArea = document.getElementById('playArea');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime)/1000 < 1/speed || isPaused){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function collision(snake){
    for(let i = 1; i < snake.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    if(snake[0].x >= 19 || snake[0].x <= 0 || snake[0].y >= 19 || snake[0].y <= 0){
        return true;
    }
    return false;
}

function gameEngine(){
    if(collision(snakeArr)){
        gameOverSound.play();
        inputDir = {x: 0, y: 0};
        isPaused = true;
        alert("Game Over! Click START to play again.");
        snakeArr = [{x: 13, y: 15}];
        score = 0;
        scoreBox.innerHTML = score;
        startBtn.innerHTML = "START GAME";
        return;
    }

    if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
        foodSound.play();
        score += 1;
        if(score > hightScoreVal){
            hightScoreVal = score;
            localStorage.setItem("highscore", JSON.stringify(hightScoreVal));
            hightScoreBox.innerHTML = hightScoreVal;
            saveHighScoreToServer(hightScoreVal);
        }
        scoreBox.innerHTML = score;

        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2, b = 17;
        food = {x: Math.round(a + (b-a)*Math.random()), y: Math.round(a + (b-a)*Math.random())};
    }

    for(let i = snakeArr.length - 2; i >= 0; i--){
        snakeArr[i+1] = {...snakeArr[i]};
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    playArea.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add('snake');
        if(index === 0) snakeElement.classList.add('head');
        playArea.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    playArea.appendChild(foodElement);
}

const BACKEND_URL = 'http://localhost:5000/api/highscore';

// High Score Logic
let hightScore = localStorage.getItem("highscore");
let hightScoreVal = 0;
if(hightScore !== null){
    hightScoreVal = JSON.parse(hightScore);
    hightScoreBox.innerHTML = hightScoreVal;
}

// Fetch High Score from Backend
async function fetchHighScore() {
    try {
        const response = await fetch(BACKEND_URL);
        if (response.ok) {
            const data = await response.json();
            if (data.highscore > hightScoreVal) {
                hightScoreVal = data.highscore;
                localStorage.setItem("highscore", JSON.stringify(hightScoreVal));
                hightScoreBox.innerHTML = hightScoreVal;
            }
        }
    } catch (error) {
        console.warn("Backend unavailable, using localStorage for highscore.");
    }
}

// Save High Score to Backend
async function saveHighScoreToServer(score) {
    try {
        await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ score })
        });
    } catch (error) {
        console.warn("Backend unavailable, could not sync highscore to server.");
    }
}

// Fetch high score on startup
fetchHighScore();

window.requestAnimationFrame(main);

// Controls
window.addEventListener('keydown', e => {
    if (isPaused && e.key.startsWith('Arrow')) return;
    
    if (inputDir.x === 0 && inputDir.y === 0 && e.key.startsWith('Arrow')) {
        inputDir = {x: 0, y: -1}; // Initial move up
    }
    
    switch(e.key){
        case 'ArrowUp':
            if(inputDir.y !== 1) { inputDir.x = 0; inputDir.y = -1; }
            break;
        case 'ArrowDown':
            if(inputDir.y !== -1) { inputDir.x = 0; inputDir.y = 1; }
            break;
        case 'ArrowLeft':
            if(inputDir.x !== 1) { inputDir.x = -1; inputDir.y = 0; }
            break;
        case 'ArrowRight':
            if(inputDir.x !== -1) { inputDir.x = 1; inputDir.y = 0; }
            break;
    }
});

// UI Buttons
startBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
        startBtn.innerHTML = "RESUME GAME";
    } else {
        startBtn.innerHTML = "PAUSE GAME";
        if (inputDir.x === 0 && inputDir.y === 0) inputDir = {x: 0, y: -1};
    }
});

stopBtn.addEventListener('click', () => {
    isPaused = true;
    inputDir = {x: 0, y: 0};
    snakeArr = [{x: 13, y: 15}];
    score = 0;
    scoreBox.innerHTML = score;
    startBtn.innerHTML = "START GAME";
    playArea.innerHTML = "";
    // Draw initial snake position
    let snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = 15;
    snakeElement.style.gridColumnStart = 13;
    snakeElement.classList.add('snake');
    snakeElement.classList.add('head');
    playArea.appendChild(snakeElement);
});


// Mobile Controls
document.getElementById("up").addEventListener("click", () => { if(!isPaused && inputDir.y !== 1) { inputDir.x = 0; inputDir.y = -1; } });
document.getElementById("down").addEventListener("click", () => { if(!isPaused && inputDir.y !== -1) { inputDir.x = 0; inputDir.y = 1; } });
document.getElementById("left").addEventListener("click", () => { if(!isPaused && inputDir.x !== 1) { inputDir.x = -1; inputDir.y = 0; } });
document.getElementById("right").addEventListener("click", () => { if(!isPaused && inputDir.x !== -1) { inputDir.x = 1; inputDir.y = 0; } });

