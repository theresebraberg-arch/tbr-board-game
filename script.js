let position = localStorage.getItem("tbr_position")
  ? parseInt(localStorage.getItem("tbr_position"), 10)
  : 0;

let isMoving = false;
let canUseJar = false;

/* 📦 HÄMTA / SKAPA BOARD */
const savedBoard = localStorage.getItem("tbr_board");
let gameBoard;

if (savedBoard) {
  gameBoard = JSON.parse(savedBoard);
} else {
  gameBoard = [...board];
  shuffle(gameBoard);
  localStorage.setItem("tbr_board", JSON.stringify(gameBoard));
}

/* 📚 BOOKS */
const books = [...tbrBooks];

const boardDiv = document.getElementById("board");
const diceText = document.getElementById("diceText");

/* 🎨 COLORS */
const colors = [
  "#fbcfe8",
  "#bfdbfe",
  "#fde68a",
  "#bbf7d0",
  "#ddd6fe",
  "#fecaca",
  "#fdba74",
  "#a7f3d0"
];

/* 🎨 SPARA FÄRGER */
const savedColors = localStorage.getItem("tbr_colors");
let cellColors;

if (savedColors) {
  cellColors = JSON.parse(savedColors);
} else {
  cellColors = gameBoard.map(
    () => colors[Math.floor(Math.random() * colors.length)]
  );
  localStorage.setItem("tbr_colors", JSON.stringify(cellColors));
}

/* 🔀 SHUFFLE */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* 🎲 RENDER */
function renderBoard() {
  boardDiv.innerHTML = "";

  gameBoard.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;
    div.style.background = cellColors[index];

    if (index === position) {
      div.classList.add("active");

      const player = document.createElement("div");
      player.className = "player";
      player.textContent = "📖";
      div.appendChild(player);
    }

    boardDiv.appendChild(div);
  });
}

/* 🎲 DICE */
async function rollDice() {
  if (isMoving) return;

  isMoving = true;
  canUseJar = false;

  const roll = Math.floor(Math.random() * 6) + 1;
  diceText.textContent = `🎲 Du slog: ${roll}`;

  for (let i = 0; i < roll; i += 1) {
    await moveOneStep();
  }

  await handleSquare();

  isMoving = false;
}

/* MOVE */
function moveOneStep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      position += 1;

      if (position >= gameBoard.length) {
        position = 0;
      }

      localStorage.setItem("tbr_position", position);
      renderBoard();
      resolve();
    }, 120);
  });
}

/* 🧠 LOGIK */
async function handleSquare() {
  let square = gameBoard[position];

  if (square === "Back 1") position -= 1;
  if (square === "Back 3") position -= 3;
  if (square === "Forward 2") position += 2;
  if (square === "Forward 3") position += 3;

  if (position < 0) position = 0;
  if (position >= gameBoard.length) position = gameBoard.length - 1;

  localStorage.setItem("tbr_position", position);
  renderBoard();

  square = gameBoard[position];

  if (square === "TBR jar") {
    canUseJar = true;
  }
}

/* 🫙 JAR */
function drawFromJar() {
  if (!canUseJar) {
    return;
  }

  const book = books[Math.floor(Math.random() * books.length)];
  diceText.textContent = `📚 ${book}`;
  canUseJar = false;
}

/* 🔄 RESET */
function resetGame() {
  position = 0;
  localStorage.removeItem("tbr_position");
  localStorage.removeItem("tbr_board");
  localStorage.removeItem("tbr_colors");
  location.reload();
}

/* START */
renderBoard();
