const express = require('express');
const router = express.Router();

const {
  getAllProgress,
  markLessonComplete,
} = require('../controllers/progressController');

// ✅ Get all progress for a user
router.get('/:userId', getAllProgress);



// ✅ Mark lesson complete
router.post('/', markLessonComplete);

module.exports = router;