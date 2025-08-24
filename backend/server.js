require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Booking = require('./models/Booking');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

// API routes
app.use('/api/book', require('./routes/book'));
app.use('/api/availability', require('./routes/availability'));

// Serve main customer page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Serve admin dashboard page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin.html'));
});

// Mark booking complete/incomplete
app.patch('/api/book/:id/complete', async (req, res) => {
  try {
    const { completed } = req.body; // true or false
    const updatedAppt = await Booking.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    if (!updatedAppt) return res.status(404).json({ error: 'Booking not found' });
    res.json(updatedAppt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => {
    console.log('Server running on port 5000');
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
