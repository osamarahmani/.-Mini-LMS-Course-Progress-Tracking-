import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error on new attempt

    try {
      // The API call now throws an error if res.ok is false
      const res = await requestPasswordReset(email);

      if (res && res.token) {
        // ✅ SUCCESS: User exists, redirect immediately to the reset page
        navigate(`/reset-password/${res.token}`);
      }
    } catch (err) {
      // 🎯 FIX: Since api/index.js throws a new Error, we catch it here
      // This will capture "User does not exist. Please register first."
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] border border-stone-200 p-12 shadow-2xl text-center">
        
        <h2 className="text-3xl font-black text-stone-900 uppercase italic tracking-tighter mb-2">
          Verify Email
        </h2>
        <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
          Confirm your account to update password
        </p>

        {/* 🚨 ERROR MESSAGE DISPLAY: Shows red box if error state has a value */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleRequest} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">
              Email Address
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(""); // Clear error as user types
              }}
              className={`w-full bg-stone-50 border ${error ? 'border-red-300 ring-1 ring-red-100 shadow-sm' : 'border-stone-200'} rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all`}
              placeholder="name@example.com"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-amber-500 text-white hover:text-stone-900 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Verifying...' : 'Verify & Proceed'}
          </button>
        </form>
        
        <button 
          onClick={() => navigate('/login')}
          className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 hover:text-stone-900 transition-colors"
        >
          Cancel Request
        </button>
      </div>
    </div>
  );
}