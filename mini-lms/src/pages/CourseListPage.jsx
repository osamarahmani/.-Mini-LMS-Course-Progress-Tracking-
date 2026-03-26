import { courses } from '../data/courses';
import CourseCard from '../components/CourseCard';

function CourseListPage({ progress }) {
  const { completedLessons, getProgress } = progress;

  const allLessons = courses.flatMap(c =>
    c.chapters.flatMap(ch => ch.lessons)
  );

  const totalLessons = allLessons.length;
  const totalCompleted = completedLessons.filter(id =>
    allLessons.map(l => l.id).includes(id)
  ).length;

  const overallPct = totalLessons > 0
    ? Math.round((totalCompleted / totalLessons) * 100)
    : 0;

  const completedCourses = courses.filter(course => {
    const lessons = course.chapters.flatMap(ch => ch.lessons);
    return getProgress(lessons) === 100;
  }).length;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-500 text-sm mt-1">
          Keep learning. You are doing great!
        </p>
      </div>

      <div className="p-8 max-w-6xl mx-auto">

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
            <p className="text-xs text-gray-400 mt-1">Total Courses</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-blue-500">{completedCourses}</p>
            <p className="text-xs text-gray-400 mt-1">Completed</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-800">{totalCompleted}/{totalLessons}</p>
            <p className="text-xs text-gray-400 mt-1">Lessons Done</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-green-500">{overallPct}%</p>
            <p className="text-xs text-gray-400 mt-1">Overall Progress</p>

            {/* Overall Progress Bar */}
            <div className="mt-2 bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>

        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              progress={progress}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

export default CourseListPage;