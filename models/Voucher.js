const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // e.g., 10% discount
  expirationDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
