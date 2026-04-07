let position = 0;
let isMoving = false;

const boardDiv = document.getElementById("board");
const dice = document.getElementById("dice");
const diceText = document.getElementById("diceText");

const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
const popupContent = document.getElementById("popupContent");

// 🎲 dice faces
const diceFaces = ["⚀","⚁","⚂","⚃","⚄","⚅"];

// 🎨 render board
function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";

    if (index === position) {
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

  // animation
  for (let i = 0; i < 8; i++) {
    let temp = Math.floor(Math.random() * 6);
    dice.textContent = diceFaces[temp];
    await new Promise(r => setTimeout(r, 80));
  }

  const roll = Math.floor(Math.random() * 6);
  dice.textContent = diceFaces[roll];
  diceText.textContent = `Du slog: ${roll + 1}`;

  for (let i = 0; i < roll + 1; i++) {
    await moveOneStep();
  }

  handleSquare(board[position]);

  isMoving = false;
}

// 🚶 move
function moveOneStep() {
  return new Promise(resolve => {
    setTimeout(() => {
      position++;
      if (position >= board.length) position = 0;
      renderBoard();
      resolve();
    }, 250);
  });
}

// 🎯 square handler
function handleSquare(square) {
  let text = square;

  if (square === "TBR") {
    const randomBook = tbrBooks[Math.floor(Math.random() * tbrBooks.length)];
    text = "📚 " + randomBook;
  }

  popupContent.textContent = text;

  overlay.classList.remove("hidden");
  popup.classList.remove("hidden");

  setTimeout(() => {
    popup.classList.add("show");
  }, 10);
}

// ❌ close popup
function closePopup() {
  popup.classList.remove("show");

  setTimeout(() => {
    popup.classList.add("hidden");
    overlay.classList.add("hidden");
  }, 200);
}

// start
renderBoard();
