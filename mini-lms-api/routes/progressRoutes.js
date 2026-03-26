const express = require('express');
const router = express.Router();
const {
  getCourseProgress,
  markLessonComplete,
  getAllProgress,
} = require('../controllers/progressController');

router.get('/:userId',              getAllProgress);
router.get('/:userId/:courseId',    getCourseProgress);
router.post('/',                    markLessonComplete);

module.exports = router;