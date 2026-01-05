
import React, { useState } from 'react';
import { APP_NAME } from '../constants';

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
  const [error, setError] = useState('');
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setShowVerificationNotice(false);
    setLoading(true);

    try {
      if (isLogin) {
        await onLogin(email, password);
        // App.tsx handles the state change via onAuthStateChange
      } else {
        const result = await onRegister(name, email, password);
        // If session is null, it means email confirmation is required
        if (result?.session === null) {
          setShowVerificationNotice(true);
        }
      }
    } catch (err: any) {
      console.error("Auth process error:", err);
      const msg = err.message?.toLowerCase() || '';
      const code = err.code || '';
      
      if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else if (msg.includes('user already registered') || code === 'user_already_exists') {
        setError('An account with this email already exists.');
      } else if (msg.includes('email not confirmed')) {
        setError('Please check your inbox and confirm your email before signing in.');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setError('Network error. Please check your internet connection.');
      } else if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
      } else {
        setError(err.message || 'Authentication failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showVerificationNotice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-full max-w-xl bg-[#0a0f1d] border border-white/10 rounded-[3rem] shadow-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Verification Sent</h2>
          <p className="text-slate-400 text-lg font-medium mb-8">
            Check <span className="text-blue-400 font-bold">{email}</span> for a confirmation link. 
            Confirm your account to access your studio.
          </p>
          
          <button 
            onClick={() => {
              setIsLogin(true);
              setShowVerificationNotice(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 animate-in fade-in duration-700">
      <div className="w-full max-w-xl bg-[#0a0f1d] border border-white/10 rounded-[3rem] shadow-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="text-center mb-10 relative">
          <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/20 transform -rotate-3 transition-transform hover:rotate-0">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">{isLogin ? 'Welcome Back' : 'Create Studio'}</h2>
          <p className="text-slate-500 mt-3 text-base font-medium">The Professional AI Vocal Engine.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-3 animate-in shake duration-300">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input
                required
                type="text"
                value={name}
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050914] border border-white/5 rounded-xl p-4 text-white text-sm font-medium focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-800"
                placeholder="John Doe"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <input
              required
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050914] border border-white/5 rounded-xl p-4 text-white text-sm font-medium focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-800"
              placeholder="studio@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input
              required
              type="password"
              value={password}
              autoComplete={isLogin ? "current-password" : "new-password"}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050914] border border-white/5 rounded-xl p-4 text-white text-sm font-medium focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-800"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-2xl transition-all disabled:opacity-50 text-sm uppercase tracking-[0.2em] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Securing...</span>
              </div>
            ) : isLogin ? 'Sign In' : 'Join Rox Studio'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs text-slate-500 hover:text-white font-bold transition-colors"
          >
            {isLogin ? "Don't have an account?" : "Already have an studio?"} 
            <span className="text-blue-500 ml-2 uppercase tracking-widest">{isLogin ? 'Register' : 'Login'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
