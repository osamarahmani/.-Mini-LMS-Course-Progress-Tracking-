import { useState, useEffect } from 'react';
import { fetchCourses } from '../api';
import CourseCard from '../components/CourseCard';
import Navbar from '../components/Navbar';
import useProgress from '../hooks/useProgress';

function CourseListPage({ user, setUser }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const progress = useProgress(user._id);
  const completedLessons = progress?.completedLessons || [];
  const getProgress = progress?.getProgress || (() => 0);

  useEffect(() => {
    fetchCourses()
      .then(data => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setCourses([]);
        setLoading(false);
      });
  }, []);

  const allLessons = courses.flatMap(c =>
    (c.chapters || []).flatMap(ch => ch.lessons || [])
  );
  const totalLessons = allLessons.length;
  const totalCompleted = completedLessons.filter(id =>
    allLessons.some(l => l._id === id)
  ).length;
  const overallPct =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  const completedCourses = courses.filter(course => {
    const lessons = (course.chapters || []).flatMap(ch => ch.lessons || []);
    return getProgress(lessons) === 100;
  }).length;

  // ── Loading State ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
          <p className="text-stone-400 text-sm tracking-wide font-medium">
            Loading courses...
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      value: courses.length,
      label: 'Total Courses',
      icon: '📚',
      color: 'text-stone-700',
      bg: 'bg-stone-50',
      border: 'border-stone-200',
    },
    {
      value: completedCourses,
      label: 'Completed',
      icon: '🏆',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      value: `${totalCompleted}/${totalLessons}`,
      label: 'Lessons Done',
      icon: '🎬',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
    },
    {
      value: `${overallPct}%`,
      label: 'Overall Progress',
      icon: '📈',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      progress: overallPct,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar user={user} setUser={setUser} />

      {/* ── Page Header ─────────────────────────────────────────── */}
      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
            My Courses
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Keep learning — you're doing great!
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── Stats Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ value, label, icon, color, bg, border, progress: prog }) => (
            <div
              key={label}
              className={`${bg} border ${border} rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{icon}</span>
              </div>
              <p className={`text-2xl font-bold ${color} leading-none`}>{value}</p>
              <p className="text-xs text-stone-400 font-medium mt-1">{label}</p>
              {prog !== undefined && (
                <div className="mt-3 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${prog}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Course Grid ───────────────────────────────────────── */}
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="text-5xl">🎒</span>
            <p className="text-stone-500 font-medium">No courses available yet.</p>
            <p className="text-stone-400 text-sm">Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                progress={{ completedLessons, getProgress }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CourseListPage;