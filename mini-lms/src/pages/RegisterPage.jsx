import { useState } from "react";
import { register } from "../api";

function RegisterPage({ setUser, setIsRegister }) {
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
    const res = await register(form);
    setIsLoading(false);
    if (res._id) {
      localStorage.setItem("user", JSON.stringify(res));
      setUser(res);
    } else {
      setError(res.message || "Registration failed. Please try again.");
    }
  };

  const fields = [
    { key: "name",     label: "Full name",     type: "text",     placeholder: "Jane Doe" },
    { key: "email",    label: "Email address", type: "email",    placeholder: "you@example.com" },
    { key: "password", label: "Password",      type: "password", placeholder: "••••••••" },
  ];

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel — Brand ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 flex-col justify-between p-12 relative overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-amber-400/5 blur-2xl pointer-events-none" />

        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
            <span className="text-lg">📚</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">MiniLMS</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <p className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
            Start your journey
          </p>
          <h2 className="text-white text-5xl font-bold leading-[1.1] tracking-tight">
            Every expert<br />
            was once a<br />
            <span className="text-amber-400">beginner.</span>
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
            Join learners building real skills with structured courses, hands-on quizzes, and progress tracking.
          </p>

          {/* Feature list */}
          <div className="space-y-3 pt-4 border-t border-stone-800">
            {[
              '✦  Track progress across all courses',
              '✦  Interactive quizzes & lessons',
              '✦  Learn entirely at your own pace',
            ].map(f => (
              <p key={f} className="text-stone-400 text-sm">{f}</p>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-stone-600 text-xs">
          © {new Date().getFullYear()} MiniLMS. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel — Form ────────────────────────────────── */}
      <div className="flex-1 bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <span>📚</span>
            </div>
            <span className="font-bold text-stone-800 text-lg">MiniLMS</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-stone-400 text-sm mt-1.5">
              Free to join. Start learning in minutes.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-6">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* Fields */}
          <div className="space-y-5 mb-6">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleRegister()}
                  className="w-full bg-stone-50 border-b-2 border-stone-200 text-stone-800 text-sm px-0 py-3 outline-none focus:border-amber-500 transition-all duration-200 placeholder:text-stone-300"
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full py-4 bg-stone-900 hover:bg-amber-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group mt-8"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </>
            )}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-stone-400 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => setIsRegister(false)}
              className="text-stone-800 font-bold underline underline-offset-4 decoration-amber-400 hover:text-amber-600 cursor-pointer transition-colors duration-150"
            >
              Sign in
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default RegisterPage;