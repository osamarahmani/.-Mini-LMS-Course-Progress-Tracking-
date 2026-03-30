import { Routes, Route, Navigate } from "react-router-dom";
import CourseListPage from "./pages/CourseListPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LessonViewPage from "./pages/LessonViewPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminPanel from "./pages/AdminPanel";
import StudentRoster from "./pages/StudentRoster";
import GradingDashboard from "./pages/GradingDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [isRegister, setIsRegister] = useState(false);

  // ── 💡 NEW ROUTING LOGIC ───────────────────────────────────────
  // We move the "Gatekeeper" inside the Routes so Forgot Password can work.
  
  return (
    <Routes>
      {/* 🔓 PUBLIC ROUTES (Accessible to everyone) */}
      <Route 
        path="/login" 
        element={!user ? <LoginPage setUser={setUser} setIsRegister={setIsRegister} /> : <Navigate to="/" />} 
      />
      <Route 
        path="/register" 
        element={!user ? <RegisterPage setUser={setUser} setIsRegister={setIsRegister} /> : <Navigate to="/" />} 
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* 🔒 PROTECTED ROUTES (Only if logged in) */}
      <Route path="/" element={user ? <CourseListPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      <Route path="/course/:id" element={user ? <CourseDetailPage user={user} /> : <Navigate to="/login" />} />
      <Route path="/lesson/:lessonId" element={user ? <LessonViewPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <UserProfilePage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      
      {/* ⚙️ ADMIN ROUTES */}
      <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel user={user} setUser={setUser} /> : <Navigate to="/" />} />
      <Route path="/admin/roster" element={user?.role === 'admin' ? <StudentRoster user={user} /> : <Navigate to="/" />} />
      <Route path="/admin/grades" element={user?.role === 'admin' ? <GradingDashboard user={user} /> : <Navigate to="/" />} />

      {/* ── HANDLE INITIAL AUTH REDIRECT ── */}
      {/* If a user goes to a route while not logged in, this logic handles it */}
      {!user && !["/forgot-password", "/reset-password", "/register"].includes(window.location.pathname) && (
        <Route path="*" element={isRegister ? <Navigate to="/register" /> : <Navigate to="/login" />} />
      )}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;