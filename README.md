# 🐍 Full-Stack Snake Game with JavaScript & Express

Welcome to the **Full-Stack Snake Game**! This repository has been structured as a modern full-stack web application featuring a pure JavaScript game client on the frontend and an Express high scores persistence server on the backend.


## 🎮 Features

- **Classic Gameplay**: Keyboard Arrow key controls and full mobile screen tap support.
- **Sound Design**: Immersive retro game audio for eating food, player movement, and game over sequences.
- **Full-Stack High Score Persistence**:
  - Automatically loads the globally recorded high score from the Node.js/Express server on startup.
  - Dynamically updates and commits high scores to the backend server in real-time when the player beats the current high score.
  - **Fail-Safe Offline Mode**: Falls back transparently to browser `localStorage` if the backend API server is offline.

---

## 🚀 Getting Started

To run the application locally:

### 1. Start the Backend API Server
1. Navigate into the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
The server will now be live at `http://localhost:5000`.

### 2. Launch the Frontend Client
You can open `frontend/index.html` directly in your web browser, or use a local dev server (like VS Code Live Server) to host the frontend. The game client will automatically connect to the backend server running on port `5000` to fetch and record high scores.

---

## 🔌 API Endpoints

The Express backend exposes the following endpoints:

- **`GET /api/highscore`** - Retrieves the current highest score.
- **`POST /api/highscore`** - Updates the high score if the submitted score is higher (requires JSON request body `{ "score": number }`).
