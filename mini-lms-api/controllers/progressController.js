const mongoose = require('mongoose');
const Progress = require('../models/Progress');

// ✅ GET ALL PROGRESS
const getAllProgress = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const progress = await Progress.find({ userId });

    const completedLessons = progress
      .filter(p => p.completed)
      .map(p => p.lessonId.toString());

    res.json(completedLessons);

  } catch (err) {
    console.error(err);
    res.json([]);
  }
};


// ✅ MARK COMPLETE
const markLessonComplete = async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.body;

    if (!userId || !lessonId || !courseId) {
      return res.status(400).json({ message: "Missing data" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    let progress = await Progress.findOne({
      userId: userObjectId,
      lessonId: lessonId.toString(),
    });

    if (progress) {
      progress.completed = !progress.completed;
      await progress.save();
    } else {
      progress = await Progress.create({
        userId: userObjectId,
        courseId,
        lessonId: lessonId.toString(),
        completed: true,
      });
    }

    res.json(progress);

  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllProgress, markLessonComplete};