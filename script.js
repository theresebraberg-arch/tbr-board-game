let position = 0;
let isMoving = false;

const boardDiv = document.getElementById("board");
const dice = document.getElementById("dice");
const diceText = document.getElementById("diceText");
const popupContent = document.getElementById("popupContent");
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;

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

  for (let i = 0; i < 8; i++) {
    const temp = Math.floor(Math.random() * 6);
    dice.textContent = diceFaces[temp];
    await new Promise(resolve => setTimeout(resolve, 80));
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

function moveOneStep() {
  return new Promise(resolve => {
    setTimeout(() => {
      position++;
      if (position >= board.length) {
        position = 0;
      }
      renderBoard();
      resolve();
    }, 180);
  });
}

function handleSquare(square) {
  let text = square;

  if (square === "TBR jar") {
    const randomBook = tbrBooks[Math.floor(Math.random() * tbrBooks.length)];
    text = `📚 TBR Jar:\n${randomBook}`;
  }

  popupContent.textContent = text;
  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closePopup() {
  popup.classList.add("hidden");
  overlay.classList.add("hidden");
}

renderBoard();
