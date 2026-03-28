import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 gap-3">

      {/* 404 Number */}
      <div className="text-8xl font-bold text-stone-200 tracking-tighter leading-none select-none">
        404
      </div>

      {/* Icon */}
      <div className="text-4xl mt-1">🗺️</div>

      {/* Heading */}
      <h1 className="text-xl font-bold text-stone-700 tracking-tight">
        Page not found
      </h1>

      {/* Subtext */}
      <p className="text-stone-400 text-sm text-center max-w-xs">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      {/* CTA */}
      <button
        onClick={() => navigate('/')}
        className="mt-4 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all duration-200"
      >
        <span>←</span>
        <span>Back to Courses</span>
      </button>

    </div>
  );
}

export default NotFoundPage;