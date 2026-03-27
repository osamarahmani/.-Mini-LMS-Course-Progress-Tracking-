import { useState, useEffect } from 'react';
import { fetchProgress, markLessonComplete } from '../api';

function useProgress(userId) {
  const [completedLessons, setCompletedLessons] = useState([]);

  // ✅ Load progress safely
  useEffect(() => {
  if (!userId) return;

  fetchProgress(userId).then(data => {
    setCompletedLessons(Array.isArray(data) ? data : []);
  });
}, [userId]);

  // ✅ Mark lesson complete
  const markComplete = async (lessonId, courseId) => {
    if (completedLessons.includes(lessonId)) return;

    const updated = [...completedLessons, lessonId];
    setCompletedLessons(updated);

    try {
      await markLessonComplete(userId, courseId, lessonId);
    } catch (err) {
      console.error("❌ markComplete error:", err);
    }
  };

  // ✅ Toggle lesson
  const toggleLesson = async (lessonId, courseId) => {
    try {
      if (completedLessons.includes(lessonId)) {
        const updated = completedLessons.filter(id => id !== lessonId);
        setCompletedLessons(updated);
        await markLessonComplete(userId, courseId, lessonId);
      } else {
        await markComplete(lessonId, courseId);
      }
    } catch (err) {
      console.error("❌ toggleLesson error:", err);
    }
  };

  // ✅ Calculate progress safely
  const getProgress = (lessons) => {
    if (!Array.isArray(lessons) || lessons.length === 0) return 0;

    const done = lessons.filter(l =>
      completedLessons.includes(l._id)
    ).length;

    return Math.round((done / lessons.length) * 100);
  };

  return {
    completedLessons,
    markComplete,
    toggleLesson,
    getProgress,
  };
}

export default useProgress;