const cron = require('node-cron');
const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
  try {
    const { barber, services,user, date, time, totalAmount, paymentStatus } = req.body;

    if (!barber || !services || !date || !time || !totalAmount || !paymentStatus) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingAppointment = await Appointment.findOne({
      barber,
      date: new Date(date),
      time,
    });

    if (existingAppointment) {
      return res.status(400).json({ error: "Time slot already booked for this barber." });
    }

    const newAppointment = new Appointment({
      barber,
      services,
      user,
      date: new Date(date),
      time,
      totalAmount,
      paymentStatus,
    });

    await newAppointment.save();

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("barber")
      .populate("services");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res.status(200).json({ message: "Appointment deleted and time slot released." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    const formattedDate = new Date(date).toISOString().split('T')[0];

    const existingAppointments = await Appointment.find({
      date: { $eq: new Date(formattedDate) }
    });

    const timeSlots = Array.from({ length: 12 }, (_, index) => {
      const hour = index + 1;
      const amTime = `${hour}:00 AM`;
      const pmTime = `${hour}:00 PM`;
      return [
        { time: amTime, hour: index },
        { time: pmTime, hour: index + 12 }
      ];
    }).flat();

    const bookedSlots = existingAppointments.map(appointment => appointment.time);
    const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot.time));

    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const passedAppointments = await Appointment.find({ date: { $lt: now } });

    for (const appointment of passedAppointments) {
      await Appointment.findByIdAndDelete(appointment._id);
    }

    console.log("Released time slots for passed appointments.");
  } catch (error) {
    console.error("Error releasing time slots:", error);
  }
});
