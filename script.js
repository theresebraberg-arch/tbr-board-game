let position = localStorage.getItem("tbr_position")
 ? parseInt(localStorage.getItem("tbr_position"), 10)
 : 0;

let isMoving = false;

const savedBoard = localStorage.getItem("tbr_board");
let gameBoard = savedBoard ? JSON.parse(savedBoard) : [...board];

if (!savedBoard) {
 shuffle(gameBoard);
 localStorage.setItem("tbr_board", JSON.stringify(gameBoard));
}

const books = [...tbrBooks];
const boardDiv = document.getElementById("board");
const diceText = document.getElementById("diceText");

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

  if (index === position) {
   div.classList.add("active");
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

 diceText.innerHTML = `🎲 ${d1} + ${d2} = <strong>${total}</strong>`;

 for (let i = 0; i < total; i++) {
  await moveOneStep();
 }

 await handleSquare();
 showResultCard();

 isMoving = false;
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

function showResultCard() {
 const modal = document.getElementById("resultModal");
 const text = document.getElementById("resultText");

 text.textContent = gameBoard[position];

 modal.classList.remove("hidden");
 createConfetti(document.querySelector(".result-card"));
}

function closeResult() {
 document.getElementById("resultModal").classList.add("hidden");
}

function createConfetti(element) {
 for (let i = 0; i < 30; i++) {
  const c = document.createElement("div");
  c.className = "confetti";
  c.style.left = Math.random() * 100 + "%";
  c.style.top = "-10px";
  element.appendChild(c);
  setTimeout(() => c.remove(), 1200);
 }
}

function resetGame() {
 localStorage.clear();
 location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
 renderBoard();
});
