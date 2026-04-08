let position = 0;
let isMoving = false;
let canUseJar = false;

/* 👉 ANVÄNDER data.js */
let gameBoard = [...board];   // kopia av board
let books = [...tbrBooks];

const boardDiv = document.getElementById("board");
const diceText = document.getElementById("diceText");
const resultText = document.getElementById("resultText");

/* 🎨 COLORS */
const colors = [
  "#fbcfe8","#bfdbfe","#fde68a","#bbf7d0",
  "#ddd6fe","#fecaca","#fdba74","#a7f3d0"
];

/* 🔀 SHUFFLE */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* 👉 shuffle EN gång */
shuffle(gameBoard);

/* 🎨 färger sparas */
const cellColors = gameBoard.map(() =>
  colors[Math.floor(Math.random() * colors.length)]
);

/* 🎲 RENDER */
function renderBoard() {
  boardDiv.innerHTML = "";

  gameBoard.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;

    div.style.background = cellColors[index];

    if (index === position) {
      div.style.boxShadow = "0 0 0 4px #9333ea";

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

  let roll = Math.floor(Math.random() * 6) + 1;
  diceText.textContent = `🎲 Du slog: ${roll}`;
  resultText.textContent = "";

  for (let i = 0; i < roll; i++) {
    await moveOneStep();
  }

  await handleSquare();

  isMoving = false;
}

function moveOneStep() {
  return new Promise(resolve => {
    setTimeout(() => {
      position++;
      if (position >= gameBoard.length) position = 0;
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

  renderBoard();

  square = gameBoard[position];

  if (square === "TBR jar") {
    resultText.textContent = "🫙 Klicka på burken!";
    canUseJar = true;
  } else {
    resultText.textContent = `📍 ${square}`;
  }
}

/* 🫙 JAR */
function drawFromJar() {
  if (!canUseJar) {
    resultText.textContent = "❌ Du måste landa på TBR jar först!";
    return;
  }

  const book = books[Math.floor(Math.random() * books.length)];
  resultText.textContent = `📚 ${book}`;
  canUseJar = false;
}

renderBoard();
