import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CourseListPage from './pages/CourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonViewPage from './pages/LessonViewPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from  './components/Navbar';
import useProgress from './hooks/useProgress';

function App() {
  const progress = useProgress();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CourseListPage progress={progress} />} />
        <Route path="/course/:courseId" element={<CourseDetailPage progress={progress} />} />
        <Route path="/lesson/:lessonId" element={<LessonViewPage progress={progress} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;