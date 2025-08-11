//routes/appointments.routes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointments');
const auth = require('../middleware/auth');

const router = express.Router();

//Utility: check slot conflict (same dentist & same exact start time)
async function hasConflict({ dentist, date }) {
  const existing = await Appointment.findOne({ dentist, date });
  return !!existing;
}

//GET /api/appointments (patients: their own, admins: all)
router.get('/', auth(), async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
    const items = await Appointment.find(filter).sort({ date: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//POST /api/appointments
router.post('/',
  auth(),
  body('patientName').notEmpty(),
  body('dentist').notEmpty(),
  body('date').isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { patientName, dentist, date, reason } = req.body;
      const when = new Date(date);
      if (await hasConflict({ dentist, date: when })) {
        return res.status(409).json({ message: 'That time is already booked with this dentist' });
      }
      const created = await Appointment.create({
        patientName, dentist, date: when, reason: reason || null, createdBy: req.user.id
      });
      res.status(201).json(created);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

//PATCH /api/appointments/:id
router.patch('/:id',
  auth(),
  async (req, res) => {
    try {
      const appt = await Appointment.findById(req.params.id);
      if (!appt) return res.status(404).json({ message: 'Not found' });
      if (String(appt.createdBy) !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const updates = {};
      if (req.body.patientName) updates.patientName = req.body.patientName;
      if (req.body.dentist) updates.dentist = req.body.dentist;
      if (req.body.date) updates.date = new Date(req.body.date);
      if (req.body.reason !== undefined) updates.reason = req.body.reason;

      //optional conflict check if dentist or date changed
      if ((updates.dentist || updates.date) && (updates.dentist ?? appt.dentist) && (updates.date ?? appt.date)) {
        const checkDentist = updates.dentist ?? appt.dentist;
        const checkDate = updates.date ?? appt.date;
        const conflict = await Appointment.findOne({ dentist: checkDentist, date: checkDate, _id: { $ne: appt._id } });
        if (conflict) return res.status(409).json({ message: 'That time is already booked with this dentist' });
      }

      const saved = await Appointment.findByIdAndUpdate(req.params.id, updates, { new: true });
      res.json(saved);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

//DELETE /api/appointments/:id
router.delete('/:id', auth(), async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Not found' });
    if (String(appt.createdBy) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await appt.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;