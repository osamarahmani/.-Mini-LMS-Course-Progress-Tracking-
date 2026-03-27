import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChapterAccordion({ chapter, completedLessons, toggleLesson, courseId }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const completedCount = chapter.lessons.filter(l =>
    completedLessons.includes(l._id)
  ).length;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-5 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            Chapter
          </span>
          <h3 className="font-semibold text-gray-800">{chapter.title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {completedCount}/{chapter.lessons.length}
          </span>
          <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>

      {isOpen && (
        <div>
          {chapter.lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="flex items-center gap-4 px-5 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLesson(lesson._id, courseId);
                }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer
                  ${completedLessons.includes(lesson._id)
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-blue-400'}`}
              >
                {completedLessons.includes(lesson._id) && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>
              <div
                onClick={() => navigate(`/lesson/${lesson._id}`)}
                className="flex-1 cursor-pointer"
              >
                <p className={`text-sm ${completedLessons.includes(lesson._id)
                  ? 'text-gray-400 line-through'
                  : 'text-gray-700'}`}>
                  {lesson.title}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium
                ${lesson.type === 'quiz'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-500'}`}>
                {lesson.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChapterAccordion;