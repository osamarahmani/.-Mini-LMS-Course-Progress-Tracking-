const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
} = require('../controllers/courseController');

router.get('/',      getAllCourses);
router.get('/:id',   getCourseById);
router.post('/',     createCourse);
router.delete('/:id',deleteCourse);

module.exports = router;