import { useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/'); // Ensure they go back to login screen
  };

  // Generate initials for the avatar (e.g., "John Doe" -> "JD")
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <nav className="bg-white border-b border-stone-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* ── Brand / Logo ────────────────────────────────────────── */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <span className="text-white text-sm">📚</span>
          </div>
          <span className="text-stone-800 font-bold text-lg tracking-tight">
            MiniLMS
          </span>
        </div>

        {/* ── Navigation & User Controls ───────────────────────────── */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Main Navigation Links */}
          <div className="flex items-center gap-4 border-r border-stone-200 pr-4 sm:pr-6">
            <button
              onClick={() => navigate('/')}
              className="text-stone-500 hover:text-amber-600 text-sm font-medium transition-colors"
            >
              Courses
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="text-stone-500 hover:text-amber-600 text-sm font-medium transition-colors"
            >
              My Progress
            </button>

            {/* ✅ ADMIN DASHBOARD LINK (Only visible to Admins) */}
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-sm font-bold border border-amber-200 transition-all"
              >
                ⚙️ Admin Panel
              </button>
            )}
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
                <span className="text-stone-600 text-xs font-bold">{initials}</span>
              </div>
              <span className="text-stone-600 text-sm font-semibold hidden md:block">
                {user?.name}
              </span>
            </div>

            <button
              onClick={logout}
              className="text-stone-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 group"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
                fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;