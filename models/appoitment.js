const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerNotes: { type: String },
  customerAddress: { type: String },
  assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Reference to the Employee model
});

const Appoitment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appoitment;
