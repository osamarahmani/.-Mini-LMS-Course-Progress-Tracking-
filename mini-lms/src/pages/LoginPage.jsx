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
    try {
      const res = await login(form);
      setIsLoading(false);

      if (res && res._id) {
        if (selectedRole === "admin" && res.role !== "admin") {
          setError("Access denied. You do not have admin privileges.");
          return;
        }

        localStorage.setItem("user", JSON.stringify(res));
        setUser(res);

        if (res.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(res?.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Server connection failed. Is your backend running?");
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
            <span className="text-lg">📚</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight uppercase tracking-widest">MiniLMS</span>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h2 className="text-white text-5xl font-black leading-[1.1] tracking-tighter uppercase italic">
            Knowledge is<br />
            <span className="text-amber-400">your best</span><br />
            investment.
          </h2>
        </div>

        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-20">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-stone-900 tracking-tighter uppercase italic leading-none">Welcome back</h1>
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Sign in to continue your journey</p>
          </div>

          {/* Role Selector */}
          <div className="flex bg-stone-100 p-1.5 rounded-2xl mb-8 border border-stone-200">
            <button
              onClick={() => setSelectedRole("student")}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                selectedRole === "student" ? "bg-white text-stone-900 shadow-xl" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setSelectedRole("admin")}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                selectedRole === "admin" ? "bg-white text-amber-600 shadow-xl" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl mb-6 animate-pulse">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-amber-600">Email address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-amber-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              
              <div className="flex justify-end mt-3 px-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevents click bubbling to parent containers
                    console.log("Navigating to recovery...");
                    navigate('/forgot-password');
                  }}
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-300 hover:text-amber-600 transition-all cursor-pointer relative z-40 p-1"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-5 bg-stone-900 hover:bg-amber-500 text-white hover:text-stone-900 text-xs font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-stone-900/20 transition-all duration-500 mt-10 disabled:opacity-50 active:scale-95"
          >
            {isLoading ? "Verifying Credentials..." : `Sign in as ${selectedRole}`}
          </button>

          <p className="text-center text-[10px] font-black uppercase tracking-widest text-stone-400 mt-10">
            New to the platform?{" "}
            <span
  onClick={() => navigate('/register')} // 👈 Use the Router to change pages
  className="text-stone-900 underline underline-offset-8 decoration-amber-400 hover:text-amber-600 cursor-pointer transition-all"
>
  Create Account
</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;