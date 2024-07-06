const mongoose = require("mongoose");

const { Schema } = mongoose;

// ParentUser Schema
const parentUserSchema = new Schema(
    {
      token: { type: String, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

// Export both schemas
const ParentUserRefreshToken = mongoose.model("ParentUserRefreshToken", parentUserSchema, "Parenttokens");

module.exports = { ParentUserRefreshToken };
