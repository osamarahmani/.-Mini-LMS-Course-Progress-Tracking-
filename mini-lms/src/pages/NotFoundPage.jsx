import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
      <div className="text-6xl font-bold text-gray-300">404</div> {/* ✅ FIX COLOR */}
      <h1 className="text-xl font-semibold text-gray-700">Page not found</h1>
      <p className="text-gray-400 text-sm">
        The page you are looking for does not exist.
      </p>

      <button
        onClick={() => navigate('/')}
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
      >
        Back to Courses
      </button>
    </div>
  );
}

export default NotFoundPage;