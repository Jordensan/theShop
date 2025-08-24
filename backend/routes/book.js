const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).send('Server error');
  }
});

// POST a new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving booking:', err);
    res.status(500).send('Server error');
  }
});

// DELETE a booking
router.delete('/:id', async (req, res) => {
  try {
    const result = await Booking.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send('Appointment not found');
    res.status(200).send('Appointment deleted');
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).send('Server error');
  }
});

// MARK booking as complete
router.put('/:id/complete', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    if (!booking) return res.status(404).send('Appointment not found');
    res.json(booking);
  } catch (err) {
    console.error('Error marking booking complete:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
