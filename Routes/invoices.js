const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const Employee = require('../models/Employee');

// Fetch all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('employeeId', 'name');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new invoice
router.post('/create', async (req, res) => {
  const { employeeId, hoursWorked, rate } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const invoice = new Invoice({
      employeeId,
      hoursWorked,
      rate,
    });

    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Fetch an invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('employeeId', 'name');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an invoice
router.put('/:id', async (req, res) => {
  const { hoursWorked, rate } = req.body;

  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (hoursWorked !== undefined) invoice.hoursWorked = hoursWorked;
    if (rate !== undefined) invoice.rate = rate;

    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await invoice.remove();
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
