import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from '../api';
import Navbar from '../components/Navbar';
import useProgress from '../hooks/useProgress';

function UserProfilePage({ user, setUser }) {
  const navigate = useNavigate();
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
  const overallPct = totalLessons > 0
    ? Math.round((totalCompleted / totalLessons) * 100)
    : 0;

  const completedCourses = courses.filter(course => {
    const lessons = (course.chapters || []).flatMap(ch => ch.lessons || []);
    return lessons.length > 0 && getProgress(lessons) === 100;
  });

  const inProgressCourses = courses.filter(course => {
    const lessons = (course.chapters || []).flatMap(ch => ch.lessons || []);
    const pct = getProgress(lessons);
    return pct > 0 && pct < 100;
  });

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Member';

  const levelStyles = {
    Beginner:     'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Intermediate: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    Advanced:     'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  };

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar user={user} setUser={setUser} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
            <p className="text-stone-400 text-sm font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar user={user} setUser={setUser} />

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div className="bg-stone-900 relative overflow-hidden">
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-end gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center shadow-xl flex-shrink-0">
            <span className="text-white text-3xl font-bold">{initials}</span>
          </div>

          {/* Identity */}
          <div className="flex-1">
            <p className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase mb-1">
              Learner Profile
            </p>
            <h1 className="text-white text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-stone-400 text-sm mt-1">{user.email}</p>
          </div>

          {/* Overall progress ring — decorative */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="26" fill="none"
                  stroke="#f59e0b" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - overallPct / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                {overallPct}%
              </span>
            </div>
            <p className="text-stone-500 text-xs font-medium">Overall</p>
          </div>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* ── Stats Row ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '📚', label: 'Enrolled',    value: courses.length,            color: 'text-stone-700',   bg: 'bg-white',       border: 'border-stone-200' },
            { icon: '🏆', label: 'Completed',   value: completedCourses.length,   color: 'text-amber-600',   bg: 'bg-amber-50',    border: 'border-amber-200' },
            { icon: '⚡', label: 'In Progress', value: inProgressCourses.length,  color: 'text-sky-600',     bg: 'bg-sky-50',      border: 'border-sky-200' },
            { icon: '🎬', label: 'Lessons Done', value: `${totalCompleted}/${totalLessons}`, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          ].map(({ icon, label, value, color, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-4 shadow-sm`}>
              <span className="text-xl">{icon}</span>
              <p className={`text-2xl font-bold ${color} mt-2 leading-none`}>{value}</p>
              <p className="text-xs text-stone-400 font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Account Details ───────────────────────────────────── */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex">
            <div className="w-1 bg-gradient-to-b from-amber-400 to-amber-300 flex-shrink-0" />
            <div className="flex-1 p-6">
              <h2 className="text-sm font-bold text-stone-800 uppercase tracking-widest mb-5">
                Account Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name',  value: user.name },
                  { label: 'Email',      value: user.email },
                  { label: 'Member Since', value: joinDate },
                  { label: 'Role',       value: user.role || 'Student' },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-1">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{label}</p>
                    <p className="text-sm font-semibold text-stone-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Completed Courses ─────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-800 uppercase tracking-widest">
              Completed Courses
            </h2>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2.5 py-1 rounded-full">
              {completedCourses.length} done
            </span>
          </div>

          {completedCourses.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center shadow-sm">
              <p className="text-3xl mb-3">🎯</p>
              <p className="text-stone-500 font-medium text-sm">No completed courses yet.</p>
              <p className="text-stone-400 text-xs mt-1">Keep going — you're making progress!</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 text-xs font-semibold text-amber-600 hover:text-amber-700 underline underline-offset-4 transition-colors"
              >
                Browse courses →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedCourses.map(course => {
                const lessons = (course.chapters || []).flatMap(ch => ch.lessons || []);
                return (
                  <div
                    key={course._id}
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="group bg-white border border-stone-200 hover:border-amber-200 hover:shadow-md rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow-sm"
                  >
                    <div className="flex h-full">
                      <div className="w-1 bg-gradient-to-b from-emerald-400 to-emerald-300 flex-shrink-0" />
                      <div className="flex-1 p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${levelStyles[course.level] || levelStyles.Advanced}`}>
                            {course.level}
                          </span>
                          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2.5 py-0.5 rounded-full">
                            ✓ Done
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-stone-800 group-hover:text-amber-700 transition-colors duration-150 leading-snug mt-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs text-stone-400 font-medium">
                          <span>{course.chapters?.length} chapters</span>
                          <span>{lessons.length} lessons</span>
                        </div>
                        {/* Full green bar */}
                        <div className="mt-2 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── In Progress Courses ───────────────────────────────── */}
        {inProgressCourses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-stone-800 uppercase tracking-widest">
                In Progress
              </h2>
              <span className="text-xs font-semibold bg-sky-50 text-sky-700 ring-1 ring-sky-200 px-2.5 py-1 rounded-full">
                {inProgressCourses.length} active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressCourses.map(course => {
                const lessons = (course.chapters || []).flatMap(ch => ch.lessons || []);
                const pct = getProgress(lessons);
                const done = completedLessons.filter(id => lessons.some(l => l._id === id)).length;

                return (
                  <div
                    key={course._id}
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="group bg-white border border-stone-200 hover:border-amber-200 hover:shadow-md rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow-sm"
                  >
                    <div className="flex h-full">
                      <div className="w-1 bg-gradient-to-b from-amber-400 to-amber-300 flex-shrink-0" />
                      <div className="flex-1 p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${levelStyles[course.level] || levelStyles.Advanced}`}>
                            {course.level}
                          </span>
                          <span className="text-xs font-bold text-amber-600">{pct}%</span>
                        </div>
                        <h3 className="text-sm font-bold text-stone-800 group-hover:text-amber-700 transition-colors duration-150 leading-snug mt-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs text-stone-400 font-medium">
                          <span>{done}/{lessons.length} lessons</span>
                          <span>{course.chapters?.length} chapters</span>
                        </div>
                        <div className="mt-2 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default UserProfilePage;