const cron = require("node-cron");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Barber = require("../models/Barber");
exports.getMonthlyStats = async (req, res) => {
  try {
    const year = new Date().getFullYear(); // Get the current year

    const stats = await Appointment.aggregate([
      {
        // Match appointments for the current year
        $match: {
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        // Group by month and calculate totals
        $group: {
          _id: { $month: "$date" }, // Group by month (1 = Jan, 12 = Dec)
          totalAppointments: { $sum: 1 }, // Count total appointments
          totalEarnings: { $sum: "$totalAmount" }, // Sum earnings
        },
      },
      {
        // Sort by month in ascending order
        $sort: { _id: 1 },
      },
    ]);

    const formattedStats = Array.from({ length: 12 }, (_, index) => {
      const monthStat = stats.find((s) => s._id === index + 1);
      return {
        month: index + 1,
        totalAppointments: monthStat ? monthStat.totalAppointments : 0,
        totalEarnings: monthStat ? monthStat.totalEarnings : 0,
      };
    });

    res.status(200).json(formattedStats);
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { barber, services, user, date, time, totalAmount, paymentStatus } =
      req.body;

    if (
      !barber ||
      !services ||
      !date ||
      !time ||
      !totalAmount ||
      !paymentStatus
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingAppointment = await Appointment.findOne({
      barber,
      date: new Date(date),
      time,
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ error: "Time slot already booked for this barber." });
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
    console.log(newAppointment.user);

    await newAppointment.save();
    const userDetails = await User.findById(user);
    const barberDetails = await Barber.findById(barber);
    // const message = `Hi ${userDetails.firstName} ${userDetails.lastName}, your appointment with ${barberDetails.name} on ${date} at ${time} is confirmed!`;
    // Send SMS notification
    // await sendSMS(userDetails.phoneNumber, message);

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Find and update the appointment status to "completed"
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: status || "pending" }, // Update status, defaulting to "pending"
      { new: true } // Return the updated document
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res
      .status(200)
      .json({ message: "Appointment updated successfully.", appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
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

    res
      .status(200)
      .json({ message: "Appointment deleted and time slot released." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    const formattedDate = new Date(date).toISOString().split("T")[0];

    const existingAppointments = await Appointment.find({
      date: { $eq: new Date(formattedDate) },
    });

    const timeSlots = Array.from({ length: 12 }, (_, index) => {
      const hour = index + 1;
      const amTime = `${hour}:00 AM`;
      const pmTime = `${hour}:00 PM`;
      return [
        { time: amTime, hour: index },
        { time: pmTime, hour: index + 12 },
      ];
    }).flat();

    const bookedSlots = existingAppointments.map(
      (appointment) => appointment.time
    );
    const availableSlots = timeSlots.filter(
      (slot) => !bookedSlots.includes(slot.time)
    );

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
