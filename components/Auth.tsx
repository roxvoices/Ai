
import React, { useState } from 'react';
import { APP_NAME } from '../constants';

interface AuthProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (name: string, email: string, pass: string) => Promise<void>;
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
    setError('');
    setShowVerificationNotice(false);
    setLoading(true);
    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onRegister(name, email, password);
        setShowVerificationNotice(true);
      }
    } catch (err: any) {
      console.error("Auth error details:", err);
      const msg = err.message?.toLowerCase() || '';
      
      if (msg.includes('invalid login credentials')) {
        setError('The email or password you entered is incorrect. Please try again.');
      } else if (msg.includes('user already registered')) {
        setError('This email is already associated with an account.');
      } else if (msg.includes('email not confirmed')) {
        setError('Please check your email and confirm your account before logging in.');
      } else if (msg.includes('network error')) {
        setError('Connection failed. Please check your internet and try again.');
      } else {
        setError(err.message || 'An unexpected authentication error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showVerificationNotice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-full max-w-xl glass-panel rounded-[3rem] shadow-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Verification Sent</h2>
          <p className="text-slate-400 text-lg font-medium mb-8">
            Check <span className="text-blue-400 font-bold">{email}</span> for a confirmation link. 
            Once confirmed, you'll be able to access your professional voice studio.
          </p>
          
          <button 
            onClick={() => {
              setIsLogin(true);
              setShowVerificationNotice(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 animate-in fade-in duration-1000">
      <div className="w-full max-w-xl bg-[#0a0f1d] border border-white/10 rounded-[3rem] shadow-2xl p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="text-center mb-12 relative">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/20 transform -rotate-6 transition-transform hover:rotate-0">
             <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter">{isLogin ? 'Sign In' : 'Join Now'}</h2>
          <p className="text-slate-500 mt-4 text-lg font-medium">The Professional AI Vocal Engine.</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold rounded-2xl flex items-center gap-3 animate-in shake duration-500">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050914] border border-white/10 rounded-2xl p-5 text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050914] border border-white/10 rounded-2xl p-5 text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050914] border border-white/10 rounded-2xl p-5 text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-2xl shadow-2xl transition-all disabled:opacity-50 text-xl"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Login' : 'Register Account'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm text-slate-500 hover:text-white font-bold transition-colors"
          >
            {isLogin ? "New user?" : "Already registered?"} <span className="text-blue-500 ml-1">{isLogin ? 'Create Account' : 'Sign In'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
