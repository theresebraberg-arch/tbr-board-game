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
const diceText = document.getElementById("diceText");

/* SHUFFLE */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(board);

/* SPARA FÄRGER */
const cellColors = board.map(() => {
  return colors[Math.floor(Math.random() * colors.length)];
});

function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;

    div.style.background = cellColors[index];

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

  let roll = Math.floor(Math.random() * 6) + 1;

  /* 👇 VISAR BARA SLAGET */
  diceText.textContent = `🎲 Du slog: ${roll}`;

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

  while (true) {

    if (square === "Back 1") position -= 1;
    else if (square === "Back 3") position -= 3;
    else if (square === "Forward 2") position += 2;
    else if (square === "Forward 3") position += 3;
    else if (square === "Slå igen") {
      await rollDice();
      return;
    } else break;

    if (position < 0) position = 0;
    if (position >= board.length) position = board.length - 1;

    renderBoard();

    await new Promise(r => setTimeout(r, 300));

    square = board[position];
  }

  /* 📚 TBR JAR – visas separat */
  if (square === "TBR jar") {
    const book = tbrBooks[Math.floor(Math.random() * tbrBooks.length)];
    console.log("TBR Jar:", book);
  }
}

renderBoard();
