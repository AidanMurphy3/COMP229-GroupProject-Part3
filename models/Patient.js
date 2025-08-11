const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateOfBirth: Date,
  address: String,
  phone: String,
  extraNotes: String
});

module.exports = mongoose.model('Patient', patientSchema);
