const express = require('express');
const router = express.Router();
const ClockEntry = require('../models/ClockEntry');
const Employee = require('../models/Employee');

// Middleware to check if an employee is clocked in
const checkClockedIn = async (req, res, next) => {
  const { employeeId } = req.body;
  const clockEntry = await ClockEntry.findOne({ employee: employeeId, clockOutTime: null });
  if (clockEntry) {
    req.clockEntry = clockEntry;
    req.clockedIn = true;
  } else {
    req.clockedIn = false;
  }
  next();
};

// Get clock-in status
router.get('/status', async (req, res) => {
  const { employeeId } = req.query;
  const clockEntry = await ClockEntry.findOne({ employee: employeeId, clockOutTime: null });
  if (clockEntry) {
    res.json({ status: 'clocked_in', clockEntry });
  } else {
    res.json({ status: 'clocked_out' });
  }
});

// Clock in
router.post('/clock-in', checkClockedIn, async (req, res) => {
  if (req.clockedIn) {
    return res.status(400).json({ error: 'Already clocked in' });
  }

  const { employeeId } = req.body;
  const clockEntry = new ClockEntry({ employee: employeeId, clockInTime: new Date() });
  await clockEntry.save();
  res.json({ status: 'clocked_in', clockEntry });
});

// Clock out
router.post('/clock-out', checkClockedIn, async (req, res) => {
  if (!req.clockedIn) {
    return res.status(400).json({ error: 'Not clocked in' });
  }

  req.clockEntry.clockOutTime = new Date();
  await req.clockEntry.save();
  res.json({ status: 'clocked_out', clockEntry: req.clockEntry });
});

module.exports = router;
