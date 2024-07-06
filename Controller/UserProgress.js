const Appointment = require("../models/appoitment");
const Profile = require("../models/profiledata");

const Oppintment = {
  async UserOppintment(req, res, next) {
    const { date, time, user, customerName, customerPhone, customerEmail, customerNotes, customerAddress } = req.body;

    if (!date || !time || !user || !customerName || !customerPhone || !customerEmail || !customerAddress) {
      return res.status(400).json({ error: "Date, time, user, customer name, customer phone, and customer email are required." });
    }

    try {
      // Check if an appointment already exists for the given date, time, and user
      const existingAppointment = await Appointment.findOne({ date, time, user });

      if (existingAppointment) {
        return res.status(400).json({ error: "Appointment already exists for this date, time, and user." });
      }

      // If no existing appointment, create and save the new appointment
      const newAppointment = new Appointment({ date, time, user, customerName, customerPhone, customerEmail, customerNotes,customerAddress });
      await newAppointment.save();

      res.status(201).json(newAppointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: error.message || "Internal server error." });
    }
  },

  async getUserAppointmentById(req, res, next) {
    try {
      const userId = req.params.userId;
      const appointments = await Appointment.find({ user: userId });
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error." });
    }
  },

  async profiledata(req, res, next) {
    try {
      const { fullname, email, birthday, address, occupation, education, gender, maritalStatus, user } = req.body;

      const profile = new Profile({ fullname, email, birthday, address, occupation, education, gender, maritalStatus, user });

      const savedProfile = await profile.save();

      res.status(201).json(savedProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = Oppintment;
