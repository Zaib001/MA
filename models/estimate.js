const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
  companyInfo: {
    name: { type: String, required: true },
    website: { type: String, required: true },
    logo: { type: String, required: true },
  },
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true }],
});

module.exports = mongoose.models.Estimate || mongoose.model('Estimate', estimateSchema);
