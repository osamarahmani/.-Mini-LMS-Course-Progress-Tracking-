import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChapterAccordion({ chapter, completedLessons, toggleLesson, courseId }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const completedCount = chapter.lessons.filter(l =>
    completedLessons.includes(l._id)
  ).length;
  const allDone = completedCount === chapter.lessons.length;

  return (
    <div>
      {/* ── Accordion Header ──────────────────────────────────── */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-5 py-4 bg-stone-50 hover:bg-amber-50/50 cursor-pointer transition-colors duration-150 group"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-2.5 py-0.5 rounded-full">
            Chapter
          </span>
          <h3 className="font-semibold text-stone-700 group-hover:text-stone-900 transition-colors duration-150 text-sm">
            {chapter.title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress count */}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            allDone
              ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
              : 'text-stone-400'
          }`}>
            {completedCount}/{chapter.lessons.length}
          </span>

          {/* Chevron */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* ── Lesson List ───────────────────────────────────────── */}
      {isOpen && (
        <div>
          {chapter.lessons.map((lesson, index) => {
            const done = completedLessons.includes(lesson._id);
            const isQuiz = lesson.type === 'quiz';

            return (
              <div
                key={lesson._id}
                className="flex items-center gap-4 px-5 py-3 border-t border-stone-100 hover:bg-stone-50 transition-colors duration-150 group/row"
              >
                {/* Completion toggle */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLesson(lesson._id, courseId);
                  }}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200
                    ${done
                      ? 'bg-emerald-500 border-emerald-500 shadow-sm'
                      : 'border-stone-300 hover:border-amber-400'}`}
                >
                  {done && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>

                {/* Lesson title */}
                <div
                  onClick={() => navigate(`/lesson/${lesson._id}`)}
                  className="flex-1 cursor-pointer"
                >
                  <p className={`text-sm font-medium transition-colors duration-150 ${
                    done
                      ? 'text-stone-300 line-through'
                      : 'text-stone-600 group-hover/row:text-stone-900'
                  }`}>
                    {lesson.title}
                  </p>
                </div>

                {/* Type badge */}
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ring-1 ${
                  isQuiz
                    ? 'bg-amber-50 text-amber-700 ring-amber-200'
                    : 'bg-stone-50 text-stone-400 ring-stone-200'
                }`}>
                  {isQuiz ? '📝 Quiz' : '🎬 Lesson'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ChapterAccordion;