let position = 0;
let isMoving = false;

const boardDiv = document.getElementById("board");
const dice = document.getElementById("dice");
const diceText = document.getElementById("diceText");

const size = 5;

// 🧭 snake path
function createPath() {
  let path = [];

  for (let row = 0; row < size; row++) {
    let rowArray = [];

    for (let col = 0; col < size; col++) {
      rowArray.push(row * size + col);
    }

    if (row % 2 === 1) {
      rowArray.reverse();
    }

    path.push(...rowArray);
  }

  return path;
}

const path = createPath();

// 🎨 render
function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";

    if (path[position] === index) {
      div.innerHTML = "📖";
      div.classList.add("active");
    } else {
      div.textContent = cell;
    }

    boardDiv.appendChild(div);
  });
}

// 🎲 roll
async function rollDice() {
  if (isMoving) return;

  isMoving = true;

  // fake rolling
  for (let i = 0; i < 8; i++) {
    let temp = Math.floor(Math.random() * 6) + 1;
    dice.textContent = temp;
    await new Promise(r => setTimeout(r, 80));
  }

  const roll = Math.floor(Math.random() * 6) + 1;

  dice.textContent = roll;
  diceText.textContent = `Du slog: ${roll}`;

  for (let i = 0; i < roll; i++) {
    await moveOneStep();
  }

  handleSquare(board[path[position]]);

  isMoving = false;
}

// 🚶 move
function moveOneStep() {
  return new Promise(resolve => {
    setTimeout(() => {
      position++;

      if (position >= path.length) {
        position = 0;
      }

      renderBoard();
      resolve();
    }, 250);
  });
}

// 🎯 square
function handleSquare(square) {
  let text = square;

  if (square === "TBR") {
    const randomBook = tbrBooks[Math.floor(Math.random() * tbrBooks.length)];
    text = "📚 TBR Jar:\n" + randomBook;
  }

  if (square === "Back 1") position = Math.max(0, position - 1);
  if (square === "Back 3") position = Math.max(0, position - 3);
  if (square === "Forward 2") position = (position + 2) % path.length;
  if (square === "Forward 3") position = (position + 3) % path.length;

  document.getElementById("popupContent").innerText = text;
  document.getElementById("popup").classList.remove("hidden");

  renderBoard();
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

// start
renderBoard();
