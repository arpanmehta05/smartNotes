const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required." });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match." });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "User already exists." });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      authProvider: "manual",
    });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({ token, user: { firstName, lastName, email } });
  } catch (err) {
    res.status(500).json({ message: "Signup failed.", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required." });
    const user = await User.findOne({ email });
    if (!user || user.authProvider !== "manual")
      return res.status(401).json({ message: "Invalid credentials." });
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials." });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};

// Set password for Google users
exports.setPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required." });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match." });
    const user = await User.findOne({ email });
    if (!user || user.authProvider !== "google")
      return res.status(404).json({ message: "Google user not found." });
    if (user.password)
      return res.status(400).json({ message: "Password already set." });
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.authProvider = "manual"; // Now user can login manually too
    await user.save();
    res.status(200).json({ message: "Password set successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to set password.", error: err.message });
  }
};

// Update googleAuth to return needsPassword flag
exports.googleAuth = async (req, res) => {
  try {
    const { email, firstName, lastName, googleId } = req.body;
    if (!email || !googleId)
      return res.status(400).json({ message: "Missing Google user info." });
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstName: firstName || "",
        lastName: lastName || "",
        email,
        authProvider: "google",
        googleId,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = "google";
      await user.save();
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    const needsPassword = !user.password;
    res.json({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      needsPassword,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Google Auth failed.", error: err.message });
  }
};
