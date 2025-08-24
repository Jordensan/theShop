const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
  date: String,
  time: String,
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Booking', bookingSchema);
