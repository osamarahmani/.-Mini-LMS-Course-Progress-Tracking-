import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCourseById } from '../api';
import ChapterAccordion from '../components/ChapterAccordion';
import useProgress from '../hooks/useProgress';

function CourseDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // ── Loading State ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
          <p className="text-stone-400 text-sm tracking-wide font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  // ── Not Found State ────────────────────────────────────────────
  if (!course) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-4xl">📭</p>
          <p className="text-stone-500 font-medium">Course not found.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-3 text-sm text-amber-600 hover:text-amber-700 underline underline-offset-4"
          >
            Back to all courses
          </button>
        </div>
      </div>
    );
  }

  const allLessons = course.chapters.flatMap(ch => ch.lessons);
  const progressPct = getProgress(allLessons);
  const completedCount = completedLessons.filter(lid =>
    allLessons.map(l => l._id).includes(lid)
  ).length;

  const levelStyles = {
    Beginner:     'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Intermediate: 'bg-sky-50    text-sky-700    ring-1 ring-sky-200',
    Advanced:     'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  };

  return (
    <div className="min-h-screen bg-stone-50 font-[system-ui]">

      {/* ── Hero Header ─────────────────────────────────────────── */}
      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">

          {/* Back Link */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-amber-600 transition-colors duration-200 mb-6 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
            <span>Back to Courses</span>
          </button>

          {/* Title Row */}
          <div className="flex flex-wrap items-start gap-3 mb-2">
            <h1 className="text-3xl font-bold text-stone-800 leading-tight tracking-tight">
              {course.title}
            </h1>
            <span className={`mt-1 text-xs font-semibold px-3 py-1 rounded-full ${levelStyles[course.level] || levelStyles.Advanced}`}>
              {course.level}
            </span>
          </div>

          {/* Description */}
          <p className="text-stone-500 text-sm leading-relaxed max-w-2xl">
            {course.description}
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-5 mt-5 text-sm text-stone-400">
            {[
              { icon: '📚', label: `${course.chapters.length} chapters` },
              { icon: '🎬', label: `${allLessons.length} lessons` },
              { icon: '📝', label: `${allLessons.filter(l => l.type === 'quiz').length} quizzes` },
            ].map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <span>{icon}</span>
                <span className="font-medium text-stone-500">{label}</span>
              </span>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-xl">
            <div className="flex justify-between items-center text-xs text-stone-400 mb-2">
              <span>
                <span className="font-semibold text-stone-600">{completedCount}</span>
                {' '}of{' '}
                <span className="font-semibold text-stone-600">{allLessons.length}</span>
                {' '}lessons complete
              </span>
              <span className="font-bold text-amber-600 text-sm">{progressPct}%</span>
            </div>
            <div className="bg-stone-100 rounded-full h-2.5 w-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-4">

        {/* Completion Banner */}
        {progressPct === 100 && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 text-emerald-700 text-sm font-medium shadow-sm">
            <span className="text-xl">🎉</span>
            <div>
              <p className="font-semibold">Course Complete!</p>
              <p className="text-emerald-600 font-normal text-xs mt-0.5">
                You've finished all lessons in this course. Great work!
              </p>
            </div>
          </div>
        )}

        {/* Chapters */}
        <div className="space-y-3">
          {course.chapters.map((chapter, index) => (
            <div
              key={chapter._id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:border-amber-200 hover:shadow-md transition-all duration-200"
            >
              {/* Chapter number badge on the side */}
              <div className="flex">
                <div className="w-1 bg-gradient-to-b from-amber-400 to-amber-300 flex-shrink-0 rounded-l-2xl" />
                <div className="flex-1">
                  <ChapterAccordion
                    chapter={chapter}
                    completedLessons={completedLessons}
                    toggleLesson={toggleLesson}
                    courseId={course._id}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default CourseDetailPage;