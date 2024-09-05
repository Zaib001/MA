const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  barber: { type: mongoose.Schema.Types.ObjectId, ref: "Barber", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }],
  date: { type: Date, required: true },
  time: { type: String, required: true },
  totalAmount : { type: Number, required: true },
  paymentStatus: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
