const Barber = require("../models/Barber");

exports.createBarber = async (req, res) => {
  const { name, description,email, specialty, image } = req.body;

  try {
    const barber = await Barber.create({ name,email, description, specialty, image });
    res.status(201).json(barber);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find();
    res.status(200).json(barbers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBarberById = async (req, res) => {
  const { id } = req.params;
  try {
    const barber = await Barber.findById(id);
    if (!barber) {
      return res.status(404).json({ error: "Barber not found" });
    }
    res.status(200).json(barber);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBarber = async (req, res) => {
  const { id } = req.params;
  try {
    const barber = await Barber.findByIdAndDelete(id);
    if (!barber) {
      return res.status(404).json({ error: "Barber not found" });
    }
    res.status(200).json({ message: "Barber deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
