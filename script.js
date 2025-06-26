const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let lastDirection = "right"; // Snake default direction.

let cellSize = 20; // Grid, snake and food size.
let dx = cellSize; // Snake move;
let dy = 0; // Snake move;

let x = 0; // Start position of the Snake.
let y = 0; // Start position of the Snake.
let snakeTrail = [{ x, y }]; // Body position.
let gameSpeed = 150; // Game speed/Snake speed.

let foodX = undefined; // Food coordinates.
let foodY = undefined; // Food coordinates.

  // Just generation of food.
const foodPositionGeneration = () => {
  foodX = Math.floor(Math.random() * 25) * cellSize;
  foodY = Math.floor(Math.random() * 25) * cellSize;
};

  // Random spot of food.
const foodDraw = () => {
  ctx.fillStyle = "red";
  ctx.fillRect(foodX, foodY, cellSize, cellSize);

  if (x === foodX && y === foodY) foodPositionGeneration();
  else snakeTrail.pop();
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
  let gridX = 0;

  while (gridX < canvas.width) {
    let gridY = 0;

    while (gridY < canvas.height) {
      ctx.strokeStyle = "lightgrey";
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

  // Snake moves.
const snakeDraw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  x += dx;
  y += dy;
  snakeTrail.unshift({ x, y });
};

setInterval(() => {
  snakeDraw();
  backgroundGrid();
  foodDraw();
  endOfArea();

  ctx.fillStyle = "lime";
  snakeTrail.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, cellSize, cellSize);
  });

}, gameSpeed);

foodPositionGeneration();
snakeMoves();
