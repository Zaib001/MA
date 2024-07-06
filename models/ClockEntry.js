const mongoose = require('mongoose');

const clockEntrySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  clockInTime: {
    type: Date,
    default: null,
  },
  clockOutTime: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ClockEntry', clockEntrySchema);
