const gridSize = 10;
const gameContainer = document.getElementById("game");
const statusText = document.getElementById("status");

let grid = [];
let player = { x: 0, y: 0 };
let enemies = [
  { x: 9, y: 9 },
  { x: 8, y: 8 } // Added a second enemy
];
let stars = [];
let exit = null;
let score = 0;
let time = 0;
let gameOver = false;
let intervalId = null;

function createGrid() {
  grid = [];
  gameContainer.innerHTML = "";
  gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;

  for (let y = 0; y < gridSize; y++) {
    const row = [];
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      gameContainer.appendChild(cell);
      row.push({ x, y, type: "empty", el: cell });
    }
    grid.push(row);
  }

  generateWalls();
  placePlayer();
  placeEnemies(); // Updated to place multiple enemies
  placeStars(3);
  updateGrid();
}

function generateWalls() {
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if ((x === 0 && y === 0) || (x === 9 && y === 9) || (x === 8 && y === 8)) continue; // Avoid placing walls on player or enemies
    grid[y][x].type = "wall";
  }
}

function placePlayer() {
  player = { x: 0, y: 0 };
  grid[player.y][player.x].type = "player";
}

function placeEnemies() {
  enemies.forEach(enemy => {
    grid[enemy.y][enemy.x].type = "enemy";
  });
}

function placeStars(count) {
  stars = [];
  while (stars.length < count) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    const cell = grid[y][x];
    if (cell.type === "empty") {
      cell.type = "star";
      stars.push({ x, y });
    }
  }
}

function placeExit() {
  while (true) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if (grid[y][x].type === "empty") {
      grid[y][x].type = "exit";
      exit = { x, y };
      break;
    }
  }
}

function updateGrid() {
  for (let row of grid) {
    for (let cell of row) {
      const el = cell.el;
      el.className = "cell";
      el.classList.add(cell.type);
    }
  }

  statusText.textContent = `Waktu: ${time}s | Skor: ${score}`;
}

function movePlayer(dx, dy) {
  if (gameOver) return;

  const newX = player.x + dx;
  const newY = player.y + dy;

  if (
    newX >= 0 && newX < gridSize &&
    newY >= 0 && newY < gridSize &&
    grid[newY][newX].type !== "wall"
  ) {
    grid[player.y][player.x].type = "empty";
    player.x = newX;
    player.y = newY;

    if (grid[newY][newX].type === "star") {
      score++;
      if (score === stars.length) {
        placeExit();
      }
    }

    if (grid[newY][newX].type === "exit") {
      alert("Selamat! Kamu berhasil lolos!");
      clearInterval(intervalId);
      gameOver = true;
      return;
    }

    grid[newY][newX].type = "player";
    updateGrid();
  }
}

function bfs(start, goal) {
  const queue = [];
  const visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
  const cameFrom = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  queue.push(start);
  visited[start.y][start.x] = true;

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.x === goal.x && current.y === goal.y) break;

    const directions = [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    for (const [dx, dy] of directions) {
      const nx = current.x + dx;
      const ny = current.y + dy;

      if (
        nx >= 0 && nx < gridSize &&
        ny >= 0 && ny < gridSize &&
        !visited[ny][nx] &&
        grid[ny][nx].type !== "wall"
      ) {
        queue.push({ x: nx, y: ny });
        visited[ny][nx] = true;
        cameFrom[ny][nx] = current;
      }
    }
  }

  const path = [];
  let current = goal;

  while (current && !(current.x === start.x && current.y === start.y)) {
    path.unshift(current);
    current = cameFrom[current.y][current.x];
  }

  return path;
}

function moveEnemies() {
  enemies.forEach((enemy, index) => {
    const path = bfs(enemy, player);
    if (path.length > 0) {
      const next = path[0];
      grid[enemy.y][enemy.x].type = "empty";
      enemy.x = next.x;
      enemy.y = next.y;

      if (enemy.x === player.x && enemy.y === player.y) {
        grid[enemy.y][enemy.x].type = "enemy";
        updateGrid();
        alert(`Game Over! Kamu tertangkap setelah ${time}s.`);
        clearInterval(intervalId);
        gameOver = true;
        return;
      }

      grid[enemy.y][enemy.x].type = "enemy";
    }
  });
  updateGrid();
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp": movePlayer(0, -1); break;
    case "ArrowDown": movePlayer(0, 1); break;
    case "ArrowLeft": movePlayer(-1, 0); break;
    case "ArrowRight": movePlayer(1, 0); break;
  }
});

document.getElementById("restart").addEventListener("click", () => {
  location.reload();
});

function startGame() {
  createGrid();
  intervalId = setInterval(() => {
    if (!gameOver) {
      moveEnemies(); // Updated to move multiple enemies
      time++;
      updateGrid();
    }
  }, 1000);
}

