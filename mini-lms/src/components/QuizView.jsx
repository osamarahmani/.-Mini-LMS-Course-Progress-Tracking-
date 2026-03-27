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

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
        <h3 className="text-sm font-semibold text-amber-700">Quiz</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-800 font-medium mb-5">{quiz.question}</p>
        <div className="flex flex-col gap-3">
          {quiz.options.map((option, index) => {
            let style = "border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50";
            if (submitted) {
              if (index === quiz.correct) style = "border-green-400 bg-green-50 text-green-700";
              else if (index === selected && !isCorrect) style = "border-red-400 bg-red-50 text-red-700";
              else style = "border-gray-200 text-gray-400";
            } else if (selected === index) {
              style = "border-blue-400 bg-blue-50 text-blue-700";
            }
            return (
              <div
                key={index}
                onClick={() => !submitted && setSelected(index)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${style}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0
                  ${selected === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                />
                <span className="text-sm">{option}</span>
              </div>
            );
          })}
        </div>
        {submitted && (
          <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium
            ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {isCorrect ? '🎉 Correct! Lesson marked as complete.' : '❌ Incorrect. Try again.'}
          </div>
        )}
        {isCompleted && !submitted && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
            ✓ You already passed this quiz.
          </div>
        )}
        <div className="mt-5 flex gap-3">
          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Submit Answer
            </button>
          )}
          {submitted && !isCorrect && (
            <button
              onClick={handleRetry}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizView;