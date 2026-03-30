import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // ⬅️ Integrated standalone sidebar
import { fetchAllUsers, deleteUser, fetchCourses } from '../api';

export default function StudentRoster({ user }) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingStudent, setViewingStudent] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
    else loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userData, courseData] = await Promise.all([fetchAllUsers(), fetchCourses()]);
      setStudents(Array.isArray(userData) ? userData.filter(u => u.role !== 'admin') : []);
      setCourses(courseData);
    } catch (err) {
      console.error("Error loading roster data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently remove ${name} from the system?`)) {
      await deleteUser(id);
      loadData();
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center text-amber-500 font-black tracking-widest uppercase">
      Syncing Roster...
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-white flex">
      
      {/* ── SHARED ADMIN SIDEBAR ────────────────────────────────── */}
      <Sidebar activePage="roster" /> 

      {/* ── MAIN MANAGEMENT AREA ────────────────────────────────── */}
      <main className="flex-1 bg-stone-950 overflow-auto">
        <header className="px-10 py-10 flex justify-between items-center sticky top-0 bg-stone-950/90 backdrop-blur-xl z-10 border-b border-stone-900">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Learner Directory</h1>
            <p className="text-stone-500 text-[10px] font-black mt-2 uppercase tracking-widest">Management • Student Lifecycle & Progress</p>
          </div>
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-amber-500 transition-all text-white w-full shadow-inner placeholder:text-stone-600"
            />
          </div>
        </header>

        <div className="p-10">
          <div className="bg-stone-900 rounded-[2.5rem] border border-stone-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-800/50 border-b border-stone-700">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-stone-500">Student Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-stone-500">Registration Date</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filteredStudents.map(s => (
                  <tr key={s._id} className="hover:bg-stone-800/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-sm font-black text-amber-500 uppercase shadow-lg group-hover:scale-105 transition-transform">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-stone-200 uppercase tracking-tight">{s.name}</p>
                          <p className="text-[10px] font-bold text-stone-600 tracking-tight">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] text-stone-500 font-black uppercase tracking-tighter">
                      {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-right space-x-6">
                      <button 
                        onClick={() => setViewingStudent(s)} 
                        className="text-[9px] font-black uppercase tracking-widest text-amber-500 hover:text-white transition-colors"
                      >
                        View Progress
                      </button>
                      <button 
                        onClick={() => handleDelete(s._id, s.name)} 
                        className="text-[9px] font-black uppercase tracking-widest text-red-900 hover:text-red-500 transition-colors"
                      >
                        Delete Account
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredStudents.length === 0 && (
              <div className="py-32 text-center text-stone-700 font-black uppercase tracking-[0.3em] italic">
                No learners found in directory
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── PROGRESS MODAL ── */}
      {viewingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/90 backdrop-blur-md p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden text-stone-900 shadow-2xl">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic text-stone-900">{viewingStudent.name}</h2>
                  <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mt-1">Academic Transcript & Engagement</p>
                </div>
                <button onClick={() => setViewingStudent(null)} className="text-stone-300 hover:text-stone-900 text-2xl transition-colors">✕</button>
              </div>

              <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {courses.map(course => {
                  const lessons = course.chapters.flatMap(ch => ch.lessons);
                  const completedCount = viewingStudent.completedLessons?.filter(id => lessons.some(l => l._id === id)).length || 0;
                  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

                  return (
                    <div key={course._id} className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-black text-xs text-stone-800 uppercase tracking-tight">{course.title}</p>
                        <p className={`text-xs font-black ${pct === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{pct}%</p>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${pct === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                      <p className="text-[9px] text-stone-400 mt-3 font-black uppercase tracking-widest">
                        Status: {completedCount} / {lessons.length} Modules Finalized
                      </p>
                    </div>
                  );
                })}
                {courses.length === 0 && <p className="text-center text-stone-400 text-xs font-bold uppercase py-10">No course data available</p>}
              </div>
            </div>
            <div className="bg-stone-50 p-6 text-center border-t border-stone-100">
               <button 
                 onClick={() => setViewingStudent(null)} 
                 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors"
               >
                 Close Learner Profile
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}