startGame();
const gridSize = 10;
const gameContainer = document.getElementById("game");
const statusText = document.getElementById("status");

let grid = [];
let player = { x: 0, y: 0 };
let enemies = [
  { x: 9, y: 9 },
  { x: 8, y: 8 } // Added a second enemy
];
let stars = [];
let exit = null;
let score = 0;
let time = 0;
let gameOver = false;
let intervalId = null;

function createGrid() {
  grid = [];
  gameContainer.innerHTML = "";
  gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;

  for (let y = 0; y < gridSize; y++) {
    const row = [];
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      gameContainer.appendChild(cell);
      row.push({ x, y, type: "empty", el: cell });
    }
    grid.push(row);
  }

  generateWalls();
  placePlayer();
  placeEnemies(); // Updated to place multiple enemies
  placeStars(3);
  updateGrid();
}

function generateWalls() {
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if ((x === 0 && y === 0) || (x === 9 && y === 9) || (x === 8 && y === 8)) continue; // Avoid placing walls on player or enemies
    grid[y][x].type = "wall";
  }
}

function placePlayer() {
  player = { x: 0, y: 0 };
  grid[player.y][player.x].type = "player";
}

function placeEnemies() {
  enemies.forEach(enemy => {
    grid[enemy.y][enemy.x].type = "enemy";
  });
}

function placeStars(count) {
  stars = [];
  while (stars.length < count) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    const cell = grid[y][x];
    if (cell.type === "empty") {
      cell.type = "star";
      stars.push({ x, y });
    }
  }
}

function placeExit() {
  while (true) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if (grid[y][x].type === "empty") {
      grid[y][x].type = "exit";
      exit = { x, y };
      break;
    }
  }
}

function updateGrid() {
  for (let row of grid) {
    for (let cell of row) {
      const el = cell.el;
      el.className = "cell";
      el.classList.add(cell.type);
    }
  }

  statusText.textContent = `Waktu: ${time}s | Skor: ${score}`;
}

function movePlayer(dx, dy) {
  if (gameOver) return;

  const newX = player.x + dx;
  const newY = player.y + dy;

  if (
    newX >= 0 && newX < gridSize &&
    newY >= 0 && newY < gridSize &&
    grid[newY][newX].type !== "wall"
  ) {
    grid[player.y][player.x].type = "empty";
    player.x = newX;
    player.y = newY;

    if (grid[newY][newX].type === "star") {
      score++;
      if (score === stars.length) {
        placeExit();
      }
    }

    if (grid[newY][newX].type === "exit") {
      alert("Selamat! Kamu berhasil lolos!");
      clearInterval(intervalId);
      gameOver = true;
      return;
    }

    grid[newY][newX].type = "player";
    updateGrid();
  }
}

function bfs(start, goal) {
  const queue = [];
  const visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
  const cameFrom = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  queue.push(start);
  visited[start.y][start.x] = true;

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.x === goal.x && current.y === goal.y) break;

    const directions = [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    for (const [dx, dy] of directions) {
      const nx = current.x + dx;
      const ny = current.y + dy;

      if (
        nx >= 0 && nx < gridSize &&
        ny >= 0 && ny < gridSize &&
        !visited[ny][nx] &&
        grid[ny][nx].type !== "wall"
      ) {
        queue.push({ x: nx, y: ny });
        visited[ny][nx] = true;
        cameFrom[ny][nx] = current;
      }
    }
  }

  const path = [];
  let current = goal;

  while (current && !(current.x === start.x && current.y === start.y)) {
    path.unshift(current);
    current = cameFrom[current.y][current.x];
  }

  return path;
}

function moveEnemies() {
  enemies.forEach((enemy, index) => {
    const path = bfs(enemy, player);
    if (path.length > 0) {
      const next = path[0];
      grid[enemy.y][enemy.x].type = "empty";
      enemy.x = next.x;
      enemy.y = next.y;

      if (enemy.x === player.x && enemy.y === player.y) {
        grid[enemy.y][enemy.x].type = "enemy";
        updateGrid();
        alert(`Game Over! Kamu tertangkap setelah ${time}s.`);
        clearInterval(intervalId);
        gameOver = true;
        return;
      }

      grid[enemy.y][enemy.x].type = "enemy";
    }
  });
  updateGrid();
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp": movePlayer(0, -1); break;
    case "ArrowDown": movePlayer(0, 1); break;
    case "ArrowLeft": movePlayer(-1, 0); break;
    case "ArrowRight": movePlayer(1, 0); break;
  }
});

document.getElementById("restart").addEventListener("click", () => {
  location.reload();
});

function startGame() {
  createGrid();
  intervalId = setInterval(() => {
    if (!gameOver) {
      moveEnemies(); // Updated to move multiple enemies
      time++;
      updateGrid();
    }
  }, 1000);
}

startGame();
