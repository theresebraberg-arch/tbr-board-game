let position = localStorage.getItem("tbr_position")
  ? parseInt(localStorage.getItem("tbr_position"), 10)
  : 0;

let isMoving = false;

const savedBoard = localStorage.getItem("tbr_board");
let gameBoard;

if (savedBoard) {
  gameBoard = JSON.parse(savedBoard);
} else {
  gameBoard = [...board];
  shuffle(gameBoard);
  localStorage.setItem("tbr_board", JSON.stringify(gameBoard));
}

const books = [...tbrBooks];

const boardDiv = document.getElementById("board");
const diceText = document.getElementById("diceText");
const jarModal = document.getElementById("jarModal");
const jarBook = document.getElementById("jarBook");

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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

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

async function rollDice() {
 if (isMoving) return;
 isMoving = true;

 const dice1 = Math.floor(Math.random() * 6) + 1;
 const dice2 = Math.floor(Math.random() * 6) + 1;
 const total = dice1 + dice2;

 // 🎲 visuella tärningar
 renderDice(document.getElementById("dice1"), dice1);
 renderDice(document.getElementById("dice2"), dice2);
  
diceText.innerHTML = `
  <span class="dice-total">Du slog ${total}</span>
`;

 for (let i = 0; i < total; i += 1) {
  await moveOneStep();
 }

 await handleSquare();

 isMoving = false;
}

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
    }, 300);
  });
}

function renderDice(diceElement, value) {
 diceElement.innerHTML = "";

 const positions = {
  1: [[2,2]],
  2: [[1,1],[3,3]],
  3: [[1,1],[2,2],[3,3]],
  4: [[1,1],[1,3],[3,1],[3,3]],
  5: [[1,1],[1,3],[2,2],[3,1],[3,3]],
  6: [[1,1],[1,2],[1,3],[3,1],[3,2],[3,3]]
 };

 positions[value].forEach(([row, col]) => {
  const dot = document.createElement("div");
  dot.className = "dot";
  dot.style.gridRow = row;
  dot.style.gridColumn = col;
  diceElement.appendChild(dot);
 });
}
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
}

function drawFromJar() {
  const currentSquare = gameBoard[position];

  if (!currentSquare.toLowerCase().includes("tbr jar")) {
    alert("Du måste landa på TBR jar först 😊");
    return;
  }

  const book = books[Math.floor(Math.random() * books.length)];

  // Visa modal
  jarModal.classList.remove("hidden");

  // Visa text
  jarBook.classList.remove("hidden");

  // Reset animation
  jarBook.classList.remove("show");
  jarBook.textContent = "✨ Drar din bok...";

  // Reveal
  setTimeout(() => {
    jarBook.textContent = book;
    jarBook.classList.add("show");
  }, 400);
}

function closeJar() {
  jarModal.classList.add("hidden");
}

function resetGame() {
  position = 0;
  localStorage.removeItem("tbr_position");
  localStorage.removeItem("tbr_board");
  localStorage.removeItem("tbr_colors");
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  closeJar();
  renderBoard();
});
