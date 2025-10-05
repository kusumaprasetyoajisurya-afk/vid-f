require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

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

    // Start the server only after the database is connected
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to connect to the database');
    console.error(error);
    process.exit(1); // Exit the process with an error code
  });


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
  try {
    const { username, password } = req.body;
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await usersCollection.insertOne({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
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
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out.' });
    }
    res.json({ message: 'Logged out' });
  });
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
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const videosCollection = db.collection('videos');
    const videos = await videosCollection.find({}).toArray();
    res.json(videos);
  } catch (err) {
    console.error('Get videos error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a video
app.post('/api/videos', requireLogin, async (req, res) => {
  try {
    const { title, price } = req.body;
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const videosCollection = db.collection('videos');
    if (!title || !price) {
      return res.status(400).json({ error: 'Title and price required' });
    }
    const newVideo = {
      title,
      price: Number(price),
      userId: new ObjectId(req.session.userId)
    };
    const result = await videosCollection.insertOne(newVideo);
    res.status(201).json({ message: 'Video added successfully', videoId: result.insertedId });
  } catch (err) {
    console.error('Add video error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a video
app.delete('/api/videos/:id', requireLogin, async (req, res) => {
    try {
        const videoId = req.params.id;
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }
        const videosCollection = db.collection('videos');

        // Basic validation for ObjectId
        if (!ObjectId.isValid(videoId)) {
            return res.status(400).json({ error: 'Invalid video ID format' });
        }

        const result = await videosCollection.deleteOne({ 
            _id: new ObjectId(videoId),
            // Optionally, ensure the user owns the video
            // userId: new ObjectId(req.session.userId) 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Video not found or you do not have permission to delete it' });
        }
        res.json({ message: 'Video deleted successfully' });
    } catch (err) {
        console.error('Delete video error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});