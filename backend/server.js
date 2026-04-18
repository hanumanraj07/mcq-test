require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/questions', async (req, res) => {
    try {
        const { category } = req.query;
        if (!category) return res.status(400).json({ error: 'Category query parameter is required' });

        // Fetch directly from the specific collection named after the category
        const db = mongoose.connection.db;
        const docs = await db.collection(category.toLowerCase()).find({}).toArray();

        let flatQuestions = [];
        docs.forEach(doc => {
            if (doc.questions && Array.isArray(doc.questions)) {
                // Flatten wrapper array 
                flatQuestions.push(...doc.questions);
            } else {
                // Direct objects
                flatQuestions.push(doc);
            }
        });

        res.json({ questions: flatQuestions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas successfully.');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
