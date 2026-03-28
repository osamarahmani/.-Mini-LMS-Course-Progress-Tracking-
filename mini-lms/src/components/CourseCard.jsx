import { useNavigate } from 'react-router-dom';

function CourseCard({ course, progress }) {
  const navigate = useNavigate();
  const { getProgress, completedLessons } = progress;

  const allLessons = course.chapters.flatMap(ch => ch.lessons);
  const progressPct = getProgress(allLessons);
  const completedCount = allLessons.filter(l =>
    completedLessons.includes(l._id)
  ).length;
  const isComplete = progressPct === 100;

  const levelStyles = {
    Beginner:     'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Intermediate: 'bg-sky-50    text-sky-700    ring-1 ring-sky-200',
    Advanced:     'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  };

  return (
    <div
      onClick={() => navigate(`/course/${course._id}`)}
      className="group bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-amber-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Amber left accent stripe */}
      <div className="flex h-full">
        <div className="w-1 bg-gradient-to-b from-amber-400 to-amber-300 flex-shrink-0" />

        <div className="flex-1 p-5">

          {/* Level badge + completion badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelStyles[course.level] || levelStyles.Advanced}`}>
              {course.level}
            </span>
            {isComplete && (
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2.5 py-1 rounded-full">
                ✓ Done
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-base font-bold text-stone-800 leading-snug group-hover:text-amber-700 transition-colors duration-150">
            {course.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-stone-400 mt-1.5 leading-relaxed line-clamp-2">
            {course.description}
          </p>

          {/* Meta row */}
          <div className="mt-4 flex items-center justify-between text-xs text-stone-400 font-medium">
            <span>{course.chapters.length} chapters</span>
            <span>{completedCount}/{allLessons.length} lessons</span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
                isComplete
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Progress label */}
          <p className={`text-xs mt-1.5 font-semibold ${isComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
            {progressPct}% complete
          </p>

        </div>
      </div>
    </div>
  );
}

export default CourseCard;