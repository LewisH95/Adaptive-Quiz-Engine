const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quizdb')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Middleware
app.use(bodyParser.json());
app.use(express.static('src')); // Serve static files from the 'src' directory

// Question schema and model
const questionSchema = new mongoose.Schema({
    text: String,
    options: [String],
    answer: String,
    difficulty: String
});
const Question = mongoose.model('Question', questionSchema);

// API endpoint to fetch questions by difficulty
app.get('/api/questions', (req, res) => {
    const difficulty = req.query.difficulty;
    Question.find({ difficulty: difficulty }, (err, questions) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(questions);
        }
    });
});

// API endpoint to add new questions
app.post('/api/questions', (req, res) => {
    const question = new Question(req.body);
    question.save((err, savedQuestion) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).json(savedQuestion);
        }
    });
});

// API endpoint to fetch all questions (for initialization/testing)
app.get('/api/all-questions', (req, res) => {
    Question.find({}, (err, questions) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(questions);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// TEST QUESTIONS
const sampleQuestions = [
    { text: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: '4', difficulty: 'easy' },
];

// Using async/await to insert sample questions
(async () => {
    try {
        await Question.insertMany(sampleQuestions);
        console.log('Sample questions inserted');
    } catch (err) {
        console.log('Error inserting sample questions:', err);
    }
})();
