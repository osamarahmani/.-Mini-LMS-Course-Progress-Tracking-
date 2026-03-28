const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/authMiddleware'); // ✅ Import guard
const {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
} = require('../controllers/courseController');

// Public routes (Students & Admins)
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// 🔒 Protected routes (Only Admins)
router.post('/', verifyAdmin, createCourse); 
router.delete('/:id', verifyAdmin, deleteCourse);

module.exports = router;