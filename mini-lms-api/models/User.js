const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    default: 'student' 
  },
  
  // ── 🔑 Password Recovery ────────────────────────────────────
  resetToken: { 
    type: String, 
    default: null 
  },
  resetTokenExpiry: { 
    type: Date, 
    default: null 
  },

  // ── 📊 Quiz Grades Array ────────────────────────────────────
  quizGrades: [{
    lessonId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Lesson' 
    },
    courseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course' 
    },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 1 },
    percentage: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now }
  }],

  // ── 🎓 Progress Tracking ────────────────────────────────────
  completedLessons: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lesson' 
  }]

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);