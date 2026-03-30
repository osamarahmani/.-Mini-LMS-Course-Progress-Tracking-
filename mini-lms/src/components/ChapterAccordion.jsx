import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChapterAccordion({ chapter, completedLessons, toggleLesson, courseId, isAdmin }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const lessons = chapter.lessons || [];
  const completedCount = lessons.filter(l => completedLessons.includes(l._id)).length;
  const allDone = lessons.length > 0 && completedCount === lessons.length;

  return (
    <div className="overflow-hidden bg-white">
      {/* ── Accordion Header ── */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-6 py-5 cursor-pointer transition-all duration-300 group ${
          isOpen ? 'bg-stone-50/50' : 'bg-white hover:bg-stone-50'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
            allDone 
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'bg-stone-100 border-stone-200 text-stone-400 group-hover:border-amber-500 group-hover:text-amber-600'
          }`}>
            {allDone ? <span className="text-xs font-bold">✓</span> : <span className="text-xs font-black">#</span>}
          </div>
          
          <div>
            <h3 className={`font-black uppercase italic tracking-tight text-sm transition-colors ${
              isOpen ? 'text-stone-900' : 'text-stone-600'
            }`}>
              {chapter.title}
            </h3>
            {!isAdmin && (
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                {completedCount} of {lessons.length} Modules Finished
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
             </svg>
          </div>
        </div>
      </div>

      {/* ── Lesson List ── */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="pb-4 px-6 space-y-2">
          {lessons.map((lesson) => {
            const done = !isAdmin && completedLessons.includes(lesson._id);
            const isQuiz = lesson.type === 'quiz';

            return (
              <div
                key={lesson._id}
                onClick={() => navigate(`/lesson/${lesson._id}`)} // Row click always works
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all duration-200 group/row cursor-pointer ${
                  done 
                    ? 'bg-stone-50 border-stone-100 opacity-60' 
                    : 'bg-white border-stone-100 hover:border-amber-200 hover:shadow-sm'
                }`}
              >
                {/* 💡 FIXED CHECKBOX SYSTEM */}
                {!isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents navigate() from firing
                      
                      // ❌ BLOCK TOGGLE IF IT'S A QUIZ
                      // Quizzes can only be completed by passing them in LessonViewPage
                      if (isQuiz) return; 
                      
                      toggleLesson(lesson._id, courseId);
                    }}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      done
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                        : isQuiz 
                          ? 'border-amber-200 bg-amber-50/50 cursor-default' // Distinct look for locked quiz
                          : 'border-stone-200 bg-stone-50 hover:border-amber-500'
                    }`}
                  >
                    {done && <span className="text-[10px] font-black">✓</span>}
                  </button>
                )}

                {/* Lesson title */}
                <div className="flex-1">
                  <p className={`text-xs font-bold uppercase tracking-tight transition-colors ${
                    done ? 'text-stone-400' : 'text-stone-700 group-hover/row:text-stone-900'
                  }`}>
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${
                       isQuiz ? 'text-amber-600' : 'text-stone-400'
                     }`}>
                       {isQuiz ? 'Graded Quiz' : 'Standard Lesson'}
                     </span>
                     <span className="text-stone-200 text-[8px]">•</span>
                     <span className="text-[8px] font-black text-stone-300 uppercase">
                       {isQuiz ? '15 mins' : '5 mins'}
                     </span>
                  </div>
                </div>

                <button 
                  className="opacity-0 group-hover/row:opacity-100 transition-opacity text-[9px] font-black uppercase tracking-widest text-amber-600 hover:text-stone-900"
                >
                  {isQuiz && !done ? 'Attend →' : 'Launch →'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChapterAccordion;