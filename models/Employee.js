const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picture: String,
  phone: String,
  email: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff'],
    default: 'staff',
  },
  pay: {
    type: Number,
    required: true,
  },
  accessPoints: [{
    type: String,
    enum: ['employee_management', 'job_management', 'invoice_management'],
  }],
});

module.exports = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
