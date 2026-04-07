let position = 0;
let isMoving = false;
let canUseJar = false;

const boardDiv = document.getElementById("board");
const diceText = document.getElementById("diceText");
const resultText = document.getElementById("resultText");

/* 📚 TBR BOOKS */
const tbrBooks = [
  "Fourth Wing",
  "Iron Flame",
  "Powerless",
  "Reckless",
  "The Housemaid",
  "Twisted Love",
  "Things We Never Got Over",
  "A Court of Thorns and Roses",
  "The Silent Patient",
  "Icebreaker"
];

/* COLORS */
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

/* BOARD */
shuffle(board);

const cellColors = board.map(() =>
  colors[Math.floor(Math.random() * colors.length)]
);

function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, index) => {
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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

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
      if (position >= board.length) position = 0;
      renderBoard();
      resolve();
    }, 120);
  });
}

async function handleSquare() {
  let square = board[position];

  if (square === "TBR jar") {
    resultText.textContent = "🫙 Klicka på burken!";
    canUseJar = true;
  } else {
    resultText.textContent = `📍 ${square}`;
  }
}

/* 🫙 DRAW FROM JAR */
function drawFromJar() {
  if (!canUseJar) {
    resultText.textContent = "❌ Du måste landa på TBR jar först!";
    return;
  }

  const book = tbrBooks[Math.floor(Math.random() * tbrBooks.length)];

  resultText.textContent = `📚 Du fick: ${book}`;
  canUseJar = false;
}

renderBoard();
