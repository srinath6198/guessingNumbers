const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;



app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/guessinggame', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const scoreSchema = new mongoose.Schema({
    name: String,
    score: Number,
    guesses: Number,
    timeTaken: Number,
});

const Score = mongoose.model('Score', scoreSchema);



app.post('/api/scores', async (req, res) => {
    const { name, score, guesses, timeTaken } = req.body;

    const newScore = new Score({ name, score, guesses, timeTaken });
    await newScore.save();

    res.status(201).send(newScore);
});
// best score api
app.get('/api/scores/best', async (req, res) => {
    try {
        const bestScore = await Score.findOne().sort({ score: 1 }).exec();
        if (!bestScore) {
            return res.status(404).send({ message: "No scores found" });
        }
        res.status(200).send(bestScore);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});