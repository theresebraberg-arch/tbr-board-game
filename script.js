let position = 0;
let isMoving = false;

const boardDiv = document.getElementById("board");

function renderBoard() {
  boardDiv.innerHTML = "";

  const size = 5;

  for (let row = 0; row < size; row++) {
    let rowCells = [];

    for (let col = 0; col < size; col++) {
      let index = row * size + col;

      // 🔁 varannan rad baklänges
      if (row % 2 === 1) {
        index = row * size + (size - 1 - col);
      }

      rowCells.push({ cell: board[index], index });
    }

    rowCells.forEach(({ cell, index }) => {
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
}

async function rollDice() {
  if (isMoving) return;

  isMoving = true;

  const roll = Math.floor(Math.random() * 6) + 1;

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

      if (position >= board.length) {
        position = 0;
      }

      renderBoard();
      resolve();
    }, 300); // ← hastighet (kan ändras!)
  });
}

function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  position += roll;

  if (position >= board.length) {
    position = position % board.length;
  }

  handleSquare(board[position]);
  renderBoard();
}

function handleSquare(square) {
  let text = square;

  if (square === "TBR") {
    const randomBook = tbrBooks[Math.floor(Math.random() * tbrBooks.length)];
    text = "📚 TBR Jar:\n" + randomBook;
  }

  if (square === "Back 1") position -= 1;
  if (square === "Back 3") position -= 3;
  if (square === "Forward 2") position += 2;
  if (square === "Forward 3") position += 3;

  document.getElementById("popupContent").innerText = text;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
  renderBoard();
}

renderBoard();
