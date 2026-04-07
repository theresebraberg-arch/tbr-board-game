let position = 0;
let isMoving = false;
let canUseJar = false;

/* 🧠 BOARD */
let board = [
  "Free pick","Romance","TBR jar","Fantasy","Back 1","Enemies to lovers",
  "Forward 2","Thriller","Color","Fantasy","Back 3",
  "Sports romance","TBR","5 star prediction","Forward 3","Stand alone",
  "TBR jar","Grumpy sunshine","Spinner","Under 300 pages","500+ pages",
  "New author","Series","Cozy read","TBR","Free pick"
];

/* 📚 BOOKS */
const tbrBooks = [
  "Fourth Wing",
  "Iron Flame",
  "Powerless",
  "Reckless",
  "The Housemaid",
  "Twisted Love",
  "Things We Never Got Over",
  "ACOTAR",
  "The Silent Patient",
  "Icebreaker"
];

const boardDiv = document.getElementById("board");
const diceText = document.getElementById("diceText");
const resultText = document.getElementById("resultText");

/* 🎨 COLORS */
const colors = [
  "#fbcfe8","#bfdbfe","#fde68a","#bbf7d0",
  "#ddd6fe","#fecaca","#fdba74","#a7f3d0"
];

const cellColors = board.map(() =>
  colors[Math.floor(Math.random() * colors.length)]
);

/* 🎲 RENDER */
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
      if (position >= board.length) position = 0;
      renderBoard();
      resolve();
    }, 120);
  });
}

/* 🧠 LOGIK */
async function handleSquare() {
  let square = board[position];

  if (square === "Back 1") position -= 1;
  if (square === "Back 3") position -= 3;
  if (square === "Forward 2") position += 2;
  if (square === "Forward 3") position += 3;

  if (position < 0) position = 0;
  if (position >= board.length) position = board.length - 1;

  renderBoard();

  square = board[position];

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

  const book = tbrBooks[Math.floor(Math.random() * tbrBooks.length)];
  resultText.textContent = `📚 ${book}`;
  canUseJar = false;
}

renderBoard();
