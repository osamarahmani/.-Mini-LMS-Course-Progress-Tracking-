const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonId:    { type: String, required: true },
  completed:   { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
}, { timestamps: true });

// One progress record per user per lesson
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);