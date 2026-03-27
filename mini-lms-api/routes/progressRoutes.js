const express = require('express');
const router = express.Router();

const {
  getAllProgress,
  getCourseProgress,
  markLessonComplete,
} = require('../controllers/progressController');

// ✅ Get all progress for a user
router.get('/:userId', getAllProgress);

// ✅ Get course-specific progress
router.get('/:userId/:courseId', getCourseProgress);

// ✅ Mark lesson complete
router.post('/', markLessonComplete);

module.exports = router;