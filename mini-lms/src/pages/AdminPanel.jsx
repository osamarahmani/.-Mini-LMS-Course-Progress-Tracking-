import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  createChapter,
  deleteChapter,
  createLesson,
  deleteLesson,
} from '../api';

// ── Tiny reusable input ────────────────────────────────────────
const Field = ({ label, value, onChange, type = 'text', placeholder, textarea }) => (
  <div>
    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    {textarea ? (
      <textarea
        rows={3}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-stone-50 border-b-2 border-stone-200 text-stone-800 text-sm px-0 py-2 outline-none focus:border-amber-500 transition-all duration-200 placeholder:text-stone-300 resize-none"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-stone-50 border-b-2 border-stone-200 text-stone-800 text-sm px-0 py-2 outline-none focus:border-amber-500 transition-all duration-200 placeholder:text-stone-300"
      />
    )}
  </div>
);

// ── Modal wrapper ──────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
      <div className="px-7 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-stone-800 tracking-tight">{title}</h2>
          <button onClick={onClose} className="text-stone-300 hover:text-stone-600 transition-colors text-xl leading-none">✕</button>
        </div>
        {children}
      </div>
    </div>
  </div>
);

// ── Confirm delete dialog ──────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-red-400 to-red-500" />
      <div className="px-7 py-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 text-lg">⚠️</span>
          </div>
          <div>
            <p className="text-stone-800 font-semibold text-sm">Are you sure?</p>
            <p className="text-stone-400 text-xs mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-semibold rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
