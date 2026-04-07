let position = 0;
let isMoving = false;

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

const boardDiv = document.getElementById("board");
const dice = document.getElementById("dice");
const diceText = document.getElementById("diceText");
const popupContent = document.getElementById("popupContent");
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");

function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;

    // RANDOM färg
    div.style.background = colors[Math.floor(Math.random() * colors.length)];

    if (index === position) {
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

  const roll = Math.floor(Math.random() * 6) + 1;

  dice.textContent = "🎲";
  diceText.textContent = `Du slog: ${roll}`;

  for (let i = 0; i < roll; i++) {
    await moveOneStep();
  }

  handleSquare(board[position]);
  isMoving = false;
}

function moveOneStep() {
  return new Promise(resolve => {
    setTimeout(() => {
      position++;
      if (position >= board.length) position = 0;
      renderBoard();
      resolve();
    }, 150);
  });
}

function handleSquare(square) {

  if (square === "Back 1") position -= 1;
  if (square === "Back 3") position -= 3;
  if (square === "Forward 2") position += 2;
  if (square === "Forward 3") position += 3;

  if (position < 0) position = 0;
  if (position >= board.length) position = board.length - 1;

  let text = square;

  if (square === "TBR jar") {
    const randomBook = tbrBooks[Math.floor(Math.random() * tbrBooks.length)];
    text = `📚 ${randomBook}`;
  }

  renderBoard();

  popupContent.textContent = text;
  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closePopup() {
  popup.classList.add("hidden");
  overlay.classList.add("hidden");
}

renderBoard();
