import { useState, useEffect } from 'react';
import { fetchProgress, markLessonComplete } from '../api';

function useProgress(userId) {
  const [completedLessons, setCompletedLessons] = useState([]);

  // ✅ Load progress safely
  useEffect(() => {
    if (!userId) {
      setCompletedLessons([]);
      return;
    }
    fetchProgress(userId).then(data => {
      // Ensure we are only storing IDs
      setCompletedLessons(Array.isArray(data) ? data : []);
    });
  }, [userId]);

  // ✅ Mark lesson complete (Now accepts optional gradeData)
  const markComplete = async (lessonId, courseId, gradeData = null) => {
    // If it's already done, don't trigger again
    if (completedLessons.includes(lessonId)) return;

    // Optimistic Update
    setCompletedLessons(prev => [...prev, lessonId]);

    try {
      await markLessonComplete(userId, courseId, lessonId, gradeData);
    } catch (err) {
      console.error("❌ markComplete error:", err);
      // Rollback on failure
      setCompletedLessons(prev => prev.filter(id => id !== lessonId));
    }
  };

  // ✅ Toggle lesson (Fixed Logic)
  const toggleLesson = async (lessonId, courseId) => {
    const isCurrentlyDone = completedLessons.includes(lessonId);
    
    // 1. Update UI Optimistically
    if (isCurrentlyDone) {
      setCompletedLessons(prev => prev.filter(id => id !== lessonId));
    } else {
      setCompletedLessons(prev => [...prev, lessonId]);
    }

    try {
      // 2. Sync with Backend
      // NOTE: If your backend doesn't support "un-marking", 
      // you might need a separate deleteProgress API call here.
      await markLessonComplete(userId, courseId, lessonId, null); 
    } catch (err) {
      console.error("❌ toggleLesson error:", err);
      // Rollback UI to previous state on error
      if (isCurrentlyDone) {
        setCompletedLessons(prev => [...prev, lessonId]);
      } else {
        setCompletedLessons(prev => prev.filter(id => id !== lessonId));
      }
    }
  };

  // ✅ Calculate progress safely
  const getProgress = (lessons) => {
    if (!Array.isArray(lessons) || lessons.length === 0) return 0;

    const lessonIds = lessons.map(l => l._id);
    const done = lessonIds.filter(id => completedLessons.includes(id)).length;

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