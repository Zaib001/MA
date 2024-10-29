const crypto = require('crypto');
const User = require('../models/User');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Generate a unique apiKey for the new user
    const apiKey = crypto.randomBytes(16).toString('hex');

    // Create and save the new user
    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      apiKey,
    });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createUser, getUserById };
