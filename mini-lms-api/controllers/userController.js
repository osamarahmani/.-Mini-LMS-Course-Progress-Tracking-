const User = require('../models/User');

// ✅ Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🏆 ADMIN ASSIGNMENT:
    // Replace 'your-email@example.com' with the email you want to use for Admin.
    const role = (email === "admin@gmail.com") ? "admin" : "student";

    const user = await User.create({ name, email, password, role });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // By finding the user, MongoDB now returns the 'role' field we added to the Schema
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // This returns the full user object (including .role) to your React app
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser };