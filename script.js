let position = 0;

const board = document.getElementById("board");
const diceText = document.getElementById("diceText");

let cells = [];

/* 🔥 LADDA SPARAD POSITION */
const savedPosition = localStorage.getItem("tbr-position");
if (savedPosition !== null) {
  position = parseInt(savedPosition);
}

/* 🎲 SKAPA BOARD */
function createBoard() {
  board.innerHTML = "";
  cells = [];

  gameData.forEach((item, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = item.text;
    cell.style.background = item.color;

    if (index === position) {
      cell.classList.add("active");

      const player = document.createElement("div");
      player.classList.add("player");
      player.textContent = "📖";
      cell.appendChild(player);
    }

    board.appendChild(cell);
    cells.push(cell);
  });
}

/* 🎲 SLÅ TÄRNING */
function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;

  diceText.innerText = "🎲 Du slog: " + roll;

  position += roll;

  if (position >= gameData.length) {
    position = gameData.length - 1;
  }

  saveGame();
  createBoard();
}

/* 💾 SPARA */
function saveGame() {
  localStorage.setItem("tbr-position", position);
}

/* 🔄 RESET */
function resetGame() {
  position = 0;
  localStorage.removeItem("tbr-position");
  diceText.innerText = "Redo att spela";
  createBoard();
}

/* 🫙 TBR JAR */
function drawFromJar() {
  const randomIndex = Math.floor(Math.random() * jarBooks.length);
  alert("📚 Du fick: " + jarBooks[randomIndex]);
}

/* START */
createBoard();
