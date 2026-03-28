import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCourses } from '../api';
import QuizView from '../components/QuizView';
import useProgress from '../hooks/useProgress';
import Navbar from '../components/Navbar';

function LessonViewPage({ user, setUser }) {
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
          const lesson = (chapter.lessons || []).find(l => l._id === lessonId);
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

  // ── Loading State ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
          <p className="text-stone-400 text-sm tracking-wide font-medium">
            Loading lesson...
          </p>
        </div>
      </div>
    );
  }

  // ── Not Found State ────────────────────────────────────────────
  if (!foundLesson || !foundCourse) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-4xl">📭</p>
          <p className="text-stone-500 font-medium">Lesson not found.</p>
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

  const isCompleted = completedLessons.includes(foundLesson._id);

  const allLessons = (foundCourse.chapters || []).flatMap(ch => ch.lessons || []);
  const currentIndex = allLessons.findIndex(l => l._id === foundLesson._id);
  const prevLesson = allLessons[currentIndex - 1] || null;
  const nextLesson = allLessons[currentIndex + 1] || null;

  const isQuiz = foundLesson.type === 'quiz';

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar user={user} setUser={setUser} />

      {/* ── Sub-header ──────────────────────────────────────────── */}
      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/course/${foundCourse._id}`)}
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-amber-600 transition-colors duration-200 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
            <span>Back to {foundCourse.title}</span>
          </button>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-1 rounded-full">
              ✓ Completed
            </span>
          )}
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <p className="text-xs text-stone-400 font-medium mb-3 flex items-center gap-1.5">
          <span>{foundCourse.title}</span>
          <span className="text-stone-300">›</span>
          <span>{foundChapter.title}</span>
        </p>

        {/* Lesson Title + Type Badge */}
        <div className="flex flex-wrap items-start gap-3 mb-6">
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight leading-tight">
            {foundLesson.title}
          </h1>
          <span
            className={`mt-1 text-xs font-semibold px-3 py-1 rounded-full ring-1 ${
              isQuiz
                ? 'bg-amber-50 text-amber-700 ring-amber-200'
                : 'bg-sky-50 text-sky-700 ring-sky-200'
            }`}
          >
            {isQuiz ? '📝 Quiz' : '🎬 Lesson'}
          </span>
        </div>

        {/* ── Lesson Content ────────────────────────────────────── */}
        {!isQuiz && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            {/* Amber left-accent stripe */}
            <div className="flex">
              <div className="w-1 bg-gradient-to-b from-amber-400 to-amber-300 flex-shrink-0" />
              <div className="flex-1 p-6">
                <p className="text-stone-600 text-sm leading-7 whitespace-pre-line">
                  {foundLesson.content}
                </p>

                <div className="mt-6 pt-5 border-t border-stone-100">
                  {isCompleted ? (
                    <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm bg-emerald-50 px-4 py-2 rounded-xl ring-1 ring-emerald-200">
                      ✓ Lesson completed
                    </div>
                  ) : (
                    <button
                      onClick={() => markComplete?.(foundLesson._id, foundCourse._id)}
                      className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all duration-200"
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Quiz Content ──────────────────────────────────────── */}
        {isQuiz && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="flex">
              <div className="w-1 bg-gradient-to-b from-amber-400 to-amber-300 flex-shrink-0" />
              <div className="flex-1 p-6">
                <QuizView
                  quiz={foundLesson.quiz}
                  lessonId={foundLesson._id}
                  courseId={foundCourse._id}
                  isCompleted={isCompleted}
                  markComplete={markComplete}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Prev / Next Navigation ────────────────────────────── */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {prevLesson ? (
            <button
              onClick={() => navigate(`/lesson/${prevLesson._id}`)}
              className="group flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 bg-white border border-stone-200 hover:border-amber-200 px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 max-w-[45%]"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200 flex-shrink-0">←</span>
              <span className="truncate">{prevLesson.title}</span>
            </button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <button
              onClick={() => navigate(`/lesson/${nextLesson._id}`)}
              className="group flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 bg-white border border-stone-200 hover:border-amber-200 px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 max-w-[45%] ml-auto"
            >
              <span className="truncate">{nextLesson.title}</span>
              <span className="group-hover:translate-x-0.5 transition-transform duration-200 flex-shrink-0">→</span>
            </button>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}

export default LessonViewPage;