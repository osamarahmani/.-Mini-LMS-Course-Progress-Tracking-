import { Routes, Route } from "react-router-dom";
import CourseListPage from "./pages/CourseListPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LessonViewPage from "./pages/LessonViewPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminPanel from "./pages/AdminPanel";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [isRegister, setIsRegister] = useState(false);

  if (!user) {
    return isRegister ? (
      <RegisterPage setUser={setUser} setIsRegister={setIsRegister} />
    ) : (
      <LoginPage setUser={setUser} setIsRegister={setIsRegister} />
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<CourseListPage user={user} setUser={setUser} />} // ✅ FIX
      />

      <Route 
        path="/course/:id" 
        element={<CourseDetailPage user={user} />} 
      />

      <Route 
        path="/lesson/:lessonId" 
        element={<LessonViewPage user={user} setUser={setUser} />} 
      />
      <Route 
        path="/profile" 
        element={<UserProfilePage user={user} setUser={setUser} />} 
      />
      <Route path="/admin" element={<AdminPanel user={user} setUser={setUser} />} />

      <Route path="*" element={<NotFoundPage />} /> {/* ✅ FIX COMMENT */}
    </Routes>
  );
}

export default App;