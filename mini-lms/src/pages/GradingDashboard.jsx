import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // ⬅️ Integrated standalone sidebar
import { fetchAllUsers, fetchCourses } from '../api';

export default function GradingDashboard({ user }) {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search state

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
    else loadGrades();
  }, [user, navigate]);

  const loadGrades = async () => {
    setLoading(true);
    try {
      const [userData, courseData] = await Promise.all([fetchAllUsers(), fetchCourses()]);
      
      // Flatten all quiz grades from all students into one master list
      const allGrades = userData.flatMap(student => 
        (student.quizGrades || []).map(grade => {
          const course = courseData.find(c => c._id === grade.courseId);
          return {
            ...grade,
            studentName: student.name,
            courseTitle: course?.title || 'Unknown Course'
          };
        })
      ).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

      setGrades(allGrades);
    } catch (error) {
      console.error("Error loading grades:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter grades based on student name or course title
  const filteredGrades = grades.filter(g => 
    g.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center text-amber-500 font-black uppercase tracking-widest">
      Compiling Performance Data...
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-white flex">
      
      {/* ── SHARED ADMIN SIDEBAR ────────────────────────────────── */}
      <Sidebar activePage="grades" /> 

      {/* ── MAIN CONTENT AREA ──────────────────────────────────── */}
      <main className="flex-1 overflow-auto bg-stone-950">
        <header className="px-10 py-10 flex justify-between items-center sticky top-0 bg-stone-950/90 backdrop-blur-xl z-10 border-b border-stone-900">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Quiz Performance</h1>
            <p className="text-stone-500 text-[10px] font-black mt-2 uppercase tracking-widest">Analytics • Real-time Student Evaluation</p>
          </div>
          
          {/* Search Input */}
          <div className="relative w-72">
            <input 
              type="text"
              placeholder="Filter by student or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-amber-500 transition-all text-white placeholder:text-stone-600 shadow-inner"
            />
          </div>
        </header>

        <div className="p-10">
          <div className="bg-stone-900 rounded-[2.5rem] border border-stone-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-800/50 border-b border-stone-700">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-500">Learner</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-500">Course Assessment</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-500">Score Metrics</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-500">Submitted</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filteredGrades.map((g, i) => (
                  <tr key={i} className="hover:bg-stone-800/30 transition-all group">
                    <td className="px-8 py-6 font-black text-stone-200 uppercase text-xs tracking-tight">{g.studentName}</td>
                    <td className="px-8 py-6 text-xs text-stone-500 font-bold">{g.courseTitle}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-black ${g.percentage >= 80 ? 'text-emerald-500' : g.percentage >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                          {g.percentage}%
                        </span>
                        <div className="w-24 bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${g.percentage >= 80 ? 'bg-emerald-500' : g.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${g.percentage}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] text-stone-600 font-black uppercase tracking-tighter">
                      {new Date(g.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${g.percentage >= 50 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                         {g.percentage >= 50 ? 'Passed' : 'Failed'}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredGrades.length === 0 && (
              <div className="py-32 text-center text-stone-700 font-black uppercase tracking-[0.3em] italic">
                No performance data found
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}