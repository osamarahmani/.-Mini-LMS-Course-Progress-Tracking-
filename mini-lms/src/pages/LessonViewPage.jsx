import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchCourses } from '../api';
import QuizView from '../components/QuizView';
import useProgress from '../hooks/useProgress';
import Navbar from '../components/Navbar';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas'; 
import jsPDF from 'jspdf';
import Certificate from '../components/Certificate';

function LessonViewPage({ user, setUser }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef(null); // Initialized with null

  const isAdmin = user?.role === 'admin';
  const progress = useProgress(user?._id);
  const completedLessons = progress?.completedLessons || [];
  const markComplete = progress?.markComplete;

  const [foundLesson, setFoundLesson] = useState(null);
  const [foundChapter, setFoundChapter] = useState(null);
  const [foundCourse, setFoundCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

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

  // ── 🏆 COMPLETION & CELEBRATION ────────────────────────────
  const handleMarkComplete = async (lid, cid, gradeData = null) => {
    if (!markComplete || isAdmin) return;
    await markComplete(lid, cid, gradeData);

    const allLessonIds = (foundCourse.chapters || []).flatMap(ch => (ch.lessons || []).map(l => l._id));
    const isNowFinished = allLessonIds.every(id => id === lid || completedLessons.includes(id));

    if (isNowFinished) {
      setShowCelebration(true);
    }
  };

  // ── 🎓 CERTIFICATE GENERATION (Refined) ─────────────────────
  const downloadCertificate = async () => {
    const element = certificateRef.current;
    if (!element) {
      console.error("Certificate element not found");
      return;
    }

    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true, // Helps if you add images later
        logging: false 
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1000, 700]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 1000, 700);
      pdf.save(`${foundCourse.title}-Certificate.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
    </div>
  );

  if (!foundLesson || !foundCourse) return <div className="p-20 text-center text-stone-500 font-black uppercase tracking-widest text-xs">Lesson not found.</div>;

  const isCompleted = completedLessons.includes(foundLesson._id);
  const allLessons = (foundCourse.chapters || []).flatMap(ch => ch.lessons || []);
  const currentIndex = allLessons.findIndex(l => l._id === foundLesson._id);
  const prevLesson = allLessons[currentIndex - 1] || null;
  const nextLesson = allLessons[currentIndex + 1] || null;
  const isQuiz = foundLesson.type === 'quiz';

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {showCelebration && <Confetti recycle={false} numberOfPieces={500} gravity={0.1} />}
      
      {/* 📜 Certificate Template (Must be rendered in DOM to be captured) */}
      <Certificate ref={certificateRef} user={user} course={foundCourse} />
      
      <Navbar user={user} setUser={setUser} />

      <header className="bg-white border-b border-stone-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(`/course/${foundCourse._id}`)} className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-600 flex items-center gap-2 transition-all group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Exit {isQuiz ? 'Assessment' : 'Lesson'}
          </button>

          <div className="hidden md:flex flex-col items-center">
             <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">{foundCourse.title}</p>
             <div className="flex items-center gap-2 mt-1">
                <div className="w-32 h-1 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                   <div 
                    className="h-full bg-amber-500 transition-all duration-1000" 
                    style={{ width: `${Math.round(((currentIndex + 1) / allLessons.length) * 100)}%` }} 
                   />
                </div>
                <span className="text-[9px] font-black text-stone-900">{currentIndex + 1} / {allLessons.length}</span>
             </div>
          </div>

          {!isAdmin && isCompleted ? (
            <span className="text-[10px] font-black uppercase bg-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-emerald-500/20">✓ Verified</span>
          ) : isAdmin ? (
            <span className="text-[9px] font-black uppercase bg-stone-900 text-amber-500 px-3 py-1.5 rounded-lg tracking-widest">Admin Preview</span>
          ) : (
            <span className="text-[10px] font-black uppercase text-stone-300 tracking-widest italic">Not Attempted</span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 text-center md:text-left">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-3">{foundChapter.title}</p>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter uppercase italic leading-none">{foundLesson.title}</h1>
            <span className={`w-fit text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${isQuiz ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm' : 'bg-stone-50 text-stone-400 border-stone-200'}`}>
              {isQuiz ? 'Graded Quiz' : 'Theory Module'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl overflow-hidden transition-all duration-500">
          {!isQuiz ? (
            <div className="p-10 md:p-14">
              <div className="prose prose-stone max-w-none">
                <p className="text-stone-600 text-lg leading-8 whitespace-pre-line font-medium">{foundLesson.content}</p>
              </div>

              {!isAdmin && (
                <div className="mt-12 pt-8 border-t border-stone-100 flex justify-center">
                  {isCompleted ? (
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shadow-inner">✓</div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Module Complete</p>
                    </div>
                  ) : (
                    <button onClick={() => handleMarkComplete(foundLesson._id, foundCourse._id)} className="bg-stone-900 hover:bg-amber-500 text-white hover:text-stone-900 font-black text-xs uppercase tracking-widest px-10 py-5 rounded-2xl transition-all active:scale-95 shadow-2xl">
                      Mark as Complete
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 md:p-12">
               <QuizView
                quiz={foundLesson.quiz}
                lessonId={foundLesson._id}
                courseId={foundCourse._id}
                isCompleted={isCompleted}
                markComplete={(lid, cid, data) => handleMarkComplete(lid, cid, data)}
                isAdmin={isAdmin}
              />
            </div>
          )}
        </div>

        {/* --- NAVIGATION --- */}
        <div className="mt-12 grid grid-cols-2 gap-6">
          {prevLesson ? (
            <button onClick={() => navigate(`/lesson/${prevLesson._id}`)} className="group flex flex-col items-start p-6 bg-white border border-stone-200 rounded-[2rem] hover:border-amber-500 transition-all text-left shadow-sm hover:shadow-md">
              <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1 group-hover:text-amber-500">← Previous</span>
              <span className="text-xs font-black text-stone-700 uppercase tracking-tight">{prevLesson.title}</span>
            </button>
          ) : <div />}
          
          {nextLesson ? (
            <button onClick={() => navigate(`/lesson/${nextLesson._id}`)} className="group flex flex-col items-end p-6 bg-white border border-stone-200 rounded-[2rem] hover:border-amber-500 transition-all text-right shadow-sm hover:shadow-md">
              <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1 group-hover:text-amber-500">Next Module →</span>
              <span className="text-xs font-black text-stone-700 uppercase tracking-tight">{nextLesson.title}</span>
            </button>
          ) : (
            <button onClick={() => navigate(`/course/${foundCourse._id}`)} className="group flex flex-col items-end p-6 bg-stone-900 border border-stone-800 rounded-[2rem] hover:bg-amber-500 transition-all text-right shadow-xl">
              <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-1 group-hover:text-stone-900 italic">Finish Line</span>
              <span className="text-xs font-black text-white uppercase tracking-tight group-hover:text-stone-900">Return to Course Details</span>
            </button>
          )}
        </div>
      </main>

      {/* ── 🎊 SUCCESS MODAL ── */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/90 backdrop-blur-md p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-12 text-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-emerald-500 to-sky-500" />
             <div className="text-6xl mb-6">🏆</div>
             <h2 className="text-4xl font-black text-stone-900 tracking-tighter uppercase italic leading-none mb-4">You've Finished!</h2>
             <p className="text-stone-500 font-bold text-sm mb-10 leading-relaxed px-4">
               Module by module, you've completed <span className="text-stone-900">{foundCourse.title}</span>. Your mastery is recorded.
             </p>
             
             {/* 🎓 The Download Button (Check visibility here) */}
             <div className="space-y-4">
                <button 
                    onClick={downloadCertificate}
                    className="w-full bg-amber-500 text-stone-900 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all shadow-xl shadow-amber-500/20 active:scale-95 border-none cursor-pointer"
                >
                    📥 Download Certificate
                </button>

                <button 
                    onClick={() => navigate('/')}
                    className="w-full bg-stone-100 text-stone-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-200 transition-all border-none cursor-pointer"
                >
                    Back to Dashboard
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonViewPage;