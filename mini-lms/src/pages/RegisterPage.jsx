import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

function RegisterPage({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(form);
      setIsLoading(false);

      if (res && res._id) {
        localStorage.setItem("user", JSON.stringify(res));
        setUser(res);
        navigate("/");
      } else {
        setError(res?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Server connection failed. Is your backend running?");
    }
  };

  const fields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Jane Doe" },
    { key: "email", label: "Email Address", type: "email", placeholder: "name@example.com" },
    { key: "password", label: "Create Password", type: "password", placeholder: "••••••••" },
  ];

  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left Panel (Matches Login) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
            <span className="text-lg">📚</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight uppercase tracking-widest">MiniLMS</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-white text-5xl font-black leading-[1.1] tracking-tighter uppercase italic">
            Your learning<br />
            <span className="text-amber-400">journey starts</span><br />
            right here.
          </h2>
        </div>

        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-20">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-stone-900 tracking-tighter uppercase italic leading-none">Join us</h1>
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Create your account to start learning</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl mb-6 animate-pulse">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="space-y-6">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key} className="group">
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-amber-600">
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full py-5 bg-stone-900 hover:bg-amber-500 text-white hover:text-stone-900 text-xs font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-stone-900/20 transition-all duration-500 mt-10 disabled:opacity-50 active:scale-95"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-[10px] font-black uppercase tracking-widest text-stone-400 mt-10">
            Already a member?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-stone-900 underline underline-offset-8 decoration-amber-400 hover:text-amber-600 cursor-pointer transition-all"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;