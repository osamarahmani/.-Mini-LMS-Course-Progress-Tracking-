import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from '../api';
import CourseCard from '../components/CourseCard';
import Navbar from '../components/Navbar';
import useProgress from '../hooks/useProgress';

function CourseListPage({ user, setUser }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';
  const progress = useProgress(user?._id);
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

  // ── ⏳ TIME ESTIMATOR LOGIC ────────────────────────────────
  // Estimates 5 mins for reading, 15 mins for quizzes
  const getTimeRemaining = (course) => {
    const remaining = (course.chapters || [])
      .flatMap(ch => ch.lessons || [])
      .filter(l => !completedLessons.includes(l._id));

    const totalMinutes = remaining.reduce((acc, lesson) => {
      return acc + (lesson.type === 'quiz' ? 15 : 5);
    }, 0);

    if (totalMinutes === 0) return "Completed";
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m} mins`;
  };

  // ── 🎯 RESUME LEARNING LOGIC ────────────────────────────────
  const resumeTarget = useMemo(() => {
    if (isAdmin || courses.length === 0) return null;

    const activeCourses = courses.filter(course => {
      const lessons = (course.chapters || []).flatMap(ch => ch.lessons || []);
      const pct = getProgress(lessons);
      return pct > 0 && pct < 100;
    });

    if (activeCourses.length === 0) return null;

    const targetCourse = activeCourses[0];
    const nextLesson = targetCourse.chapters
      .flatMap(ch => ch.lessons)
      .find(l => !completedLessons.includes(l._id));

    return nextLesson ? { course: targetCourse, lesson: nextLesson } : null;
  }, [courses, completedLessons, isAdmin, getProgress]);

  // ── Stats Calculation ──────────────────────────────────────
  const allLessons = courses.flatMap(c => (c.chapters || []).flatMap(ch => ch.lessons || []));
  const totalLessons = allLessons.length;
  const totalCompleted = completedLessons.filter(id => allLessons.some(l => l._id === id)).length;
  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  
  const completedCoursesCount = courses.filter(course => {
    const lessons = (course.chapters || []).flatMap(ch => ch.lessons || []);
    return getProgress(lessons) === 100;
  }).length;

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-amber-500 animate-spin" />
    </div>
  );

  const stats = [
    { value: courses.length, label: 'Total Courses', icon: '📚', color: 'text-stone-700', bg: 'bg-stone-50', border: 'border-stone-200' },
    { value: completedCoursesCount, label: 'Completed', icon: '🏆', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { value: `${totalCompleted}/${totalLessons}`, label: 'Lessons Done', icon: '🎬', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
    { value: `${overallPct}%`, label: 'Overall Progress', icon: '📈', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', progress: overallPct },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar user={user} setUser={setUser} />

      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-stone-900 tracking-tighter uppercase italic leading-none">
            {isAdmin ? 'Content Engine' : 'My Learning'}
          </h1>
          <p className="text-stone-400 text-xs font-bold mt-2 uppercase tracking-widest">
            {isAdmin ? 'System Preview • Admin Hub' : 'Personalized Dashboard • 2026 Academic Year'}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-12">

        {/* ── 🚀 HERO: RESUME LEARNING ─────────────────────────── */}
        {resumeTarget && !isAdmin && (
          <section className="relative overflow-hidden bg-stone-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-stone-800 group transition-all hover:border-amber-500/30">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-widest rounded-lg">
                    Continue Learning
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-[10px]">⌛</span>
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">
                      {getTimeRemaining(resumeTarget.course)} Remaining
                    </span>
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-tight max-w-xl">
                  {resumeTarget.lesson.title}
                </h2>
                
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                  {resumeTarget.course.title} • {getProgress((resumeTarget.course.chapters || []).flatMap(ch => ch.lessons || []))}% complete
                </p>
              </div>

              <button 
                onClick={() => navigate(`/lesson/${resumeTarget.lesson._id}`)}
                className="bg-white hover:bg-amber-500 text-stone-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 whitespace-nowrap"
              >
                Jump Back In →
              </button>
            </div>
          </section>
        )}

        {/* ── 💡 Stats Grid ── */}
        {!isAdmin && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(({ value, label, icon, color, bg, border, progress: prog }) => (
              <div key={label} className={`${bg} border ${border} rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all`}>
                <span className="text-2xl mb-3 block">{icon}</span>
                <p className={`text-2xl font-black ${color} leading-none tracking-tight`}>{value}</p>
                <p className="text-[10px] text-stone-400 font-black mt-2 uppercase tracking-widest">{label}</p>
                {prog !== undefined && (
                  <div className="mt-4 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${prog}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── 🛠️ Admin Preview Link ── */}
        {isAdmin && (
          <div className="bg-stone-900 rounded-[2.5rem] p-10 border border-stone-800 flex justify-between items-center shadow-xl">
            <div>
              <p className="text-amber-500 font-black text-xs uppercase tracking-[0.2em] mb-1">Central Command</p>
              <h2 className="text-white text-2xl font-black italic tracking-tight uppercase">Admin Preview Mode</h2>
            </div>
            <button 
              onClick={() => navigate('/admin')}
              className="bg-amber-500 hover:bg-white text-stone-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
              Open Admin Hub
            </button>
          </div>
        )}

        {/* ── Course Grid ── */}
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-stone-400 flex items-center gap-4">
            Available Modules <div className="h-[1px] bg-stone-200 flex-1" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course._id} className="space-y-3">
                <CourseCard
                  course={course}
                  progress={{ completedLessons, getProgress }}
                  isAdmin={isAdmin}
                />
                {!isAdmin && getProgress((course.chapters || []).flatMap(ch => ch.lessons || [])) < 100 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl shadow-sm">
                    <span className="text-[10px]">⌛</span>
                    <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest">
                      {getTimeRemaining(course)} to finish
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourseListPage;