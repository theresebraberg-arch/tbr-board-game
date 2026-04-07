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

const diceFaces = ["⚀","⚁","⚂","⚃","⚄","⚅"];

/* 🔀 SHUFFLE */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* 👇 BLANDA BRÄDET DIREKT */
shuffle(board);

function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;

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

  let roll = Math.floor(Math.random() * 6);
  diceText.textContent = `Du slog: ${roll + 1}`;

  for (let i = 0; i < roll + 1; i++) {
    await moveOneStep();
  }

  await handleSquare(board[position]);

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

/* 🧠 HANTERA ALLA SPECIALRUTOR */
async function handleSquare(square) {

  while (true) {

    if (square === "Back 1") {
      position -= 1;
    }
    else if (square === "Back 3") {
      position -= 3;
    }
    else if (square === "Forward 2") {
      position += 2;
    }
    else if (square === "Forward 3") {
      position += 3;
    }
    else if (square === "Slå igen") {
      await rollDice();
      return;
    }
    else {
      break;
    }

    if (position < 0) position = 0;
    if (position >= board.length) position = board.length - 1;

    renderBoard();

    await new Promise(r => setTimeout(r, 300));

    square = board[position];
  }

  /* 📚 TBR JAR */
  if (square === "TBR jar") {
    const book = tbrBooks[Math.floor(Math.random() * tbrBooks.length)];
    alert("📚 " + book);
  } else {
    alert(square);
  }
}

renderBoard();
