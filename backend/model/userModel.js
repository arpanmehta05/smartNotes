const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false, // changed from true to false
      trim: true,
    },
    lastName: {
      type: String,
      required: false, // changed from true to false
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // Not required for Google-only users
    },
    authProvider: {
      type: String,
      enum: ["manual", "google"],
      default: "manual",
    },
    googleId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
