let board = document.querySelector(".board");

let scoreDisplay = document.querySelector("#score");

let lowButton = document.querySelector("#low");
let mediumButton = document.querySelector("#medium");
let highButton = document.querySelector("#high");

let resetButton = document.querySelector("#reset");


// ---------------- SOUND ----------------

let foodSound = new Audio("food.mp3");
let gameOverSound = new Audio("gameover.mp3");

foodSound.volume = 0.5;
gameOverSound.volume = 0.6;


// ---------------- GAME VARIABLES ----------------

let FoodX;
let FoodY;

let snakeBody = [];

let SnakeX = 12;
let SnakeY = 4;

let veloCityX = 0;
let veloCityY = 0;

let gameOver = false;

let setInterId;

let score = 0;

let speed = 250;


// ---------------- FOOD POSITION ----------------

function randomFoodPostion() {

    let foodOnSnake = true;

    while (foodOnSnake) {

        FoodX = Math.floor(Math.random() * 14) + 1;
        FoodY = Math.floor(Math.random() * 14) + 1;

        foodOnSnake = false;

        for (let i = 0; i < snakeBody.length; i++) {

            if (
                snakeBody[i][0] === FoodX &&
                snakeBody[i][1] === FoodY
            ) {
                foodOnSnake = true;
                break;
            }
        }
    }
}


// ---------------- SNAKE CONTROL ----------------

function moveSnake(e) {

    if (gameOver) {
        return;
    }

    if (
        e.key === "ArrowUp" &&
        veloCityY != 1
    ) {

        veloCityX = 0;
        veloCityY = -1;
    }

    else if (
        e.key === "ArrowDown" &&
        veloCityY != -1
    ) {

        veloCityX = 0;
        veloCityY = 1;
    }

    else if (
        e.key === "ArrowLeft" &&
        veloCityX != 1
    ) {

        veloCityX = -1;
        veloCityY = 0;
    }

    else if (
        e.key === "ArrowRight" &&
        veloCityX != -1
    ) {

        veloCityX = 1;
        veloCityY = 0;
    }
}


// ---------------- GAME OVER ----------------

function showGameOver() {

    clearInterval(setInterId);

    document.removeEventListener(
        "keydown",
        moveSnake
    );


    // Game Over Sound

    gameOverSound.currentTime = 0;
    gameOverSound.play();


    board.innerHTML += `
        <div class="game-over">
            GAME OVER
        </div>
    `;
}


// ---------------- MAIN GAME ----------------

function main() {

    if (gameOver) {
        return;
    }


    // Move Snake

    SnakeX += veloCityX;
    SnakeY += veloCityY;


    // Wall Collision

    if (
        SnakeX <= 0 ||
        SnakeX > 14 ||
        SnakeY <= 0 ||
        SnakeY > 14
    ) {

        gameOver = true;

        showGameOver();

        return;
    }


    // Move Body

    for (
        let i = snakeBody.length - 1;
        i > 0;
        i--
    ) {

        snakeBody[i] = snakeBody[i - 1];
    }


    // Head

    snakeBody[0] = [SnakeX, SnakeY];


    // Body Collision

    for (
        let i = 1;
        i < snakeBody.length;
        i++
    ) {

        if (
            snakeBody[0][0] === snakeBody[i][0] &&
            snakeBody[0][1] === snakeBody[i][1]
        ) {

            gameOver = true;

            showGameOver();

            return;
        }
    }


    // ---------------- FOOD ----------------

    if (
        SnakeX === FoodX &&
        SnakeY === FoodY
    ) {

        // Score +10

        score += 10;

        scoreDisplay.textContent = score;


        // FOOD SOUND 🔊

        foodSound.currentTime = 0;
        foodSound.play();


        // Snake Grow

        snakeBody.push([
            snakeBody[snakeBody.length - 1][0],
            snakeBody[snakeBody.length - 1][1]
        ]);


        // New Food

        randomFoodPostion();
    }


    // ---------------- DRAW ----------------

    let setHtml = `
        <div
            class="food"
            style="grid-area: ${FoodY}/${FoodX};">
        </div>
    `;


    // Draw Snake

    for (
        let i = 0;
        i < snakeBody.length;
        i++
    ) {

        if (i === 0) {

            setHtml += `
                <div
                    class="snake-head"
                    id="div0"
                    style="
                        grid-area:
                        ${snakeBody[i][1]}/${snakeBody[i][0]};
                    ">
                </div>
            `;
        }

        else {

            setHtml += `
                <div
                    class="snake-body"
                    style="
                        grid-area:
                        ${snakeBody[i][1]}/${snakeBody[i][0]};
                    ">
                </div>
            `;
        }
    }


    board.innerHTML = setHtml;
}


// ---------------- START GAME ----------------

function startGame() {

    clearInterval(setInterId);

    setInterId = setInterval(
        main,
        speed
    );
}


// ---------------- LOW ----------------

lowButton.addEventListener(
    "click",
    function () {

        speed = 300;

        startGame();
    }
);


// ---------------- MEDIUM ----------------

mediumButton.addEventListener(
    "click",
    function () {

        speed = 150;

        startGame();
    }
);


// ---------------- HIGH ----------------

highButton.addEventListener(
    "click",
    function () {

        speed = 70;

        startGame();
    }
);


// ---------------- RESET ----------------

resetButton.addEventListener(
    "click",
    function () {

        clearInterval(setInterId);


        SnakeX = 12;
        SnakeY = 4;


        veloCityX = 0;
        veloCityY = 0;


        snakeBody = [];


        score = 0;

        scoreDisplay.textContent = score;


        gameOver = false;


        randomFoodPostion();


        document.addEventListener(
            "keydown",
            moveSnake
        );


        main();

        startGame();
    }
);


// ---------------- START ----------------

randomFoodPostion();

main();

startGame();

document.addEventListener(
    "keydown",
    moveSnake
);