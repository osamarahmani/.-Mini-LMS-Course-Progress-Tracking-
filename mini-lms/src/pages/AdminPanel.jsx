import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // ⬅️ Integrated the new Sidebar
import {
  fetchCourses,
  createCourse,
  deleteCourse,
  createChapter,
  deleteChapter,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../api';

// ── Internal Admin Components ────────────────────────
const Field = ({ label, value, onChange, type = 'text', placeholder, textarea }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-2">{label}</label>
    {textarea ? (
      <textarea rows={3} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-stone-100 border-b-2 border-stone-200 text-stone-900 text-sm p-3 rounded-xl outline-none focus:border-amber-500 transition-all" />
    ) : (
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-stone-100 border-b-2 border-stone-200 text-stone-900 text-sm p-3 rounded-xl outline-none focus:border-amber-500 transition-all" />
    )}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-stone-950/90 backdrop-blur-md">
    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
      <div className="h-2 bg-amber-500" />
      <div className="p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-stone-900 tracking-tighter uppercase">{title}</h2>
          <button onClick={onClose} className="text-stone-300 hover:text-stone-900 text-2xl transition-colors">✕</button>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export default function AdminPanel({ user }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [modal, setModal] = useState(null); 
  const [modalTarget, setModalTarget] = useState(null); 
  const [saving, setSaving] = useState(false);

  const [courseForm, setCourseForm] = useState({ title: '', description: '', level: 'Beginner' });
  const [chapterForm, setChapterForm] = useState({ title: '' });
  const [lessonForm, setLessonForm] = useState({ 
    title: '', type: 'reading', content: '',
    quiz: { question: '', options: ['', '', '', ''], correct: 0 } 
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
    else loadCourses();
  }, [user, navigate]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchCourses();
      setCourses(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal(null);
    setModalTarget(null);
    setSaving(false);
    setCourseForm({ title: '', description: '', level: 'Beginner' });
    setChapterForm({ title: '' });
    setLessonForm({ title: '', type: 'reading', content: '', quiz: { question: '', options: ['', '', '', ''], correct: 0 } });
  };

  const handleSaveLesson = async () => {
    setSaving(true);
    if (modal === 'editLesson') {
      const { courseId, chapterId, lessonId } = modalTarget;
      await updateLesson(courseId, chapterId, lessonId, lessonForm);
    } else {
      const { courseId, chapterId } = modalTarget;
      await createLesson(courseId, chapterId, lessonForm);
    }
    await loadCourses();
    closeModal();
  };

  if (loading) return <div className="min-h-screen bg-stone-950 flex items-center justify-center text-amber-500 font-black tracking-widest uppercase">Initializing Admin Hub...</div>;

  return (
    <div className="min-h-screen bg-stone-950 text-white flex font-sans">
      
      {/* ── SHARED ADMIN SIDEBAR ────────────────────────────────── */}
      <Sidebar activePage="courses" /> 

      {/* ── MAIN MANAGEMENT AREA ────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <header className="px-10 py-10 flex justify-between items-center sticky top-0 bg-stone-950/90 backdrop-blur-xl z-10 border-b border-stone-900">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Content Engine</h1>
            <p className="text-stone-500 text-[10px] font-black mt-2 uppercase tracking-widest">Version 2.0 • Course Lifecycle Management</p>
          </div>
          <button 
            onClick={() => setModal('addCourse')}
            className="bg-white hover:bg-amber-500 text-stone-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
          >
            + Create New Course
          </button>
        </header>

        <div className="p-10 space-y-10">
          
          {/* ── MANAGEMENT STATS ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Courses', val: courses.length, icon: '📂' },
              { label: 'Live Chapters', val: courses.reduce((a, c) => a + (c.chapters?.length || 0), 0), icon: '📖' },
              { label: 'Global Lessons', val: courses.reduce((a, c) => a + (c.chapters?.reduce((sa, ch) => sa + (ch.lessons?.length || 0), 0) || 0), 0), icon: '🎯' }
            ].map(stat => (
              <div key={stat.label} className="bg-stone-900 border border-stone-800 p-8 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <p className="text-4xl font-black text-white">{stat.val}</p>
              </div>
            ))}
          </div>

          {/* ── COURSE LIST ── */}
          <div className="grid gap-6">
            {courses.length === 0 ? (
                <div className="text-center py-32 bg-stone-900/30 rounded-[3rem] border-2 border-dashed border-stone-800 text-stone-600 font-bold uppercase tracking-widest">No Courses in Library</div>
            ) : courses.map(course => (
              <div key={course._id} className="bg-stone-900 rounded-[2.5rem] border border-stone-800 overflow-hidden transition-all hover:border-stone-600 shadow-sm">
                <div className="p-8 flex items-center justify-between">
                  <div onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)} className="cursor-pointer flex-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">{course.title}</h3>
                    <div className="flex gap-3 mt-2">
                      <span className="text-[9px] font-black bg-stone-800 text-amber-500 px-3 py-1 rounded-lg uppercase tracking-widest border border-stone-700">{course.level}</span>
                      <span className="text-[9px] font-black bg-stone-800 text-stone-400 px-3 py-1 rounded-lg uppercase tracking-widest border border-stone-700">{course.chapters?.length || 0} Chapters</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => { setModalTarget(course._id); setModal('addChapter'); }} className="text-[10px] font-black text-amber-500 hover:text-white transition-colors uppercase tracking-widest">+ CHAPTER</button>
                    <button onClick={async () => { if(window.confirm("Delete course?")) { await deleteCourse(course._id); loadCourses(); }}} className="text-stone-600 hover:text-red-500 transition-colors">🗑️</button>
                  </div>
                </div>

                {expandedCourse === course._id && (
                  <div className="bg-stone-950/50 p-8 pt-0 space-y-6">
                    {(course.chapters || []).map(chapter => (
                      <div key={chapter._id} className="bg-stone-900/80 p-6 rounded-[2rem] border border-stone-800 shadow-inner">
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="font-black text-stone-400 text-xs uppercase tracking-widest">📖 {chapter.title}</h4>
                          <div className="flex gap-4">
                              <button onClick={() => { setModalTarget({ courseId: course._id, chapterId: chapter._id }); setModal('addLesson'); }} className="text-[9px] font-black text-amber-500 uppercase tracking-widest">+ LESSON</button>
                              <button onClick={async () => { if(window.confirm("Delete chapter?")) { await deleteChapter(course._id, chapter._id); loadCourses(); }}} className="text-stone-700 hover:text-red-500">✕</button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {(chapter.lessons || []).map(lesson => (
                            <div key={lesson._id} className="flex justify-between items-center bg-stone-950 px-5 py-4 rounded-2xl group border border-stone-900 hover:border-stone-800 transition-all">
                              <span className="text-xs font-bold text-stone-500 uppercase tracking-tight">
                                {lesson.type === 'quiz' ? '❓' : '📄'} {lesson.title}
                              </span>
                              <div className="flex gap-6 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => { setLessonForm(lesson); setModalTarget({ courseId: course._id, chapterId: chapter._id, lessonId: lesson._id }); setModal('editLesson'); }} className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Edit</button>
                                <button onClick={async () => { if(window.confirm("Delete lesson?")) { await deleteLesson(course._id, chapter._id, lesson._id); loadCourses(); }}} className="text-[10px] font-black text-red-800 uppercase tracking-widest">Del</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── MODALS (Course, Chapter, Lesson) ── */}
      {modal === 'addCourse' && (
        <Modal title="New Course" onClose={closeModal}>
          <Field label="Course Title" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} placeholder="e.g., REACT ADVANCED" />
          <Field label="Description" textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} placeholder="What's the goal?" />
          <button onClick={async () => { setSaving(true); await createCourse(courseForm); await loadCourses(); closeModal(); }} disabled={saving} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] mt-4 hover:bg-amber-500 hover:text-stone-900 transition-all">
            {saving ? 'Creating...' : 'Deploy Course'}
          </button>
        </Modal>
      )}

      {modal === 'addChapter' && (
        <Modal title="New Chapter" onClose={closeModal}>
          <Field label="Chapter Title" value={chapterForm.title} onChange={e => setChapterForm({title: e.target.value})} placeholder="e.g., STATE MANAGEMENT" />
          <button onClick={async () => { setSaving(true); await createChapter(modalTarget, chapterForm); await loadCourses(); closeModal(); }} disabled={saving} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] mt-4 hover:bg-amber-500 hover:text-stone-900 transition-all">
            {saving ? 'Adding...' : 'Attach Chapter'}
          </button>
        </Modal>
      )}

      {(modal === 'addLesson' || modal === 'editLesson') && (
        <Modal title={modal === 'addLesson' ? "New Content" : "Update Content"} onClose={closeModal}>
          <div className="space-y-6">
            <Field label="Title" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} />
            <div className="flex bg-stone-100 p-1.5 rounded-2xl">
              {['reading', 'quiz'].map(t => (
                <button key={t} type="button" onClick={() => setLessonForm({...lessonForm, type: t})} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${lessonForm.type === t ? 'bg-white shadow-sm text-amber-600' : 'text-stone-400 hover:text-stone-600'}`}>
                  {t}
                </button>
              ))}
            </div>
            {lessonForm.type === 'reading' ? (
              <Field label="Body Content" textarea value={lessonForm.content} onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })} />
            ) : (
              <div className="space-y-4 bg-stone-50 p-6 rounded-[2rem] border border-stone-200">
                <Field label="The Question" value={lessonForm.quiz.question} onChange={e => setLessonForm({...lessonForm, quiz: {...lessonForm.quiz, question: e.target.value}})} />
                <div className="space-y-3">
                  {lessonForm.quiz.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-stone-200">
                      <input type="radio" checked={lessonForm.quiz.correct === i} onChange={() => setLessonForm({...lessonForm, quiz: {...lessonForm.quiz, correct: i}})} className="w-5 h-5 accent-amber-500" />
                      <input placeholder={`Option ${i+1}`} className="flex-1 text-sm font-bold text-stone-900 outline-none bg-transparent" value={opt} onChange={e => {
                        const newOpts = [...lessonForm.quiz.options]; newOpts[i] = e.target.value;
                        setLessonForm({...lessonForm, quiz: {...lessonForm.quiz, options: newOpts}});
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={handleSaveLesson} disabled={saving} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-stone-900 transition-all">
              {saving ? 'Saving...' : 'Commit Changes'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}