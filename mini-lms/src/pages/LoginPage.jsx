import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

function LoginPage({ setUser, setIsRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");

  const handleLogin = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    
    setIsLoading(true);
    const res = await login(form);
    setIsLoading(false);

    if (res._id) {
      // ✅ Role validation: ensures the user actually has the role they selected
      if (selectedRole === "admin" && res.role !== "admin") {
        setError("Access denied. You do not have admin privileges.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(res));
      setUser(res);

      // ✅ Redirect based on role
      if (res.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(res.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel: Branding ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
            <span className="text-lg">📚</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">MiniLMS</span>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-white text-5xl font-bold leading-[1.1] tracking-tight">
            Knowledge is<br />
            <span className="text-amber-400">your best</span><br />
            investment.
          </h2>
        </div>
        {/* Decorative background circle */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* ── Right Panel: Form ──────────────────────────────────── */}
      <div className="flex-1 bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Welcome back</h1>
            <p className="text-stone-400 text-sm mt-1.5">Sign in to continue your journey</p>
          </div>

          {/* ✅ Role Selector Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setSelectedRole("student")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                selectedRole === "student" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setSelectedRole("admin")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                selectedRole === "admin" ? "bg-white text-amber-600 shadow-sm" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl mb-6">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Email address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full bg-stone-50 border-b-2 border-stone-200 text-stone-800 text-sm py-3 outline-none focus:border-amber-500 transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-stone-50 border-b-2 border-stone-200 text-stone-800 text-sm py-3 outline-none focus:border-amber-500 transition-all"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-4 bg-stone-900 hover:bg-amber-500 text-white text-sm font-bold rounded-2xl shadow-lg transition-all duration-300 mt-10 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : `Sign in as ${selectedRole === "admin" ? "Admin" : "Student"}`}
          </button>

          <p className="text-center text-sm text-stone-400 mt-8">
            New here?{" "}
            <span
              onClick={() => setIsRegister(true)}
              className="text-stone-800 font-bold underline underline-offset-4 decoration-amber-400 hover:text-amber-600 cursor-pointer"
            >
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ✅ THIS IS THE LINE THAT WAS MISSING AND CAUSED THE SYNTAX ERROR
export default LoginPage;