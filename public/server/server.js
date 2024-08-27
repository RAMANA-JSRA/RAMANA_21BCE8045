// server.js

const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });

// Initialize game state
let gameState = {
  board: Array(5)
    .fill(null)
    .map(() => Array(5).fill(null)), // 5x5 board
  currentPlayer: "A",
  players: {
    A: {
      characters: {
        P1: { position: { row: 0, col: 0 }, type: "Pawn" },
        P2: { position: { row: 0, col: 1 }, type: "Pawn" },
        H1: { position: { row: 0, col: 2 }, type: "Hero" },
        H2: { position: { row: 0, col: 3 }, type: "Hero" },
        H3: { position: { row: 0, col: 4 }, type: "Hero" },
      },
    },
    B: {
      characters: {
        P1: { position: { row: 4, col: 0 }, type: "Pawn" },
        P2: { position: { row: 4, col: 1 }, type: "Pawn" },
        H1: { position: { row: 4, col: 2 }, type: "Hero" },
        H2: { position: { row: 4, col: 3 }, type: "Hero" },
        H3: { position: { row: 4, col: 4 }, type: "Hero" },
      },
    },
  },
  moveHistory: [],
  winner: null,
};

// Initialize the board with characters
function initializeBoard() {
  gameState.board = Array(5)
    .fill(null)
    .map(() => Array(5).fill(null)); // Clear board
  Object.entries(gameState.players).forEach(([player, data]) => {
    Object.entries(data.characters).forEach(([charName, charData]) => {
      const { row, col } = charData.position;
      gameState.board[row][col] = `${player}-${charName}`;
    });
  });
}

initializeBoard(); // Initial board setup

// WebSocket server event handlers
server.on("connection", (ws) => {
  // Send the initial game state to the connected client
  ws.send(JSON.stringify({ type: "init", data: gameState }));

  ws.on("message", (message) => {
    const action = JSON.parse(message);
    if (action.character && action.direction) {
      const result = handleMove(action);
      if (result.valid) {
        gameState.moveHistory.push({
          character: action.character,
          from: action.from,
          to: result.newPosition,
          captured: result.captured ? result.captured : null,
        });
        checkForWinner();
        broadcast({ type: "update", data: gameState });
      } else {
        ws.send(JSON.stringify({ type: "error", message: result.message }));
      }
    }
  });
});

// Function to handle player moves
function handleMove({ character, direction }) {
  const player = gameState.currentPlayer;
  const charKey = character.split("-")[1];
  const charData = gameState.players[player].characters[charKey];

  if (!charData) {
    return { valid: false, message: "Invalid character" };
  }

  const newPosition = calculateNewPosition(
    charData.position,
    direction,
    charData.type
  );

  if (
    newPosition === null ||
    newPosition.row < 0 ||
    newPosition.row > 4 ||
    newPosition.col < 0 ||
    newPosition.col > 4
  ) {
    return { valid: false, message: "Invalid move" };
  }

  // Check for friendly fire
  const targetCell = gameState.board[newPosition.row][newPosition.col];
  if (targetCell && targetCell.startsWith(player)) {
    return { valid: false, message: "Cannot move onto a friendly character" };
  }

  // Update board and character position
  gameState.board[charData.position.row][charData.position.col] = null;
  gameState.board[newPosition.row][newPosition.col] = `${player}-${charKey}`;
  charData.position = newPosition;

  // Check if any piece was captured
  const captured = targetCell ? targetCell.split("-")[1] : null;

  // Switch player turns
  gameState.currentPlayer = gameState.currentPlayer === "A" ? "B" : "A";

  return {
    valid: true,
    newPosition,
    captured,
    description: `${player}-${charKey} moved to (${newPosition.row}, ${newPosition.col})`,
  };
}

// Function to calculate new position based on direction
function calculateNewPosition(position, direction) {
  let { row, col } = position;

  switch (direction) {
    case "F": // Forward
      row -= 1;
      break;
    case "B": // Backward
      row += 1;
      break;
    case "L": // Left
      col -= 1;
      break;
    case "R": // Right
      col += 1;
      break;
  }

  return { row, col };
}

// Function to check if there is a winner
function checkForWinner() {
  // Logic to determine if a player has won
  // Example: if a player captures all opponent's pieces
  const playerAChars = Object.values(gameState.players.A.characters);
  const playerBChars = Object.values(gameState.players.B.characters);

  if (
    playerBChars.every(
      (char) => !gameState.board[char.position.row][char.position.col]
    )
  ) {
    gameState.winner = "A";
  } else if (
    playerAChars.every(
      (char) => !gameState.board[char.position.row][char.position.col]
    )
  ) {
    gameState.winner = "B";
  }
}

// Function to broadcast messages to all connected clients
function broadcast(message) {
  server.clients.forEach((client) => client.send(JSON.stringify(message)));
}

console.log("WebSocket server running on ws://localhost:8080");
