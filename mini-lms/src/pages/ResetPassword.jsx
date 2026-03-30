import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api'; // You'll need to add this to api.js

export default function ResetPassword() {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();
  
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await resetPassword(token, passwords.new);
      alert("Password updated successfully!");
      navigate('/login');
    } catch (err) {
      setError("Token expired or invalid. Please request a new link.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-stone-200 p-10 shadow-xl">
        <h2 className="text-3xl font-black text-stone-900 uppercase italic tracking-tighter mb-2 text-center">Set New Password</h2>
        <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-center">Secure your account with a new credential</p>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">New Password</label>
            <input 
              type="password" 
              required
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">Confirm New Password</label>
            <input 
              type="password" 
              required
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-emerald-500 text-white hover:text-stone-900 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}