import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCourseById } from '../api';
import ChapterAccordion from '../components/ChapterAccordion';
import useProgress from '../hooks/useProgress'; // ✅ ADD THIS

function CourseDetailPage({ user }) { // ✅ receive user
  const { id } = useParams(); // ✅ match route param
  const navigate = useNavigate();

  // ✅ FIX: get progress from hook
  const progress = useProgress(user._id);

  const completedLessons = progress?.completedLessons || [];
  const toggleLesson = progress?.toggleLesson;
  const getProgress = progress?.getProgress || (() => 0);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseById(id).then(data => {
      setCourse(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Course not found.</p>
      </div>
    );
  }

  const allLessons = course.chapters.flatMap(ch => ch.lessons);
  const progressPct = getProgress(allLessons);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-blue-500 hover:underline mb-3 block"
        >
          ← Back to Courses
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full
            ${course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
              course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'}`}>
            {course.level}
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{course.description}</p>
        <div className="mt-4 max-w-lg">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>
              {completedLessons.filter(id =>
                allLessons.map(l => l._id).includes(id)
              ).length} of {allLessons.length} lessons complete
            </span>
            <span className="font-medium text-blue-600">{progressPct}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2 w-full">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <div className="flex gap-6 mt-4 text-sm text-gray-400">
          <span>{course.chapters.length} chapters</span>
          <span>{allLessons.length} lessons</span>
          <span>{allLessons.filter(l => l.type === 'quiz').length} quizzes</span>
        </div>
      </div>

      <div className="p-8 max-w-3xl mx-auto">
        {progressPct === 100 && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-green-700 font-medium text-sm">
            🎉 You have completed this course!
          </div>
        )}
        {course.chapters.map(chapter => (
          <ChapterAccordion
  key={chapter._id}
  chapter={chapter}
  completedLessons={completedLessons}
  toggleLesson={toggleLesson}
  courseId={course._id} // ✅ ADD
/>
        ))}
      </div>
    </div>
  );
}

export default CourseDetailPage;