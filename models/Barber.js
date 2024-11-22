const mongoose = require("mongoose");

const barberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  description: { type: String, required: true },
  image: { type: String },
  specialty: { type: String, required: true },
  status: { type: String, enum: ["Available", "Unavailable"], default: "Available" },
  availability: [
    {
      day: String, 
      times: [String],
    }
  ],
});

module.exports = mongoose.model("Barber", barberSchema);
