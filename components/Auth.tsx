
import React, { useState, useEffect } from 'react';
import { APP_NAME } from '../constants';
import { BACKEND_BASE_URL } from '../services/geminiTTS'; // Import backend URL for error messages

interface AuthProps {
  onLogin: (email: string, pass: string) => Promise<any>;
  onRegister: (name: string, email: string, pass: string) => Promise<any>;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);

  // Safety valve: Supabase free projects pause after inactivity.
  // Waking them up can take 20-40 seconds.
  useEffect(() => {
    let wakeTimer: any;
    let failTimer: any;
    
    // Only show waking up if loading AND no specific error has been set yet
    if (loading && !error) { 
      wakeTimer = setTimeout(() => {
        setIsWakingUp(true);
      }, 8000);

      // Set a longer timeout for "failed to wake up"
      failTimer = setTimeout(() => {
        if (loading) { // Only set error if still loading
          setLoading(false);
          setIsWakingUp(false);
          setError('The Rox Studio backend is taking longer than usual to wake up. This happens if the system has been inactive. Please ensure your Render.com backend is active and accessible, then try again.');
        }
      }, 60000); // 60 seconds
    } else {
      setIsWakingUp(false); // Reset if not loading or if an error is present
    }
    
    return () => {
      clearTimeout(wakeTimer);
      clearTimeout(failTimer);
    };
  }, [loading, error]); // Add error to dependency array

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setShowVerificationNotice(false);
    setLoading(true); // Start loading
    setIsWakingUp(false); // Reset waking up state at the start of new submission

    try {
      if (isLogin) {
        // Explicitly check for error in the onLogin response
        const { error: loginError } = await onLogin(email, password);
        if (loginError) {
          throw loginError; // Throw the error to be caught by the outer catch block
        }
        // If no loginError, App.tsx's onAuthStateChange handles SIGNED_IN and updates user state,
        // which causes Auth.tsx to unmount, so no further action needed here for success.
      } else { // Registration path
        const { data, error: signUpError } = await onRegister(name, email, password);
        
        if (signUpError) {
          throw signUpError; // Re-throw to be caught by the outer catch block
        }

        if (data?.session === null) { 
          setShowVerificationNotice(true);
        }
        // If data.session is NOT null, it means the user was immediately logged in (e.g., email confirmation off)
        // In this case, App.tsx's onAuthStateChange will handle it, and Auth.tsx will unmount.
      }
    } catch (err: any) {
      console.error("Auth process error details:", err);
      
      const msg = err.message?.toLowerCase() || '';
      
      if (err.name === 'TypeError' && msg.includes('failed to fetch')) {
        setError(`Connection Error: Cannot reach the Rox Studio backend server at ${BACKEND_BASE_URL}. This usually means the server is not running or is unreachable. Please ensure your Render.com backend is active and accessible, then try again.`);
      } else if (err.code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
        setError('Access Denied: Please check your email and password.');
      } else if (msg.includes('email not confirmed')) {
        setError('Activation Required: Please check your email and click the confirmation link.');
      } else if (msg.includes('user already registered')) {
        setError('Account Exists: This email is already tied to a studio account. Please sign in or use a different email.'); // More informative
      } else if (password.length < 6) {
        setError('Security Requirement: Passwords must be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication encountered an unexpected error. Please try again.');
      }
    } finally {
      // Always set loading to false after attempt, whether success or fail.
      // This ensures the button becomes clickable again.
      setLoading(false);
      setIsWakingUp(false); // Also ensure wakingUp indicator is cleared.
    }
  };

  if (showVerificationNotice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 animate-in fade-in zoom-in-95 duration-500 text-center">
        <div className="w-full max-w-xl bg-[#0a0f1d] border border-white/10 rounded-[3rem] p-12 shadow-2xl">
          <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Check Your Inbox</h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">We've sent a secure activation link to <span className="text-blue-400 font-bold">{email}</span>. Please click it to finalize your studio setup.</p>
          <button type="button" onClick={() => { setIsLogin(true); setShowVerificationNotice(false); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs">Back to Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 animate-in fade-in duration-700">
      <div className="w-full max-w-xl bg-[#0a0f1d] border border-white/10 rounded-[3rem] shadow-2xl p-8 md:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="text-center mb-10 relative">
          <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/20 transform -rotate-3 hover:rotate-0 transition-transform">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{isLogin ? 'Welcome Back' : 'Create Studio'}</h2>
          <p className="text-slate-500 mt-3 font-medium tracking-wide">Elite Neural Vocal Synthesis Engine.</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-4 animate-in shake duration-300">
            <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
            </div>
            <p className="leading-relaxed flex-1">{error}</p>
          </div>
        )}

        {isWakingUp && !error && (
          <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 animate-pulse">
            <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            System Waking Up...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#050914] border border-white/5 rounded-2xl p-4 text-white text-sm outline-none transition-all placeholder:text-slate-800 focus:ring-1 focus:ring-blue-500" placeholder="e.g. Marcus Aurelius" />
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#050914] border border-white/5 rounded-2xl p-4 text-white text-sm outline-none transition-all placeholder:text-slate-800 focus:ring-1 focus:ring-blue-500" placeholder="studio@roxstudio.ai" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#050914] border border-white/5 rounded-2xl p-4 text-white text-sm outline-none transition-all placeholder:text-slate-800 focus:ring-1 focus:ring-blue-500" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-2xl transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em] active:scale-95 mt-4">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            ) : isLogin ? 'Sign In' : 'Register Studio'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-[10px] text-slate-500 hover:text-white font-black transition-colors uppercase tracking-[0.2em]">
            {isLogin ? "No studio account? Register Now" : "Existing Member? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};