import { useState } from 'react';

function QuizView({ quiz, lessonId, courseId, isCompleted, markComplete }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === quiz.correct;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (isCorrect) markComplete(lessonId, courseId);
  };

  const handleRetry = () => {
    setSelected(null);
    setSubmitted(false);
  };

  const getOptionStyle = (index) => {
    if (!submitted) {
      return selected === index
        ? 'border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-100'
        : 'border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50/50';
    }
    if (index === quiz.correct)
      return 'border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100';
    if (index === selected && !isCorrect)
      return 'border-red-400 bg-red-50 text-red-700 ring-2 ring-red-100';
    return 'border-stone-100 text-stone-300 cursor-default';
  };

  const getRadioStyle = (index) => {
    if (!submitted) {
      return selected === index
        ? 'border-amber-500 bg-amber-500'
        : 'border-stone-300';
    }
    if (index === quiz.correct) return 'border-emerald-500 bg-emerald-500';
    if (index === selected && !isCorrect) return 'border-red-400 bg-red-400';
    return 'border-stone-200';
  };

  return (
    <div className="space-y-5">

      {/* Question */}
      <p className="text-stone-800 font-semibold text-base leading-relaxed">
        {quiz.question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {quiz.options.map((option, index) => (
          <div
            key={index}
            onClick={() => !submitted && setSelected(index)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150 ${getOptionStyle(index)}`}
          >
            {/* Radio dot */}
            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-150 ${getRadioStyle(index)}`} />
            <span className="text-sm font-medium">{option}</span>

            {/* Result icon */}
            {submitted && index === quiz.correct && (
              <span className="ml-auto text-emerald-500 text-sm">✓</span>
            )}
            {submitted && index === selected && !isCorrect && index !== quiz.correct && (
              <span className="ml-auto text-red-400 text-sm">✗</span>
            )}
          </div>
        ))}
      </div>

      {/* Feedback Banner */}
      {submitted && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
          isCorrect
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          <span>{isCorrect ? '🎉' : '❌'}</span>
          <span>{isCorrect ? 'Correct! Lesson marked as complete.' : 'Incorrect. Give it another try!'}</span>
        </div>
      )}

      {/* Already Passed Banner */}
      {isCompleted && !submitted && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
          <span>✓</span>
          <span>You already passed this quiz.</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-1">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all duration-200"
          >
            Submit Answer
          </button>
        )}
        {submitted && !isCorrect && (
          <button
            onClick={handleRetry}
            className="bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-600 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200"
          >
            Try Again
          </button>
        )}
      </div>

    </div>
  );
}

export default QuizView;