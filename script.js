const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const score = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const dialog = document.getElementById("gameOverDialog");
const restart = document.getElementById("restartGame");
const bgMusic = document.getElementById("bgMusic");
const soundWrapper = document.getElementById("soundIconWrapper");
const soundOff = document.getElementById("soundOff");
let play = false;

// Background sound effect
soundWrapper.addEventListener("click", () => {
  if (play === false) {
    bgMusic.volume = 0.3;
    bgMusic.play();
    soundOff.style = "display:none;";
    play = true;
  } else {
    play = false;
    bgMusic.pause();
    soundOff.style = "display:inline;";
  }
});

let lastDirection = "right"; // Snake default direction.
let intervalID; // Global interval for reset

let cellSize = 20; // Grid, snake and food size.
let dx = cellSize; // Snake move;
let dy = 0; // Snake move;

let x = 240; // Start position of the Snake.
let y = 240; // Start position of the Snake.
let snakeTrail = [{ x, y }]; // Body position.
let gameSpeed = 150; // Game speed/Snake speed.

let yourScore = Number(score.textContent);
let collision = false;

let foodX = undefined; // Food coordinates.
let foodY = undefined; // Food coordinates.

// Just random generation of food.
const foodPositionGeneration = () => {
do {
  collision = false;
  foodX = Math.floor(Math.random() * 25) * cellSize;
  foodY = Math.floor(Math.random() * 25) * cellSize;

  for (let i = 0; i < snakeTrail.length; i++) {
    if (foodX === snakeTrail[i].x && foodY === snakeTrail[i].y) {
      collision = true;
      break;
    };
  };
} while (collision);
};

// Change score/speed. Draw food.
const whenAteFood = () => {
  ctx.fillStyle = "red";
  ctx.fillRect(foodX, foodY, cellSize, cellSize);

  if (x === foodX && y === foodY) {
    foodPositionGeneration();

    // Change game speed (difficulty)
    gameSpeed -= 2;
    clearInterval(intervalID);
    startGameLoop();

    // Change score
    yourScore += 1;
    score.textContent = yourScore;
  } else snakeTrail.pop();
};

// When press button the snake moves.
const snakeMoves = () => {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
      case "ArrowUp":
        if (lastDirection != "down") {
          dy = -cellSize;
          dx = 0;
          lastDirection = "up";
        }
        break;
      case "a":
      case "ArrowLeft":
        if (lastDirection != "right") {
          dy = 0;
          dx = -cellSize;
          lastDirection = "left";
        }
        break;
      case "s":
      case "ArrowDown":
        if (lastDirection != "up") {
          dy = cellSize;
          dx = 0;
          lastDirection = "down";
        }
        break;
      case "d":
      case "ArrowRight":
        if (lastDirection != "left") {
          dy = 0;
          dx = cellSize;
          lastDirection = "right";
        }
        break;
    }
  });
};

// Just background.
const backgroundGrid = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let gridX = 0;

  while (gridX < canvas.width) {
    let gridY = 0;

    while (gridY < canvas.height) {
      ctx.strokeStyle = "transparent"; // If you want to show grid just delete the name "transaprent"
      ctx.lineWidth = "1";
      ctx.strokeRect(gridX, gridY, cellSize, cellSize);

      gridY += cellSize;
    }

    gridX += cellSize;
  }
};

// Teleport when touch end of the area.
const endOfArea = () => {
  if (x >= canvas.width) x = 0;
  if (x < 0) x = canvas.width - cellSize;
  if (y >= canvas.height) y = 0;
  if (y < 0) y = canvas.height - cellSize;
};

// Snake head.
const snakeDraw = () => {
  x += dx;
  y += dy;
  endOfArea();
  snakeTrail.unshift({ x, y });
};

// Body collision. (end game)
const bodyCollision = () => {
  for (let i = 1; i < snakeTrail.length; i++) {
    if (
      snakeTrail[0].x === snakeTrail[i].x &&
      snakeTrail[0].y === snakeTrail[i].y
    ) {
      clearInterval(intervalID);
      finalScore.textContent = score.textContent;
      dialog.showModal();
    }
  }
};

// Game restart.
const restartGame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gameSpeed = 150;
  score.textContent = yourScore = 0;
  clearInterval(intervalID);

  snakeTrail = [{ x, y }];
  x = 240;
  y = 240;
  startGameLoop();
};

restart.addEventListener("click", () => {
  dialog.close();
  restartGame();
});
// **********************

const startGameLoop = () => {
  intervalID = setInterval(() => {
    backgroundGrid();
    snakeDraw();
    whenAteFood(intervalID);

    // Snake body coordinates
    ctx.fillStyle = "lime";
    snakeTrail.forEach((segment) => {
      ctx.fillRect(segment.x, segment.y, cellSize, cellSize);
    });

    bodyCollision(intervalID);
  }, gameSpeed);
};

startGameLoop();
foodPositionGeneration();
snakeMoves();