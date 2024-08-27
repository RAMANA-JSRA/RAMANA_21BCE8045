// app.js

const ws = new WebSocket("ws://localhost:8080");
let gameState;
let selectedCharacter = null;

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === "init" || message.type === "update") {
    gameState = message.data;
    updateUI();
  }
};

function updateUI() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = ""; // Clear the board

  gameState.board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellDiv = document.createElement("div");
      cellDiv.textContent = cell ? cell : "";
      cellDiv.onclick = () => selectCharacter(rowIndex, colIndex);

      if (cell) {
        const player = cell[0]; // "A" or "B"
        cellDiv.dataset.player = player;
      }

      if (
        selectedCharacter &&
        selectedCharacter.row === rowIndex &&
        selectedCharacter.col === colIndex
      ) {
        cellDiv.classList.add("selected");
      } else {
        cellDiv.classList.remove("selected");
      }

      if (gameState.winner && gameState.winner === cell[0]) {
        cellDiv.dataset.winner = gameState.winner;
      }

      boardDiv.appendChild(cellDiv);
    });
  });

  document.getElementById(
    "current-player"
  ).textContent = `Current Player: ${gameState.currentPlayer}`;
  document.getElementById("selected-character").textContent = selectedCharacter
    ? `Selected: ${selectedCharacter.character}`
    : "No character selected";

  const moveHistoryUl = document.querySelector(".move-history ul");
  moveHistoryUl.innerHTML = "";
  gameState.moveHistory.forEach((move) => {
    const li = document.createElement("li");
    li.textContent = `${move.character} moved from (${move.from.row},${move.from.col}) to (${move.to.row},${move.to.col})`;
    if (move.captured) li.classList.add("captured");
    moveHistoryUl.appendChild(li);
  });
}

function selectCharacter(row, col) {
  const character = gameState.board[row][col];

  // Check if the cell contains a character and if it's the current player's turn
  if (character && character[0] === gameState.currentPlayer) {
    selectedCharacter = { row, col, character };
    updateUI();
  } else {
    alert("Invalid selection! Select your own character.");
  }
}

function move(direction) {
  if (!selectedCharacter) {
    alert("Please select a character first.");
    return;
  }

  const action = {
    character: selectedCharacter.character,
    from: { row: selectedCharacter.row, col: selectedCharacter.col },
    direction,
  };

  ws.send(JSON.stringify(action));
}
