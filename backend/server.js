const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const scoreFilePath = path.join(__dirname, 'highscores.json');

// Helper function to read the high score
const getHighScore = () => {
    try {
        if (!fs.existsSync(scoreFilePath)) {
            const initialData = { highscore: 0 };
            fs.writeFileSync(scoreFilePath, JSON.stringify(initialData, null, 2));
            return 0;
        }
        const data = fs.readFileSync(scoreFilePath, 'utf8');
        const parsed = JSON.parse(data);
        return parsed.highscore || 0;
    } catch (error) {
        console.error("Error reading high score file, returning 0:", error.message);
        return 0;
    }
};

// Helper function to save the high score
const saveHighScore = (score) => {
    try {
        const data = { highscore: score, updatedAt: new Date().toISOString() };
        fs.writeFileSync(scoreFilePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error("Error writing high score to file:", error.message);
        return false;
    }
};

// Endpoints
app.get('/api/highscore', (req, res) => {
    const highscore = getHighScore();
    res.json({ highscore });
});

app.post('/api/highscore', (req, res) => {
    const { score } = req.body;
    
    if (typeof score !== 'number') {
        return res.status(400).json({ error: 'Score must be a number' });
    }

    const currentHighScore = getHighScore();
    
    if (score > currentHighScore) {
        saveHighScore(score);
        console.log(`New High Score established: ${score}!`);
        return res.json({ 
            success: true, 
            highscore: score, 
            message: 'New high score saved successfully!' 
        });
    }

    res.json({ 
        success: false, 
        highscore: currentHighScore, 
        message: 'Submitted score is not higher than the current high score.' 
    });
});

// Root endpoint with a beautiful health check info page
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #4CAF50;">🐍 Snake Game API Server 🐍</h1>
            <p>Status: <strong>Running Successfully</strong></p>
            <p>Current High Score: <strong>${getHighScore()}</strong></p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f1f1f1; display: inline-block; border-radius: 8px;">
                <code>GET /api/highscore</code> - Retrieve current high score<br/>
                <code>POST /api/highscore</code> - Submit new score (expects JSON: <code>{ "score": 10 }</code>)
            </div>
        </div>
    `);
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🐍 Snake Game API is live on port ${PORT}`);
    console.log(`👉 Access locally at http://localhost:${PORT}`);
    console.log(`========================================`);
});
