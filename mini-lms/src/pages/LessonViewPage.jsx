import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCourses } from '../api';
import QuizView from '../components/QuizView';
import useProgress from '../hooks/useProgress';
import Navbar from '../components/Navbar'; // ✅ ADD

function LessonViewPage({ user, setUser }) { // ✅ FIX props
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const progress = useProgress(user._id);
  const completedLessons = progress?.completedLessons || [];
  const markComplete = progress?.markComplete;

  const [foundLesson, setFoundLesson] = useState(null);
  const [foundChapter, setFoundChapter] = useState(null);
  const [foundCourse, setFoundCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses().then(courses => {
      let found = false;

      for (const course of courses || []) {
        for (const chapter of course.chapters || []) {
          const lesson = (chapter.lessons || []).find(
            l => l._id === lessonId
          );

          if (lesson) {
            setFoundLesson(lesson);
            setFoundChapter(chapter);
            setFoundCourse(course);
            found = true;
            break;
          }
        }
        if (found) break;
      }

      setLoading(false);
    });
  }, [lessonId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading lesson...</p>
      </div>
    );
  }

  if (!foundLesson || !foundCourse) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Lesson not found.</p>
      </div>
    );
  }

  const isCompleted = completedLessons.includes(foundLesson._id);

  const allLessons = (foundCourse.chapters || []).flatMap(
    ch => ch.lessons || []
  );

  const currentIndex = allLessons.findIndex(
    l => l._id === foundLesson._id
  );

  const prevLesson = allLessons[currentIndex - 1] || null;
  const nextLesson = allLessons[currentIndex + 1] || null;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ✅ NAVBAR */}
      <Navbar user={user} setUser={setUser} />

      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(`/course/${foundCourse._id}`)}
          className="text-sm text-blue-500 hover:underline"
        >
          ← Back to {foundCourse.title}
        </button>

        {isCompleted && (
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
            ✓ Completed
          </span>
        )}
      </div>

      <div className="max-w-3xl mx-auto p-8">
        <p className="text-sm text-gray-400 mb-2">
          {foundCourse.title} → {foundChapter.title}
        </p>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {foundLesson.title}
        </h1>

        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            foundLesson.type === 'quiz'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {foundLesson.type}
        </span>

        {foundLesson.type !== 'quiz' && (
          <div className="mt-6 bg-white rounded-xl border p-6">
            <p className="text-gray-700 text-sm leading-7 whitespace-pre-line">
              {foundLesson.content}
            </p>

            <div className="mt-6 pt-4 border-t">
              {isCompleted ? (
                <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                  ✓ Lesson completed
                </div>
              ) : (
                <button
                  onClick={() =>
                    markComplete?.(foundLesson._id, foundCourse._id)
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        )}

        {foundLesson.type === 'quiz' && (
          <div className="mt-6">
            <QuizView
              quiz={foundLesson.quiz}
              lessonId={foundLesson._id}
              courseId={foundCourse._id}
              isCompleted={isCompleted}
              markComplete={markComplete}
            />
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {prevLesson ? (
            <button
              onClick={() => navigate(`/lesson/${prevLesson._id}`)}
              className="text-sm text-blue-500 hover:underline"
            >
              ← {prevLesson.title}
            </button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <button
              onClick={() => navigate(`/lesson/${nextLesson._id}`)}
              className="text-sm text-blue-500 hover:underline"
            >
              {nextLesson.title} →
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonViewPage;