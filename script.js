console.log("Welcome to Tic Tac Toe");

let boxes = document.getElementsByClassName("box");
let info = document.querySelector(".info");
let imgbox = document.querySelector(".imgbox");
let turn = "X";
let isGameOver = false;

// Check for a win
const checkWin = () => {
  let boxtexts = document.getElementsByClassName('boxtext');
  let wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (let win of wins) {
    let [a, b, c] = win;
    if (
      boxtexts[a].innerText !== "" &&
      boxtexts[a].innerText === boxtexts[b].innerText &&
      boxtexts[b].innerText === boxtexts[c].innerText
    ) {
      info.innerText = boxtexts[a].innerText + " Won";
      isGameOver = true;
      imgbox.style.display = "block";
      return boxtexts[a].innerText;
    }
  }

  // Check draw
  let draw = true;
  for (let box of boxtexts) {
    if (box.innerText === "") {
      draw = false;
      break;
    }
  }
  if (draw) {
    info.innerText = "It's a Draw!";
    isGameOver = true;
    return "Draw";
  }

  return null;
};

// Minimax Algorithm
function minimax(isMaximizing) {
  let boxtexts = document.getElementsByClassName('boxtext');
  let board = Array.from(boxtexts).map(box => box.innerText);
  let winner = evaluate(board);

  if (winner === 1) return 1;       // AI wins
  if (winner === -1) return -1;     // Player wins
  if (isFull(board)) return 0;      // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimaxHelper(board, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimaxHelper(board, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function minimaxHelper(board, isMaximizing) {
  let winner = evaluate(board);
  if (winner !== null) return winner;
  if (isFull(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let val = minimaxHelper(board, false);
        board[i] = "";
        best = Math.max(best, val);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let val = minimaxHelper(board, true);
        board[i] = "";
        best = Math.min(best, val);
      }
    }
    return best;
  }
}

function evaluate(board) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      if (board[a] === "O") return 1;
      else if (board[a] === "X") return -1;
    }
  }
  return null;
}

function isFull(board) {
  return board.every(cell => cell !== "");
}

// AI makes move
function bestMove() {
  let boxtexts = document.getElementsByClassName('boxtext');
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < boxtexts.length; i++) {
    if (boxtexts[i].innerText === "") {
      boxtexts[i].innerText = "O";
      let score = minimax(false);
      boxtexts[i].innerText = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== undefined) {
    boxtexts[move].innerText = "O";
    turn = "X";
    checkWin();
  }
}

// Handle player move
Array.from(boxes).forEach((element) => {
  let boxtext = element.querySelector(".boxtext");
  element.addEventListener("click", () => {
    if (boxtext.innerText === "" && !isGameOver && turn === "X") {
      boxtext.innerText = "X";
      turn = "O";
      if (!checkWin()) {
        setTimeout(() => {
          if (!isGameOver) bestMove();
        }, 300);
      }
    }
  });
});

// Reset game
document.getElementById("reset").addEventListener("click", () => {
  let boxtexts = document.querySelectorAll(".boxtext");
  boxtexts.forEach(e => e.innerText = "");
  turn = "X";
  isGameOver = false;
  info.innerText = "Turn for X";
  imgbox.style.display = "none";
});
