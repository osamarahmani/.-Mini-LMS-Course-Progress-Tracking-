import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">

      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">L</span>
        </div>
        <span className="font-bold text-gray-800 text-lg">MiniLMS</span>
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/')}
          className={`text-sm font-medium transition-colors
            ${location.pathname === '/'
              ? 'text-blue-500'
              : 'text-gray-500 hover:text-gray-800'}`}
        >
          Courses
        </button>
      </div>

      {/* User Avatar */}
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-gray-600 text-xs font-semibold">U</span>
      </div>

    </nav>
  );
}

export default Navbar;