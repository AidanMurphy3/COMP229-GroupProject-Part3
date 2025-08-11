//routes/patients.routes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

const router = express.Router();

//GET /api/patients/me
router.get('/me', auth(), async (req, res) => {
  try {
    const me = await Patient.findOne({ userId: req.user.id });
    res.json(me || null);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//POST /api/patients (create or update patient profile for the logged-in user)
router.post('/',
  auth(),
  body('dateOfBirth').optional().isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { dateOfBirth, address, phone, extraNotes } = req.body;
      const update = {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address, phone, extraNotes, userId: req.user.id
      };
      const saved = await Patient.findOneAndUpdate(
        { userId: req.user.id }, { $set: update }, { new: true, upsert: true }
      );
      res.status(201).json(saved);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

module.exports = router;