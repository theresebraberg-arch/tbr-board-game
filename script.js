let position = localStorage.getItem("tbr_position")
 ? parseInt(localStorage.getItem("tbr_position"), 10)
 : 0;

let isMoving = false;

const savedBoard = localStorage.getItem("tbr_board");
let gameBoard;

if (savedBoard) {
 gameBoard = JSON.parse(savedBoard);
} else {
 gameBoard = [...board];
 shuffle(gameBoard);
 localStorage.setItem("tbr_board", JSON.stringify(gameBoard));
}

const books = [...tbrBooks];
const boardDiv = document.getElementById("board");
const diceText = document.getElementById("diceText");
const jarModal = document.getElementById("jarModal");
const jarBook = document.getElementById("jarBook");

const colors = [
 "#fbcfe8","#bfdbfe","#fde68a","#bbf7d0",
 "#ddd6fe","#fecaca","#fdba74","#a7f3d0"
];

const savedColors = localStorage.getItem("tbr_colors");
let cellColors;

if (savedColors) {
 cellColors = JSON.parse(savedColors);
} else {
 cellColors = gameBoard.map(() =>
 colors[Math.floor(Math.random() * colors.length)]
 );
 localStorage.setItem("tbr_colors", JSON.stringify(cellColors));
}

function shuffle(array) {
 for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [array[i], array[j]] = [array[j], array[i]];
 }
}

function renderBoard() {
 boardDiv.innerHTML = "";

 gameBoard.forEach((cell, index) => {
  const div = document.createElement("div");
  div.className = "cell";
  div.textContent = cell;
  div.style.background = cellColors[index];

  if (index === position) {
   div.classList.add("active");

   const player = document.createElement("div");
   player.className = "player";
   player.textContent = "📍";
   div.appendChild(player);
  }

  boardDiv.appendChild(div);
 });
}

async function rollDice() {
 if (isMoving) return;
 isMoving = true;

 const d1 = Math.floor(Math.random() * 6) + 1;
 const d2 = Math.floor(Math.random() * 6) + 1;
 const total = d1 + d2;

 document.getElementById("dice1").textContent = getDiceFace(d1);
 document.getElementById("dice2").textContent = getDiceFace(d2);

 diceText.innerHTML = `🎲 ${d1} + ${d2} = <strong>${total}</strong>`;
 diceText.classList.add("big-roll");

 setTimeout(() => diceText.classList.remove("big-roll"), 1500);

 for (let i = 0; i < total; i++) {
  await moveOneStep();
 }

 await handleSquare();
 highlightLanding();

 isMoving = false;
}

function getDiceFace(n) {
 return ["⚀","⚁","⚂","⚃","⚄","⚅"][n-1];
}

function moveOneStep() {
 return new Promise(resolve => {
  setTimeout(() => {
   position++;
   if (position >= gameBoard.length) position = 0;

   localStorage.setItem("tbr_position", position);
   renderBoard();
   resolve();
  }, 300);
 });
}

async function handleSquare() {
 let square = gameBoard[position];

 if (square === "Back 1") position -= 1;
 if (square === "Back 3") position -= 3;
 if (square === "Forward 2") position += 2;
 if (square === "Forward 3") position += 3;

 if (position < 0) position = 0;
 if (position >= gameBoard.length) position = gameBoard.length - 1;

 localStorage.setItem("tbr_position", position);
 renderBoard();
}

function highlightLanding() {
 const cells = document.querySelectorAll(".cell");
 const active = cells[position];

 active.classList.add("landed");

 for (let i = 0; i < 20; i++) {
  const c = document.createElement("div");
  c.className = "confetti";
  c.style.left = Math.random()*100+"%";
  c.style.top = Math.random()*100+"%";
  active.appendChild(c);
  setTimeout(()=>c.remove(),1000);
 }

 setTimeout(()=>active.classList.remove("landed"),1500);
}

function drawFromJar() {
 if (!gameBoard[position].toLowerCase().includes("tbr jar")) {
  alert("Du måste landa på TBR jar först");
  return;
 }

 const book = books[Math.floor(Math.random() * books.length)];

 jarModal.classList.remove("hidden");
 jarBook.classList.remove("hidden");

 jarBook.textContent = "Drar din bok...";
 jarBook.classList.remove("show");

 setTimeout(() => {
  jarBook.textContent = book;
  jarBook.classList.add("show");
 }, 400);
}

function closeJar() {
 jarModal.classList.add("hidden");
}

function resetGame() {
 localStorage.clear();
 location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
 closeJar();
 renderBoard();
});
