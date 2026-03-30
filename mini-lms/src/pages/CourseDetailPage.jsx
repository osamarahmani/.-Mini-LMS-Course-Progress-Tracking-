import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'; // Added useRef
import { fetchCourseById } from '../api';
import ChapterAccordion from '../components/ChapterAccordion';
import useProgress from '../hooks/useProgress';
import html2canvas from 'html2canvas'; // 👈 npm install html2canvas jspdf
import jsPDF from 'jspdf';
import Certificate from '../components/Certificate';

function CourseDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef(null); // Ref for the certificate snapshot

  const isAdmin = user?.role === 'admin';
  const progress = useProgress(user?._id);
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

  // ── 🎓 CERTIFICATE GENERATION ──────────────────────────────
  const downloadCertificate = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1000, 700]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 1000, 700);
      pdf.save(`${course.title}-Mastery-Certificate.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    }
  };

  // ── ⏳ TIME ESTIMATOR LOGIC ─────────────────────────────────
  const getTimeLeft = () => {
    if (!course) return null;
    const remaining = course.chapters
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

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
        <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Accessing Syllabus...</p>
      </div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">👻</p>
        <p className="text-stone-500 font-black uppercase text-xs tracking-widest">Course not found.</p>
        <button onClick={() => navigate('/')} className="mt-6 text-xs font-black uppercase tracking-widest text-amber-600 hover:text-stone-900 transition-colors">Return to Library</button>
      </div>
    </div>
  );

  const allLessons = course.chapters.flatMap(ch => ch.lessons || []);
  const progressPct = getProgress(allLessons);
  const completedCount = completedLessons.filter(lid => allLessons.map(l => l._id).includes(lid)).length;

  const levelStyles = {
    Beginner:     'bg-emerald-50 text-emerald-700 border-emerald-100',
    Intermediate: 'bg-sky-50    text-sky-700    border-sky-100',
    Advanced:     'bg-violet-50 text-violet-700 border-violet-100',
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* 📜 The Hidden Template (Positioned off-screen) */}
      <Certificate ref={certificateRef} user={user} course={course} />

      {/* ── Hero Header ─────────────────────────────────────────── */}
      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-12">
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-600 transition-all mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`text-[9px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${levelStyles[course.level] || levelStyles.Advanced}`}>
                  {course.level}
                </span>
                {!isAdmin && progressPct < 100 && (
                  <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100 uppercase tracking-widest">
                    ⌛ {getTimeLeft()} Remaining
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-black text-stone-900 tracking-tighter uppercase italic leading-none">
                {course.title}
              </h1>
              <p className="text-stone-500 text-sm font-medium leading-relaxed max-w-xl">
                {course.description}
              </p>
            </div>
            
            <div className="flex gap-4 text-center">
               <div className="bg-stone-50 border border-stone-100 px-5 py-3 rounded-2xl">
                  <p className="text-xl font-black text-stone-900">{allLessons.length}</p>
                  <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Lessons</p>
               </div>
               <div className="bg-stone-50 border border-stone-100 px-5 py-3 rounded-2xl">
                  <p className="text-xl font-black text-stone-900">{course.chapters.length}</p>
                  <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Chapters</p>
               </div>
            </div>
          </div>

          {!isAdmin && (
            <div className="mt-10 max-w-2xl">
              <div className="flex justify-between items-end mb-3">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Progress: <span className="text-stone-900">{completedCount} / {allLessons.length} Finished</span>
                </p>
                <p className="text-sm font-black text-amber-600">{progressPct}%</p>
              </div>
              <div className="bg-stone-100 rounded-full h-2 w-full overflow-hidden shadow-inner">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {isAdmin && (
            <button 
              onClick={() => navigate('/admin')}
              className="mt-8 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-amber-500 hover:text-stone-900 transition-all shadow-lg active:scale-95"
            >
              ⚙️ Manage Content
            </button>
          )}
        </div>
      </header>

      {/* ── Syllabus Section ───────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        
        {/* ── 🏆 PERMANENT DOWNLOAD SECTION (Outside Modal) ────────── */}
        {!isAdmin && progressPct === 100 && (
          <section className="bg-white border-2 border-amber-500 rounded-[2.5rem] p-10 shadow-xl shadow-amber-500/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-9xl opacity-5 pointer-events-none select-none">🎓</div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">🏆</div>
              <div>
                <h3 className="text-xl font-black text-stone-900 uppercase italic tracking-tighter">Course Mastered</h3>
                <p className="text-stone-500 text-[11px] font-bold uppercase tracking-widest mt-1">Your official documentation is ready.</p>
              </div>
            </div>

            <button 
              onClick={downloadCertificate}
              className="bg-stone-900 hover:bg-amber-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-2xl flex items-center gap-3 group relative z-10"
            >
              <span className="group-hover:translate-y-0.5 transition-transform italic">📥</span>
              Download Certificate
            </button>
          </section>
        )}

        <div className="flex items-center gap-4 mb-4">
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-stone-400">Course Syllabus</h2>
           <div className="h-[1px] bg-stone-200 flex-1" />
        </div>

        <div className="space-y-4">
          {course.chapters.map((chapter) => (
            <div key={chapter._id} className="group">
              <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden hover:border-amber-200 hover:shadow-md transition-all">
                <ChapterAccordion
                  chapter={chapter}
                  completedLessons={completedLessons}
                  toggleLesson={toggleLesson}
                  courseId={course._id}
                  isAdmin={isAdmin}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default CourseDetailPage;