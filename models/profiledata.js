const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  birthday: { type: Date, required: true },
  address: { type: String, required: true },
  occupation: { type: String },
  education: { type: String },
  gender: { type: String },
  maritalStatus: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
