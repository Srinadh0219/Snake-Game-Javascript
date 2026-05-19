# Snake Game Backend API

A lightweight Node.js/Express server that persists the Snake Game's high scores into a local JSON database file.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

### Running the Server

Start the development server with:
```bash
npm start
```
The server will run on `http://localhost:5000` (or the port specified by the `PORT` environment variable).

---

## 🔌 API Endpoints

### 1. Get High Score
* **URL**: `/api/highscore`
* **Method**: `GET`
* **Response (JSON)**:
  ```json
  {
    "highscore": 24
  }
  ```

### 2. Submit Score
* **URL**: `/api/highscore`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Body (JSON)**:
  ```json
  {
    "score": 30
  }
  ```
* **Response (JSON)**:
  * If score is a new high score:
    ```json
    {
      "success": true,
      "highscore": 30,
      "message": "New high score saved successfully!"
    }
    ```
  * If score is lower or equal:
    ```json
    {
      "success": false,
      "highscore": 24,
      "message": "Submitted score is not higher than the current high score."
    }
    ```
