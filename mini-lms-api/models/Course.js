const mongoose = require('mongoose');

// Quiz schema
const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options:  [{ type: String }],
  correct:  { type: Number, required: true },
});

// Lesson schema
const lessonSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  type:    { type: String, enum: ['video', 'reading', 'quiz'], required: true },
  content: { type: String },
  order:   { type: Number, required: true },
  quiz:    { type: quizSchema, default: null },
});

// Chapter schema
const chapterSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  order:   { type: Number, required: true },
  lessons: [lessonSchema],
});

// Course schema
const courseSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  level:       { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  chapters:    [chapterSchema],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);