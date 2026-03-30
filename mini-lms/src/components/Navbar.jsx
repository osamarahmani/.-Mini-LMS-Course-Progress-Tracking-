import { useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  // 🛡️ Admin Check
  const isAdmin = user?.role === 'admin';

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/login'); 
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const navLinkStyle = "text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-amber-600 transition-all duration-200 relative group";

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* ── Brand / Logo ────────────────────────────────────────── */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-xl shadow-amber-500/20 group-hover:rotate-6 transition-transform">
            <span className="text-stone-900 text-lg">📚</span>
          </div>
          <span className="text-stone-900 font-black text-xl tracking-tighter uppercase italic leading-none">
            MiniLMS
          </span>
        </div>

        {/* ── Navigation Controls ───────────────────────────────────── */}
        <div className="flex items-center gap-8">
          
          {/* Main Links */}
          <div className="hidden sm:flex items-center gap-8 border-r border-stone-100 pr-8">
            
            {/* 💡 ONLY show "Courses" and "My Progress" if NOT Admin */}
            {!isAdmin ? (
              <>
                <button onClick={() => navigate('/')} className={navLinkStyle}>
                  Courses
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
                </button>

                <button onClick={() => navigate('/profile')} className={navLinkStyle}>
                  My Progress
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
                </button>
              </>
            ) : (
              /* ✅ ADMIN ONLY LINK: Prominent and focused */
              <button
                onClick={() => navigate('/admin')}
                className="bg-stone-900 text-amber-500 hover:bg-amber-500 hover:text-stone-900 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 border border-stone-800"
              >
                ⚙️ Admin Dashboard
              </button>
            )}
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            <div 
              className={`flex items-center gap-3 p-1 pr-3 rounded-full transition-colors ${!isAdmin ? 'cursor-pointer hover:bg-stone-50' : ''}`}
              onClick={() => !isAdmin && navigate('/profile')}
            >
              <div className="w-9 h-9 rounded-full bg-stone-900 flex items-center justify-center shadow-lg">
                <span className="text-amber-500 text-[10px] font-black italic">{initials}</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-stone-900 text-[10px] font-black uppercase tracking-tight leading-none">
                  {user?.name}
                </p>
                <p className="text-[8px] font-bold text-amber-600 uppercase mt-1 tracking-widest">
                  {isAdmin ? 'System Admin' : 'Student Account'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-50 text-stone-300 hover:bg-red-50 hover:text-red-500 border border-stone-200 hover:border-red-100 transition-all active:scale-90"
              title="Sign Out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"
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