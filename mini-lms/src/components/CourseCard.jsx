import { useNavigate } from 'react-router-dom';

function CourseCard({ course, progress }) {
  const navigate = useNavigate();
  const { getProgress, completedLessons } = progress;

  const allLessons = course.chapters.flatMap(ch => ch.lessons);
  const progressPct = getProgress(allLessons);
  const completedCount = allLessons.filter(l =>
    completedLessons.includes(l._id)
  ).length;

  return (
    <div
      onClick={() => navigate(`/course/${course._id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      <span className={`text-xs font-semibold px-3 py-1 rounded-full
        ${course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
          course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
          'bg-purple-100 text-purple-700'}`}>
        {course.level}
      </span>
      <h2 className="text-lg font-bold text-gray-800 mt-3">{course.title}</h2>
      <p className="text-sm text-gray-500 mt-1">{course.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <span>{course.chapters.length} chapters</span>
        <span>{completedCount}/{allLessons.length} lessons</span>
      </div>
      <div className="mt-3 bg-gray-100 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">{progressPct}% complete</p>
    </div>
  );
}

export default CourseCard;