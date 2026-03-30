import { useNavigate } from 'react-router-dom';

export default function Sidebar({ activePage }) {
  const navigate = useNavigate();

  // Helper to apply active styles
  const getBtnStyle = (pageName) => {
    const base = "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm ";
    return activePage === pageName
      ? base + "bg-amber-500 text-stone-900 shadow-amber-500/20"
      : base + "text-stone-500 hover:text-white hover:bg-stone-800/50";
  };

  return (
    <aside className="w-72 bg-stone-900 border-r border-stone-800 flex flex-col py-10 px-6 flex-shrink-0 sticky top-0 h-screen">
      {/* Logo Section */}
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-2xl shadow-amber-500/20">
          <span className="text-2xl">⚡</span>
        </div>
        <div>
          <p className="text-white font-black text-lg leading-none tracking-tighter italic uppercase">LMS PRO</p>
          <p className="text-stone-500 text-[10px] font-black mt-1 uppercase tracking-widest">Admin Control</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-3 flex-1">
        <button 
          onClick={() => navigate('/admin')} 
          className={getBtnStyle('courses')}
        >
          <span>📚</span> Course Manager
        </button>

        <button 
          onClick={() => navigate('/admin/roster')} 
          className={getBtnStyle('roster')}
        >
          <span>👥</span> Student Roster
        </button>

        <button 
          onClick={() => navigate('/admin/grades')} 
          className={getBtnStyle('grades')}
        >
          <span>📊</span> Grading Dashboard
        </button>
        </nav>

      {/* Footer Link */}
      <button
        onClick={() => navigate('/')}
        className="mt-auto flex items-center justify-center gap-3 px-5 py-4 border-2 border-stone-800 text-stone-500 hover:text-amber-500 hover:border-amber-500/50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
      >
        <span>🏠</span> Exit to Website
      </button>
    </aside>
  );
}