let position = 0;
let isMoving = false;

const boardDiv = document.getElementById("board");
const dice = document.getElementById("dice");
const diceText = document.getElementById("diceText");

// 🎲 riktiga tärningar
const diceFaces = ["⚀","⚁","⚂","⚃","⚄","⚅"];

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

async function rollDice() {
  if (isMoving) return;
  isMoving = true;

  dice.classList.add("roll");

  // 🎲 animation
  for (let i = 0; i < 10; i++) {
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

  dice.classList.remove("roll");
  isMoving = false;
}

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

function handleSquare(square) {
  let text = square;

  if (square === "TBR") {
    const randomBook = tbrBooks[Math.floor(Math.random() * tbrBooks.length)];
    text = "📚 " + randomBook;
  }

  document.getElementById("popupContent").innerText = text;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

renderBoard();
