const mongoose = require('mongoose');

const jobHistorySchema = new mongoose.Schema({
  status: String,
  workStatus: String,
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  status: {
    type: String,
    enum: [
      'Needs Estimate Sent',
      'Estimate Sent Needs Approval',
      'Approved Estimate',
      'Schedule Job',
      'Job Scheduled',
      'Job Completed Need Invoiced',
      'Invoiced Needs Paid',
      'Paid',
    ],
    default: 'Needs Estimate Sent',
  },
  workStatus: {
    type: String,
    enum: [
      'Not Started',
      'In Progress',
      'Completed',
      'Need Review',
    ],
    default: 'Not Started',
  },
  notes: String,
  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedDate: {
    type: Date,
    default: Date.now,
  },
  statusHistory: [jobHistorySchema],
  workStatusHistory: [jobHistorySchema],
  workNotes: String,
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
});

module.exports = mongoose.model('Job', jobSchema);
