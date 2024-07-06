const express = require('express');
const router = express.Router();
const Estimate = require('../models/estimate');
const { v4: uuidv4 } = require('uuid');

// Create a new estimate
router.post('/create', async (req, res) => {
  const { companyInfo, invoices } = req.body;

  try {
    const estimate = new Estimate({
      companyInfo,
      invoices,
    });

    const newEstimate = await estimate.save();
    const estimateId = uuidv4(); // Generate a unique ID for the estimate
    const estimateUrl = `http://localhost:4242/api/estimates/${newEstimate._id}`;

    res.status(201).json({ estimateUrl });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Fetch an estimate by ID
router.get('/:id', async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id).populate({
      path: 'invoices',
      populate: { path: 'employeeId', select: 'name' }
    });
    if (!estimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }
    res.json(estimate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
