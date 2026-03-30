const User = require('../models/User');

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const role = (email === "admin@gmail.com") ? "admin" : "student";
    const user = await User.create({ name, email, password, role });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── 🔑 FORGOT PASSWORD: Direct Verification & Token Generation ──
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Check if user exists
    const user = await User.findOne({ email });
    
    // 🎯 If NOT found, send 404 so frontend shows "User does not exist"
    if (!user) {
      return res.status(404).json({ message: "User does not exist. Please register first." });
    }

    // 2. Generate token for the immediate redirect
    const resetToken = Math.random().toString(36).substring(2, 15);
    
    // 3. Save to DB with 1-hour expiry
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; 
    await user.save();

    // 4. Return token to frontend so it can navigate automatically
    res.status(200).json({ 
      message: "User verified successfully!", 
      token: resetToken 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during verification." });
  }
};

// ── 🔄 RESET PASSWORD: Final Database Update ──────────────────
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ 
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired session. Please try again." });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully. You can now login." });
  } catch (err) {
    res.status(500).json({ message: "Failed to update password." });
  }
};

// ── 🚀 Progress & Grading Logic ──────────────────────────────
const updateProgress = async (req, res) => {
  try {
    const { userId, lessonId, courseId, gradeData } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId);
    }

    if (gradeData) {
      user.quizGrades.push({
        lessonId: gradeData.lessonId,
        courseId: gradeData.courseId,
        score: gradeData.score,
        totalQuestions: gradeData.totalQuestions,
        percentage: gradeData.percentage,
        completedAt: new Date()
      });
    }

    await user.save();
    res.status(200).json({ message: "Progress synced", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to sync progress" });
  }
};

const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.completedLessons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress" });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  updateProgress, 
  getProgress,
  forgotPassword,
  resetPassword
};