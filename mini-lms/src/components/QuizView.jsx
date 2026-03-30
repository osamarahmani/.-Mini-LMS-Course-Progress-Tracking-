import { useState, useEffect } from 'react';

function QuizView({ quiz, lessonId, courseId, isCompleted, markComplete, isAdmin }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // ── 🛡️ STATE LOCK ──────────────────────────────────────────
  // If the lesson is already completed, we set submitted to true 
  // ONLY if we want to show the results immediately.
  useEffect(() => {
    if (isCompleted && !isAdmin) {
      setSubmitted(true);
      setSelected(quiz.correct); // Show the correct path by default
    }
  }, [isCompleted, isAdmin, quiz.correct]);

  const isCorrect = selected === quiz.correct;

  const handleSubmit = () => {
    if (selected === null || isAdmin) return;
    
    setSubmitted(true);

    const gradeData = {
      lessonId,
      courseId,
      score: isCorrect ? 1 : 0,
      totalQuestions: 1,
      percentage: isCorrect ? 100 : 0,
      completedAt: new Date()
    };

    // ✅ Only records progress if the answer is 100% right
    if (isCorrect) {
      markComplete(lessonId, courseId, gradeData);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setSubmitted(false);
  };

  const getOptionStyle = (index) => {
    if (isAdmin && showAnswer) {
      return index === quiz.correct 
        ? 'border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100 shadow-sm'
        : 'border-stone-100 text-stone-300 opacity-40';
    }

    if (!submitted) {
      return selected === index
        ? 'border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-100 shadow-md'
        : 'border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-sm';
    }
    
    // Success/Failure colors after submission
    if (index === quiz.correct)
      return 'border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100 shadow-sm';
    if (index === selected && !isCorrect)
      return 'border-red-400 bg-red-50 text-red-700 ring-2 ring-red-100';
    
    return 'border-stone-100 text-stone-300 cursor-default grayscale-[50%]';
  };

  return (
    <div className="space-y-8">
      {/* 🛡️ Admin Header Tool */}
      {isAdmin && (
        <div className="flex items-center justify-between bg-stone-900 px-5 py-3 rounded-[1.5rem] shadow-xl border border-stone-800">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
             <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Curriculum Preview</span>
          </div>
          <button 
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-[9px] bg-white text-stone-900 px-4 py-1.5 rounded-xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all active:scale-95 shadow-lg"
          >
            {showAnswer ? 'Hide Solution' : 'Reveal Solution'}
          </button>
        </div>
      )}

      {/* Question */}
      <div className="space-y-3 px-2">
        <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
           <span className="w-4 h-[1px] bg-stone-200" /> Assessment Module
        </p>
        <h2 className="text-stone-900 font-black text-2xl md:text-3xl tracking-tighter uppercase italic leading-[1.1]">
          {quiz.question}
        </h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4">
        {quiz.options.map((option, index) => (
          <div
            key={index}
            onClick={() => !submitted && !isAdmin && setSelected(index)}
            className={`flex items-center gap-4 px-6 py-5 rounded-[2rem] border transition-all duration-300 ${getOptionStyle(index)} 
              ${!submitted && !isAdmin ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'}`}
          >
            <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500
              ${(selected === index || (isAdmin && showAnswer && index === quiz.correct)) 
                ? 'bg-stone-900 border-stone-900 rotate-[360deg]' 
                : 'border-stone-200 bg-stone-50'}`}
            >
                {(selected === index || (isAdmin && showAnswer && index === quiz.correct)) && (
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                )}
            </div>
            
            <span className="text-sm font-black uppercase tracking-tight">{option}</span>

            {(submitted || (isAdmin && showAnswer)) && index === quiz.correct && (
              <span className="ml-auto bg-emerald-500 text-white w-6 h-6 flex items-center justify-center rounded-xl text-[10px] font-black shadow-lg shadow-emerald-500/30">✓</span>
            )}
          </div>
        ))}
      </div>

      {/* --- Action Area --- */}
      <div className="pt-6 border-t border-stone-100 px-2">
        {isAdmin ? (
          <p className="text-stone-400 text-[10px] italic font-black uppercase tracking-[0.1em]">Admin mode: No student data will be overwritten.</p>
        ) : (
          <>
            {!submitted ? (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <button
                  onClick={handleSubmit}
                  disabled={selected === null}
                  className="w-full sm:w-auto bg-stone-900 hover:bg-amber-500 hover:text-stone-900 disabled:opacity-20 text-white text-[10px] font-black uppercase tracking-widest px-10 py-5 rounded-2xl transition-all shadow-2xl active:scale-95 shadow-stone-900/20"
                >
                  Submit Final Answer
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-8 rounded-[2.5rem] border flex flex-col md:flex-row items-center gap-6 transition-all duration-1000 ${isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                  <span className="text-5xl">{isCorrect ? '🎯' : '🚧'}</span>
                  <div className="text-center md:text-left">
                    <p className="text-lg font-black uppercase italic tracking-tighter">
                      {isCorrect ? 'Result: 100%' : 'Result: 0%'}
                    </p>
                    <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-1">
                      {isCorrect ? 'Mastery verified. This module is complete.' : 'Validation failed. Review materials and retry.'}
                    </p>
                  </div>
                </div>
                {!isCorrect && (
                  <button onClick={handleRetry} className="group text-stone-400 hover:text-stone-900 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
                    <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span> Retry Assessment
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── FOOTNOTE ── */}
      {isCompleted && !isAdmin && (
        <div className="bg-stone-50 border border-stone-100 p-5 rounded-[1.5rem] flex items-center justify-center gap-3">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
           <span className="text-stone-400 text-[9px] font-black uppercase tracking-[0.2em]">Verified: Student has passed this module</span>
        </div>
      )}
    </div>
  );
}

export default QuizView;