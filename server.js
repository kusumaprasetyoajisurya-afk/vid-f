require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
let db;
MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    db = client.db();
  })
  .catch(error => console.error(error));

// Authentication middleware
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Routes

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const usersCollection = db.collection('users');
  const existingUser = await usersCollection.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await usersCollection.insertOne({ username, password: hashedPassword });
  res.json({ message: 'User registered' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
    const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ username });
  if (!user) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  req.session.userId = user._id;
  req.session.username = user.username;
  res.json({ message: 'Logged in' });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

// Get current user info
app.get('/api/me', (req, res) => {
  if (!req.session.userId) {
    return res.json(null);
  }
  res.json({ id: req.session.userId, username: req.session.username });
});

// Get videos
app.get('/api/videos', async (req, res) => {
    const videosCollection = db.collection('videos');
  const videos = await videosCollection.find({}).toArray();
  res.json(videos);
});

// Add a video
app.post('/api/videos', requireLogin, async (req, res) => {
  const { title, price } = req.body;
    const videosCollection = db.collection('videos');
  if (!title || !price) {
    return res.status(400).json({ error: 'Title and price required' });
  }
  const newVideo = {
    title,
    price: Number(price),
    userId: req.session.userId
  };
  const result = await videosCollection.insertOne(newVideo);
  res.json(result.ops[0]);
});

// Delete a video
app.delete('/api/videos/:id', requireLogin, async (req, res) => {
    const videoId = req.params.id;
    const videosCollection = db.collection('videos');
    // In a real app, you would also check if the user owns the video
    const result = await videosCollection.deleteOne({ _id: new ObjectId(videoId) });
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Video not found' });
    }
    res.json({ message: 'Video deleted successfully' });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});