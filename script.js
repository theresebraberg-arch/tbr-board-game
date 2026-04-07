let position = 0;
let isMoving = false;

const boardDiv = document.getElementById("board");
const dice = document.getElementById("dice");
const diceResult = document.getElementById("diceResult");

const size = 5;

// 🧭 Snake path
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

// 🎨 Render
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

// 🎲 Roll dice
async function rollDice() {
  if (isMoving) return;

  isMoving = true;

  dice.classList.add("roll");

  // 🎲 slump-animation
  let tempRoll;
  for (let i = 0; i < 6; i++) {
    tempRoll = Math.floor(Math.random() * 6) + 1;
    dice.textContent = tempRoll;
    await new Promise(r => setTimeout(r, 100));
  }

  const roll = Math.floor(Math.random() * 6) + 1;

  dice.textContent = roll;
  diceResult.textContent = `Du slog: ${roll}`;

  await new Promise(r => setTimeout(r, 200));

  for (let i = 0; i < roll; i++) {
    await moveOneStep();
  }

  handleSquare(board[path[position]]);
  dice.classList.remove("roll");

  isMoving = false;
}

// 🚶 Movement
function moveOneStep() {
  return new Promise(resolve => {
    setTimeout(() => {
      position++;

      if (position >= path.length) {
        position = 0;
      }

      renderBoard();
      resolve();
    }, 300);
  });
}

// 🎯 Squares
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
