import { useParams, useNavigate } from 'react-router-dom';
import { courses } from '../data/courses';
import ChapterAccordion from '../components/ChapterAccordion';

function CourseDetailPage({ progress }) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { completedLessons, toggleLesson, getProgress } = progress;

  // Find course by ID
  const course = courses.find(c => c.id === parseInt(courseId));

  // Handle invalid course
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Course not found.</p>
      </div>
    );
  }

  // Flatten all lessons
  const allLessons = course.chapters.flatMap(ch => ch.lessons);
  const progressPct = getProgress(allLessons);
  

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="text-sm text-blue-500 hover:underline mb-3 block"
        >
          ← Back to Courses
        </button>

        {/* Course Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full
            ${course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
              course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'}`}>
            {course.level}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm mt-1">{course.description}</p>

        {/* Progress Section */}
        <div className="mt-4 max-w-lg">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>
              {completedLessons.filter(id =>
                allLessons.map(l => l.id).includes(id)
              ).length} of {allLessons.length} lessons complete
            </span>
            <span className="font-medium text-blue-600">{progressPct}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2 w-full">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-6 mt-4 text-sm text-gray-400">
          <span>{course.chapters.length} chapters</span>
          <span>{allLessons.length} lessons</span>
          <span>{allLessons.filter(l => l.type === 'quiz').length} quizzes</span>
        </div>

      </div>

      {/* Chapters */}
      <div className="p-8 max-w-3xl mx-auto">
        {progressPct === 100 && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-green-700 font-medium text-sm">
            🎉 You have completed this course!
          </div>
        )}
        {course.chapters.map(chapter => (
          <ChapterAccordion
            key={chapter.id}
            chapter={chapter}
            completedLessons={completedLessons}
            toggleLesson={toggleLesson}
          />
        ))}
      </div>

    </div>
  );
}

export default CourseDetailPage;