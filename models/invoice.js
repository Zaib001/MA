const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  hoursWorked: { type: Number, required: true },
  rate: { type: Number, required: true },
});

module.exports = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
