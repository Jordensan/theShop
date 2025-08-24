// routes/availability.js

const express = require('express');
const router = express.Router();

// In-memory store for now
let availability = [];

// POST /api/availability
router.post('/', (req, res) => {
  const { date, times } = req.body;
  if (!date || !times) return res.status(400).json({ error: 'Missing date or times' });

  // Replace or add availability for that date
  const existingIndex = availability.findIndex(avail => avail.date === date);
  if (existingIndex !== -1) {
    availability[existingIndex].times = times;
  } else {
    availability.push({ date, times });
  }

  res.status(201).json({ message: 'Availability saved' });
});

// GET /api/availability/:date
router.get('/:date', (req, res) => {
  const date = req.params.date;
  const entry = availability.find(avail => avail.date === date);
  if (!entry) {
    return res.status(404).json([]); // return empty array if no availability
  }
  res.json(entry.times); // just return the array of times
});

// GET /api/availability (optional, for admin)
router.get('/', (req, res) => {
  res.json(availability);
});

module.exports = router;
