require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';

const questionSchema = new mongoose.Schema({
    category: String,
    kind: String,
    text: String,
    options: [String],
    answer: String,
    points: Number
});
const Question = mongoose.model('Question', questionSchema);

const seedData = [
    { category: 'mongodb', kind: 'mcq', text: 'Which format does MongoDB use to store data?', options: ['JSON', 'BSON', 'XML', 'CSV'], answer: 'BSON', points: 1 },
    { category: 'mongodb', kind: 'mcq', text: 'What is a collection in MongoDB equivalent to in an RDBMS?', options: ['Database', 'Row', 'Table', 'Column'], answer: 'Table', points: 1 },
    { category: 'mongodb', kind: 'mcq', text: 'Which command is used to insert a document in MongoDB?', options: ['insert()', 'add()', 'create()', 'put()'], answer: 'insert()', points: 1 },

    { category: 'math', kind: 'mcq', text: 'What is 15 * 12?', options: ['180', '160', '150', '200'], answer: '180', points: 1 },
    { category: 'math', kind: 'mcq', text: 'What is the square root of 144?', options: ['10', '12', '14', '16'], answer: '12', points: 1 },
    { category: 'math', kind: 'mcq', text: 'What is the formula for the area of a circle?', options: ['2πr', 'πr²', 'πd', 'r²'], answer: 'πr²', points: 1 },

    { category: 'nodejs', kind: 'mcq', text: 'Which module is used to create a web server in Node.js?', options: ['fs', 'http', 'url', 'path'], answer: 'http', points: 1 },
    { category: 'nodejs', kind: 'mcq', text: 'Node.js is built on which engine?', options: ['V8', 'SpiderMonkey', 'Chakra', 'JavaScriptCore'], answer: 'V8', points: 1 },
    { category: 'nodejs', kind: 'mcq', text: 'How do you import a module in commonJS?', options: ['import module from', 'include module', 'require()', 'use module'], answer: 'require()', points: 1 },

    { category: 'cpp', kind: 'mcq', text: 'Who created C++?', options: ['Dennis Ritchie', 'Bjarne Stroustrup', 'James Gosling', 'Guido van Rossum'], answer: 'Bjarne Stroustrup', points: 1 },
    { category: 'cpp', kind: 'mcq', text: 'Find the standard stream for output in C++?', options: ['cin', 'cout', 'cerr', 'clog'], answer: 'cout', points: 1 },
    { category: 'cpp', kind: 'mcq', text: 'Does C++ support multiple inheritance?', options: ['Yes', 'No', 'Only in C++11', 'Through interfaces only'], answer: 'Yes', points: 1 },

    { category: 'react', kind: 'mcq', text: 'What is the hook used for side effects in React?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], answer: 'useEffect', points: 1 },
    { category: 'react', kind: 'mcq', text: 'Who developed React?', options: ['Google', 'Meta', 'Microsoft', 'Twitter'], answer: 'Meta', points: 1 },
    { category: 'react', kind: 'mcq', text: 'Which method runs exactly when the component mounts in Class Components?', options: ['componentDidCatch', 'componentDidMount', 'componentDidUpdate', 'componentWillUpdate'], answer: 'componentDidMount', points: 1 }
];

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB. Purging old data...');
        await Question.deleteMany({});
        console.log('Inserting seed data...');
        await Question.insertMany(seedData);
        console.log('Database seeded successfully!');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
