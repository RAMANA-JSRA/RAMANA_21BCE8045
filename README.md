# Turn-based Chess-like Game with WebSocket Communication

## Objective

This project is a turn-based chess-like game with a server-client architecture, using WebSocket for real-time communication and a web-based user interface. The goal was to create a game that allows multiple players to connect and play in real-time, with game state synchronization between the server and all connected clients.

## Table of Contents

1. [Features](#features)
2. [Game Rules](#game-rules)
3. [Setup and Installation](#setup-and-installation)
4. [Usage](#usage)
5. [Architecture](#architecture)
6. [Challenges Faced](#challenges-faced)
7. [Future Improvements](#future-improvements)
8. [Contributing](#contributing)
9. [License](#license)

## Features

- **Real-time Gameplay**: The game supports real-time, turn-based gameplay using WebSocket for instant communication.
- **5x5 Game Board**: A web-based interface displays the game board, allowing players to select and move their characters.
- **Move Validation**: Both client and server validate moves to ensure they follow the game rules.
- **Responsive UI**: The game interface is user-friendly and responsive, showing valid moves and current game status.
- **Error Handling**: Client and server handle errors gracefully, including invalid moves and disconnections.

## Game Rules

1. **Turn-based Play**: Players take turns moving their pieces. Each piece has specific movement rules.
2. **Move Types**: Pieces can move forward, backward, left, or right depending on their type.
3. **Capture Moves**: Players can capture opponent pieces by moving onto their space, removing them from the board.
4. **Winning Condition**: The game ends when all opponent's pieces are eliminated or a player concedes.

## Setup and Installation

To set up and run the game, follow the instructions below.

### Prerequisites

- Node.js and npm (for running the server)
- A modern web browser (for the client)
- WebSocket library (e.g., `ws` for Node.js)

### Server Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/RAMANA-JSRA/RAMANA_21BCE8045/
   cd chess-like-game/public

   ```
   Usage

    Start the Server: Run the server using Node.js as described in the setup.
    Open the Client: Open the index.html file in a web browser.
    Connect to the Game: The client will automatically connect to the server via WebSocket.
    Play the Game: Select your pieces and make moves according to the game rules. The interface will update in real-time based on server communication.

2.**Architecture**

*The game is structured with a clear separation between client and server code.*

    Server: Handles the core game logic, manages player connections, processes moves, validates actions, and maintains the game state.
    Client: Provides a user interface, communicates with the server over WebSocket, displays the game board and status, and manages player input.

3.**WebSocket Communication**

    Initialization: When a player connects, the server sends the current game state.
    Moves: When a player makes a move, the client sends the move to the server, which validates and broadcasts the updated state.
    State Sync: The server keeps all clients in sync by broadcasting game state changes.

4.**Challenges Faced**

    Real-time Synchronization: Ensuring all clients have the correct and synchronized game state in real time was challenging. We handled this by broadcasting updates to all connected clients whenever a game state change occurred.

    Move Validation: Implementing move validation both on the client and server sides required careful consideration of game rules and edge cases, such as simultaneous moves or invalid moves.

    WebSocket Management: Handling WebSocket connections, especially managing disconnections and reconnections, was complex. We implemented robust error handling and state management to mitigate issues.

    User Interface: Developing a responsive and intuitive user interface that dynamically updates based on game state changes was essential for a good user experience.

5.**Future Improvements**

    AI Opponent: Implement a basic AI to allow single-player mode against the computer.
    Enhanced Graphics: Improve the game's visual design and add animations for moves and captures.
    Leaderboard: Create a leaderboard to track player wins and statistics.
    Spectator Mode: Allow additional users to join as spectators without participating in the game.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contact

If you have any questions or feedback, please feel free to reach out.

- **GitHub:** [ramana-jsra](https://github.com/ramana-jsra)
- **Email:** ramanajsra12@gmail.com

Thank you for visiting the *Chess-like-game* Webpage repository!
