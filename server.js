require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// User model
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Register route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) {
    return res.json({ success: false, message: 'Username already exists.' });
  }
  const user = new User({ username, password });
  await user.save();
  res.json({ success: true });
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid username or password.' });
  }
});

// Dummy quiz data
const quizzes = {
  'JavaScript Basics': [
    { question: 'What does "var" declare?', options: ['Variable', 'Function'], answer: 'Variable' }
  ],
  'HTML & CSS': [
    { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'Other'], answer: 'Hyper Text Markup Language' }
  ]
};

// Get quiz data
app.get('/api/quiz/:name', (req, res) => {
  const quizName = req.params.name;
  if (quizzes[quizName]) {
    res.json(quizzes[quizName]);
  } else {
    res.status(404).json({ message: 'Quiz not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
