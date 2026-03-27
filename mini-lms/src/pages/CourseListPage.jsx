import { useState, useEffect } from 'react';
import { fetchCourses } from '../api';
import CourseCard from '../components/CourseCard';
import Navbar from '../components/Navbar'; // ✅ ADD
import useProgress from '../hooks/useProgress'; // ✅ ADD

function CourseListPage({ user, setUser }) { // ✅ FIX props
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: get progress properly
  const progress = useProgress(user._id);

  const completedLessons = progress?.completedLessons || [];
  const getProgress = progress?.getProgress || (() => 0);

  useEffect(() => {
    fetchCourses()
      .then(data => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setCourses([]);
        setLoading(false);
      });
  }, []);

  const allLessons = courses.flatMap(c =>
    (c.chapters || []).flatMap(ch => ch.lessons || [])
  );

  const totalLessons = allLessons.length;

  const totalCompleted = completedLessons.filter(id =>
    allLessons.some(l => l._id === id)
  ).length;

  const overallPct =
    totalLessons > 0
      ? Math.round((totalCompleted / totalLessons) * 100)
      : 0;

  const completedCourses = courses.filter(course => {
    const lessons = (course.chapters || []).flatMap(ch => ch.lessons || []);
    return getProgress(lessons) === 100;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ✅ ADD NAVBAR */}
      <Navbar user={user} setUser={setUser} />

      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-500 text-sm mt-1">
          Keep learning. You are doing great!
        </p>
      </div>

      <div className="p-8 max-w-6xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold">{courses.length}</p>
            <p className="text-xs text-gray-400">Total Courses</p>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-blue-500">
              {completedCourses}
            </p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold">
              {totalCompleted}/{totalLessons}
            </p>
            <p className="text-xs text-gray-400">Lessons Done</p>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-green-500">
              {overallPct}%
            </p>
            <p className="text-xs text-gray-400">Overall Progress</p>

            <div className="mt-2 bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard
              key={course._id}
              course={course}
              progress={{
                completedLessons,
                getProgress
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseListPage;