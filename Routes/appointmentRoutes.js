const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updatePaymentStatus,
  deleteAppointment,
  getAvailableSlots,
  getMonthlyStats,
  updateAppointment
} = require("../controllers/appointmentController");

// Create a new appointment
router.post("/", createAppointment);

// Get all appointments
router.get("/", getAppointments);

// Update payment status of a specific appointment
router.put("/:id/payment-status", updatePaymentStatus);

// Delete a specific appointment
router.delete("/:id", deleteAppointment);
router.put("/:id", updateAppointment);
// Get available time slots for a given date
router.get("/slots", getAvailableSlots);
router.get('/stats', getMonthlyStats);

module.exports = router;
