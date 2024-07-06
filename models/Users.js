const mongoose = require("mongoose");

// Define the schema
const UsersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

// Create the model
const UserSchema = mongoose.model("User", UsersSchema, "Users");

module.exports = UserSchema;