export default function AdminPanel({ user, setUser }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);

  // Modal states
  const [modal, setModal] = useState(null); // 'addCourse' | 'editCourse' | 'addChapter' | 'addLesson'
  const [modalTarget, setModalTarget] = useState(null); // courseId or chapterId context
  const [confirmDelete, setConfirmDelete] = useState(null); // { type, id, label }

  // Form states
  const [courseForm, setCourseForm] = useState({ title: '', description: '', level: 'Beginner' });
  const [chapterForm, setChapterForm] = useState({ title: '' });
  const [lessonForm, setLessonForm] = useState({ title: '', type: 'lesson', content: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Guard: only admin
  useEffect(() => {
    if (user?.role !== 'admin') navigate('/');
  }, [user]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const data = await fetchCourses();
    setCourses(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => { setModal(null); setModalTarget(null); };

  // ── Course CRUD ─────────────────────────────────────────────
  const handleAddCourse = async () => {
    if (!courseForm.title.trim()) return;
    setSaving(true);
    await createCourse(courseForm);
    await loadCourses();
    setSaving(false);
    closeModal();
    showToast('Course created!');
  };

  const handleEditCourse = async () => {
    if (!courseForm.title.trim()) return;
    setSaving(true);
    await updateCourse(modalTarget, courseForm);
    await loadCourses();
    setSaving(false);
    closeModal();
    showToast('Course updated!');
  };

  const handleDeleteCourse = async (id) => {
    await deleteCourse(id);
    await loadCourses();
    showToast('Course deleted.', 'error');
    setConfirmDelete(null);
  };

  // ── Chapter CRUD ────────────────────────────────────────────
  const handleAddChapter = async () => {
    if (!chapterForm.title.trim()) return;
    setSaving(true);
    await createChapter(modalTarget, chapterForm);
    await loadCourses();
    setSaving(false);
    closeModal();
    showToast('Chapter added!');
  };

  const handleDeleteChapter = async (courseId, chapterId) => {
    await deleteChapter(courseId, chapterId);
    await loadCourses();
    showToast('Chapter deleted.', 'error');
    setConfirmDelete(null);
  };

  // ── Lesson CRUD ─────────────────────────────────────────────
  const handleAddLesson = async () => {
    if (!lessonForm.title.trim()) return;
    setSaving(true);
    const { courseId, chapterId } = modalTarget;
    await createLesson(courseId, chapterId, lessonForm);
    await loadCourses();
    setSaving(false);
    closeModal();
    showToast('Lesson added!');
  };

  const handleDeleteLesson = async (courseId, chapterId, lessonId) => {
    await deleteLesson(courseId, chapterId, lessonId);
    await loadCourses();
    showToast('Lesson deleted.', 'error');
    setConfirmDelete(null);
  };

  const levelStyles = {
    Beginner:     'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Intermediate: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    Advanced:     'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  };

  const totalLessons = courses.flatMap(c =>
    (c.chapters || []).flatMap(ch => ch.lessons || [])
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-amber-800 border-t-amber-400 animate-spin" />
          <p className="text-stone-500 text-sm font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white">

      {/* ── Toast ───────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all duration-300 ${
          toast.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-emerald-500 text-white'
        }`}>
          <span>{toast.type === 'error' ? '🗑️' : '✓'}</span>
          {toast.msg}
        </div>
      )}

      {/* ── Sidebar + Content layout ─────────────────────────────── */}
      <div className="flex min-h-screen">

        {/* ── Sidebar ───────────────────────────────────────────── */}
        <aside className="w-56 bg-stone-900 border-r border-stone-800 flex flex-col py-6 px-4 gap-1 flex-shrink-0 hidden md:flex">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-base">📚</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">MiniLMS</p>
              <p className="text-stone-500 text-[10px] font-medium mt-0.5">Admin Panel</p>
            </div>
          </div>

          {[
            { icon: '🗂️', label: 'Courses', active: true },
            { icon: '👥', label: 'Users', active: false },
            { icon: '📊', label: 'Analytics', active: false },
          ].map(({ icon, label, active }) => (
            <button key={label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
              active
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800'
            }`}>
              <span>{icon}</span>{label}
            </button>
          ))}

          <div className="mt-auto">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition-colors w-full"
            >
              <span>←</span> Back to App
            </button>
          </div>
        </aside>

        {/* ── Main ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto">

          {/* Top bar */}
          <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">Course Management</h1>
              <p className="text-stone-500 text-xs mt-0.5">Manage all courses, chapters and lessons</p>
            </div>
            <button
              onClick={() => {
                setCourseForm({ title: '', description: '', level: 'Beginner' });
                setModal('addCourse');
              }}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-900 text-sm font-bold px-4 py-2 rounded-xl transition-all duration-150 shadow-md"
            >
              <span className="text-base">+</span> New Course
            </button>
          </header>

          <div className="p-6 space-y-5">

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Courses',  value: courses.length,  icon: '🗂️' },
                { label: 'Total Chapters', value: courses.reduce((a, c) => a + (c.chapters?.length || 0), 0), icon: '📖' },
                { label: 'Total Lessons',  value: totalLessons,    icon: '🎬' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
                  <span className="text-xl">{icon}</span>
                  <p className="text-2xl font-bold text-white mt-2">{value}</p>
                  <p className="text-stone-500 text-xs font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Course list */}
            {courses.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-16 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-stone-400 font-medium">No courses yet.</p>
                <p className="text-stone-600 text-sm mt-1">Click "New Course" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course._id} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">

                    {/* Course row */}
                    <div className="flex items-center gap-4 px-5 py-4">
                      <button
                        onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)}
                        className="text-stone-500 hover:text-amber-400 transition-colors text-xs"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform duration-200 ${expandedCourse === course._id ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-white font-semibold text-sm">{course.title}</h3>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${levelStyles[course.level] || levelStyles.Advanced}`}>
                            {course.level}
                          </span>
                        </div>
                        <p className="text-stone-500 text-xs mt-0.5 truncate">{course.description}</p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-600 hidden sm:flex">
                        <span>{course.chapters?.length || 0} ch</span>
                        <span>·</span>
                        <span>{(course.chapters || []).flatMap(ch => ch.lessons || []).length} ls</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setChapterForm({ title: '' });
                            setModalTarget(course._id);
                            setModal('addChapter');
                          }}
                          className="text-xs text-stone-400 hover:text-amber-400 bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          + Chapter
                        </button>
                        <button
                          onClick={() => {
                            setCourseForm({ title: course.title, description: course.description, level: course.level });
                            setModalTarget(course._id);
                            setModal('editCourse');
                          }}
                          className="text-stone-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ type: 'course', id: course._id, label: course.title })}
                          className="text-stone-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Chapters */}
                    {expandedCourse === course._id && (
                      <div className="border-t border-stone-800">
                        {(course.chapters || []).length === 0 ? (
                          <p className="text-stone-600 text-xs px-10 py-4">No chapters yet. Add one above.</p>
                        ) : (
                          (course.chapters || []).map(chapter => (
                            <div key={chapter._id} className="border-b border-stone-800/60 last:border-0">

                              {/* Chapter row */}
                              <div className="flex items-center gap-4 px-10 py-3 bg-stone-950/40 hover:bg-stone-800/20 transition-colors">
                                <button
                                  onClick={() => setExpandedChapter(expandedChapter === chapter._id ? null : chapter._id)}
                                  className="text-stone-600 hover:text-amber-400 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedChapter === chapter._id ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                  </svg>
                                </button>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-amber-500/70 uppercase tracking-widest">Ch</span>
                                    <span className="text-stone-300 text-sm font-medium">{chapter.title}</span>
                                  </div>
                                </div>

                                <span className="text-stone-600 text-xs hidden sm:block">
                                  {chapter.lessons?.length || 0} lessons
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setLessonForm({ title: '', type: 'lesson', content: '' });
                                      setModalTarget({ courseId: course._id, chapterId: chapter._id });
                                      setModal('addLesson');
                                    }}
                                    className="text-xs text-stone-500 hover:text-amber-400 bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-lg font-medium transition-colors"
                                  >
                                    + Lesson
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete({ type: 'chapter', courseId: course._id, id: chapter._id, label: chapter.title })}
                                    className="text-stone-600 hover:text-red-400 p-1 rounded-lg hover:bg-stone-800 transition-colors"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              {/* Lessons */}
                              {expandedChapter === chapter._id && (
                                <div className="bg-stone-950/60">
                                  {(chapter.lessons || []).length === 0 ? (
                                    <p className="text-stone-600 text-xs px-16 py-3">No lessons yet.</p>
                                  ) : (
                                    (chapter.lessons || []).map(lesson => (
                                      <div key={lesson._id} className="flex items-center gap-3 px-16 py-2.5 border-t border-stone-800/40 hover:bg-stone-800/10 transition-colors">
                                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${lesson.type === 'quiz' ? 'bg-amber-400' : 'bg-sky-400'}`} />
                                        <span className="text-stone-400 text-xs font-medium flex-1 truncate">{lesson.title}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                          lesson.type === 'quiz'
                                            ? 'bg-amber-500/10 text-amber-400'
                                            : 'bg-sky-500/10 text-sky-400'
                                        }`}>
                                          {lesson.type}
                                        </span>
                                        <button
                                          onClick={() => setConfirmDelete({
                                            type: 'lesson',
                                            courseId: course._id,
                                            chapterId: chapter._id,
                                            id: lesson._id,
                                            label: lesson.title
                                          })}
                                          className="text-stone-700 hover:text-red-400 transition-colors text-xs"
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ MODALS ════════════════════════════════════════════════ */}

      {/* Add Course */}
      {modal === 'addCourse' && (
        <Modal title="Create New Course" onClose={closeModal}>
          <div className="space-y-5">
            <Field label="Course Title" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="e.g. Intro to React" />
            <Field label="Description" value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} placeholder="Brief course description..." textarea />
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Level</label>
              <select
                value={courseForm.level}
                onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}
                className="w-full bg-stone-50 border-b-2 border-stone-200 text-stone-800 text-sm py-2 outline-none focus:border-amber-500 transition-all duration-200"
              >
                {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-semibold rounded-xl transition-colors">Cancel</button>
              <button onClick={handleAddCourse} disabled={saving} className="flex-1 py-2.5 bg-stone-900 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Create Course'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Course */}
      {modal === 'editCourse' && (
        <Modal title="Edit Course" onClose={closeModal}>
          <div className="space-y-5">
            <Field label="Course Title" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="Course title" />
            <Field label="Description" value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} placeholder="Description..." textarea />
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Level</label>
              <select
                value={courseForm.level}
                onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}
                className="w-full bg-stone-50 border-b-2 border-stone-200 text-stone-800 text-sm py-2 outline-none focus:border-amber-500 transition-all duration-200"
              >
                {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-semibold rounded-xl transition-colors">Cancel</button>
              <button onClick={handleEditCourse} disabled={saving} className="flex-1 py-2.5 bg-stone-900 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Chapter */}
      {modal === 'addChapter' && (
        <Modal title="Add Chapter" onClose={closeModal}>
          <div className="space-y-5">
            <Field label="Chapter Title" value={chapterForm.title} onChange={e => setChapterForm({ title: e.target.value })} placeholder="e.g. Getting Started" />
            <div className="flex gap-3 pt-2">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-semibold rounded-xl transition-colors">Cancel</button>
              <button onClick={handleAddChapter} disabled={saving} className="flex-1 py-2.5 bg-stone-900 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Add Chapter'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Lesson */}
      {modal === 'addLesson' && (
        <Modal title="Add Lesson" onClose={closeModal}>
          <div className="space-y-5">
            <Field label="Lesson Title" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="e.g. What is JSX?" />
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Type</label>
              <div className="flex gap-3">
                {['lesson', 'quiz'].map(t => (
                  <button
                    key={t}
                    onClick={() => setLessonForm({ ...lessonForm, type: t })}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                      lessonForm.type === t
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {t === 'quiz' ? '📝 Quiz' : '🎬 Lesson'}
                  </button>
                ))}
              </div>
            </div>
            {lessonForm.type === 'lesson' && (
              <Field label="Content" value={lessonForm.content} onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })} placeholder="Lesson content..." textarea />
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-semibold rounded-xl transition-colors">Cancel</button>
              <button onClick={handleAddLesson} disabled={saving} className="flex-1 py-2.5 bg-stone-900 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Add Lesson'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <ConfirmModal
          message={`"${confirmDelete.label}" will be permanently deleted.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => {
            if (confirmDelete.type === 'course') handleDeleteCourse(confirmDelete.id);
            if (confirmDelete.type === 'chapter') handleDeleteChapter(confirmDelete.courseId, confirmDelete.id);
            if (confirmDelete.type === 'lesson') handleDeleteLesson(confirmDelete.courseId, confirmDelete.chapterId, confirmDelete.id);
          }}
        />
      )}
    </div>
  );
}