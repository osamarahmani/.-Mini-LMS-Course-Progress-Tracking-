const Progress = require('../models/Progress');

// GET /api/progress/:userId/:courseId — get progress for a course
const getCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const progress = await Progress.find({ userId, courseId });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/progress — mark a lesson complete
const markLessonComplete = async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.body;

    // Find existing or create new progress record
    let progress = await Progress.findOne({ userId, lessonId });

    if (progress) {
      // Toggle complete/incomplete
      progress.completed = !progress.completed;
      progress.completedAt = progress.completed ? new Date() : null;
      await progress.save();
    } else {
      // Create new progress record
      progress = await Progress.create({
        userId,
        courseId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      });
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/progress/:userId — get all progress for a user
const getAllProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progress.find({ userId, completed: true });

    // Return just the lessonIds array
    const completedLessonIds = progress.map(p => p.lessonId);
    res.json(completedLessonIds);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getCourseProgress, markLessonComplete, getAllProgress };