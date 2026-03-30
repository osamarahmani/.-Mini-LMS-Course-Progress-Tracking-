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

  // ── Calculation Logic ──────────────────────────────────────────
  const allLessons = courses.flatMap(c => (c.chapters || []).flatMap(ch => ch.lessons || []));
  const totalLessons = allLessons.length;
  const totalCompleted = completedLessons.filter(id => allLessons.some(l => l._id === id)).length;
  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

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

  // ── Styles ────────────────────────────────────────────────────
  const cardStyle = "bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm transition-all hover:shadow-md";
  const labelStyle = "text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1";

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <Navbar user={user} setUser={setUser} />

      {/* ── Header Section ──────────────────────────────────────── */}
      <header className="bg-stone-900 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Large Avatar */}
          <div className="w-32 h-32 rounded-[2.5rem] bg-amber-500 flex items-center justify-center shadow-2xl rotate-3 transform transition-transform hover:rotate-0">
            <span className="text-stone-900 text-5xl font-black italic">{initials}</span>
          </div>

          <div className="text-center md:text-left">
            <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Verified Learner</p>
            <h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none mb-2">
              {user.name}
            </h1>
            <p className="text-stone-400 font-bold text-sm uppercase tracking-widest">{user.email}</p>
          </div>

          {/* Overall Stats Pill */}
          <div className="md:ml-auto bg-stone-800/50 backdrop-blur-md border border-stone-700 p-6 rounded-[2rem] flex items-center gap-6">
            <div className="text-center">
              <p className="text-stone-500 text-[9px] font-black uppercase tracking-widest">Global Progress</p>
              <p className="text-amber-400 text-3xl font-black italic">{overallPct}%</p>
            </div>
            <div className="w-[1px] h-10 bg-stone-700" />
            <div className="text-center">
              <p className="text-stone-500 text-[9px] font-black uppercase tracking-widest">Role</p>
              <p className="text-white text-sm font-black uppercase tracking-widest mt-1">{user.role || 'Student'}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">
        
        {/* ── Left Column: Quick Stats ─────────────────────────── */}
        <div className="lg:col-span-1 space-y-6">
          <div className={cardStyle}>
            <h3 className="text-stone-900 font-black uppercase italic tracking-tight mb-6">Learning Metrics</h3>
            <div className="space-y-6">
              {[
                { label: 'Courses Enrolled', value: courses.length, icon: '📚' },
                { label: 'Courses Finished', value: completedCourses.length, icon: '🏆' },
                { label: 'Lessons Mastered', value: totalCompleted, icon: '⚡' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div>
                    <p className={labelStyle}>{stat.label}</p>
                    <p className="text-2xl font-black text-stone-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Badge */}
          <div className="bg-amber-500 p-8 rounded-[2rem] shadow-xl shadow-amber-500/20 text-stone-900">
             <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Next Milestone</p>
             <h4 className="text-xl font-black uppercase italic leading-tight">Master {totalLessons - totalCompleted} more lessons to level up</h4>
             <div className="mt-4 bg-stone-900/10 h-2 rounded-full overflow-hidden">
                <div className="bg-stone-900 h-full transition-all duration-1000" style={{ width: `${overallPct}%` }} />
             </div>
          </div>
        </div>

        {/* ── Right Column: Courses ────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* In Progress Section */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-black text-stone-900 uppercase italic tracking-tighter">Continuing Education</h2>
              <div className="h-[1px] flex-1 bg-stone-200" />
            </div>

            {inProgressCourses.length === 0 ? (
              <div className="bg-stone-100/50 border-2 border-dashed border-stone-200 rounded-[2rem] p-10 text-center">
                <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">No active courses. Ready for something new?</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {inProgressCourses.map(course => {
                  const lessons = (course.chapters || []).flatMap(ch => ch.lessons || []);
                  const pct = getProgress(lessons);
                  return (
                    <div 
                      key={course._id}
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="group flex flex-col md:flex-row items-center gap-6 bg-white border border-stone-200 p-6 rounded-[2rem] hover:border-amber-500 hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div className="w-full md:w-40 h-24 bg-stone-100 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center text-3xl">
                        💡
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <p className="text-amber-600 text-[9px] font-black uppercase tracking-[0.2em] mb-1">{course.level}</p>
                        <h4 className="text-lg font-black text-stone-900 uppercase italic leading-tight group-hover:text-amber-600 transition-colors">{course.title}</h4>
                        <div className="mt-4 bg-stone-100 h-1.5 rounded-full w-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black italic text-stone-900">{pct}%</p>
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Complete</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Finished Section */}
          <section>
             <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-black text-stone-900 uppercase italic tracking-tighter">Accomplishments</h2>
              <div className="h-[1px] flex-1 bg-stone-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {completedCourses.map(course => (
                <div 
                  key={course._id}
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="bg-white border border-stone-200 p-6 rounded-[2rem] group hover:border-stone-900 transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg shadow-sm">✓</div>
                    <span className="text-[9px] font-black bg-stone-100 text-stone-500 px-3 py-1 rounded-full uppercase tracking-widest">{course.level}</span>
                  </div>
                  <h4 className="text-sm font-black text-stone-900 uppercase italic group-hover:text-amber-600 transition-colors">{course.title}</h4>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-2 underline decoration-amber-400/50 underline-offset-4">Certificate Ready</p>
                </div>
              ))}
              {completedCourses.length === 0 && (
                 <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest py-4">Your achievements will appear here.</p>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default UserProfilePage; 