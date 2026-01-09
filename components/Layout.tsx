
import React, { useState, useRef, useEffect } from 'react';
import { User, AppTab } from '../types';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onLogout: () => void;
}

type LegalType = 'terms' | 'privacy' | 'copyright' | null;

export const Layout: React.FC<LayoutProps> = ({ children, user, activeTab, setActiveTab, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeLegal = () => setActiveLegal(null);

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden" style={{backgroundColor: 'var(--bg-deep)'}}>
      {/* Legal Modal Overlay */}
      {activeLegal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0a0f1d] border border-white/10 w-full max-w-2xl max-h-[80vh] rounded-[2rem] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
                {activeLegal === 'terms' && 'Terms & Conditions'}
                {activeLegal === 'privacy' && 'Privacy Policy'}
                {activeLegal === 'copyright' && 'Copyright Notice'}
              </h2>
              <button onClick={closeLegal} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div className="p-6 md:p-10 overflow-y-auto text-slate-400 text-sm md:text-base leading-relaxed space-y-6">
              {activeLegal === 'terms' && (
                <>
                  <p>Welcome to {APP_NAME}. By using our service, you agree to these terms. Our platform provides AI-generated voice synthesis for personal and commercial use based on your subscription tier.</p>
                  <h3 className="text-white font-bold">1. Usage Limits</h3>
                  <p>Users must adhere to the character limits defined in their specific plan. Character counts are reset periodically (Daily, Monthly, or Yearly) according to the UTC+2 (CAT) timezone.</p>
                  <h3 className="text-white font-bold">2. Payment & Activations</h3>
                  <p>Manual payment processing requires admin approval. Screenshots must be valid and authentic. Plans are activated only after verification of payment.</p>
                  <h3 className="text-white font-bold">3. Prohibited Content</h3>
                  <p>Users may not use our service to generate hate speech, harassment, or fraudulent audio content. We reserve the right to terminate accounts for violations.</p>
                </>
              )}
              {activeLegal === 'privacy' && (
                <>
                  <p>Your privacy is paramount. {APP_NAME} collects only the data necessary to provide and secure our services.</p>
                  <h3 className="text-white font-bold">1. Data Storage</h3>
                  <p>We store your account credentials, voiceover history, and custom voice profiles securely on cloud servers provided by Supabase. Audio files are stored as blob data linked to your profile.</p>
                  <h3 className="text-white font-bold">2. Encryption</h3>
                  <p>All communication between your browser and our servers is encrypted using industry-standard SSL technology.</p>
                  <h3 className="text-white font-bold">3. Third Parties</h3>
                  <p>We do not sell your personal data. We use Google Gemini API for voice synthesis; text sent for synthesis is governed by their enterprise privacy standards.</p>
                </>
              )}
              {activeLegal === 'copyright' && (
                <>
                  <p>© 2025 {APP_NAME}. All rights reserved. The {APP_NAME} brand, logo, and platform architecture are the intellectual property of our company.</p>
                  <h3 className="text-white font-bold">User Content</h3>
                  <p>Users retain the rights to the scripts they input. The usage rights for the generated audio output are granted based on your subscription plan. Starter and higher tiers include commercial usage rights.</p>
                </>
              )}
            </div>
            <div className="p-6 bg-white/5 flex justify-end">
              <button onClick={closeLegal} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all">I Understand</button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b z-50 glass-panel px-4 md:px-8 flex items-center justify-between" style={{borderColor: 'var(--border-color)'}}>
        <div className="flex items-center gap-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2"/></svg>
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('generate')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth="2"/></svg>
            </div>
            <span className="font-black text-xl text-white tracking-tighter">{APP_NAME}</span>
          </div>
        </div>

        {user && (
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-[10px] font-black text-white leading-none mb-0.5">{user.name}</div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{user.subscription}</div>
              </div>
              <svg className={`w-3 h-3 text-slate-500 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-2xl border-white/10 p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                <div className="px-3 py-3 border-b border-white/5 mb-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Account</p>
                  <p className="text-xs font-bold text-white truncate">{user.email}</p>
                  <div className="mt-2 inline-block px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] font-black text-blue-400 uppercase">
                    {user.subscription} Plan
                  </div>
                </div>
                
                <div className="space-y-1">
                  <button 
                    onClick={() => { setActiveTab('premium'); setProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all text-xs font-bold"
                  >
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2"/></svg>
                    Upgrade Plan
                  </button>
                  <button 
                    onClick={() => { setActiveTab('settings'); setProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all text-xs font-bold"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth="2"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/></svg>
                    Settings
                  </button>
                  <button 
                    onClick={() => { onLogout(); setProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all text-xs font-bold mt-2 pt-2 border-t border-white/5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Navigation Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 border-r p-6 flex flex-col z-40 transition-transform pt-20 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`} style={{backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)'}}>
        <nav className="flex flex-col gap-1 flex-1">
          <NavItem active={activeTab === 'generate'} onClick={() => { setActiveTab('generate'); setMobileMenuOpen(false); }} label="Studio" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" strokeWidth="2"/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>} />
          <NavItem active={activeTab === 'architect'} onClick={() => { setActiveTab('architect'); setMobileMenuOpen(false); }} label="Voice Lab" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.387a6 6 0 00-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.162 1.162a2 2 0 01-2.828 0l-.634-.634A2 2 0 010 14.243V4a2 2 0 012-2h16a2 2 0 012 2v11.428z" strokeWidth="2"/></svg>} />
          <NavItem active={activeTab === 'history'} onClick={() => { setActiveTab('history'); setMobileMenuOpen(false); }} label="Library" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" strokeWidth="2"/></svg>} />
          <NavItem active={activeTab === 'premium'} onClick={() => { setActiveTab('premium'); setMobileMenuOpen(false); }} label="Subscription" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>} />
          
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 mb-2">Management</p>
              <NavItem active={activeTab === 'admin'} onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); window.history.pushState({}, '', '/admin'); }} label="Admin Panel" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2"/></svg>} />
            </div>
          )}
        </nav>

        {/* Sidebar Footer (Legal) */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <button onClick={() => setActiveLegal('privacy')} className="text-[10px] text-slate-500 hover:text-white transition-colors text-left font-bold uppercase tracking-widest">Privacy Policy</button>
            <button onClick={() => setActiveLegal('terms')} className="text-[10px] text-slate-500 hover:text-white transition-colors text-left font-bold uppercase tracking-widest">Terms of Service</button>
            <button onClick={() => setActiveLegal('copyright')} className="text-[10px] text-slate-500 hover:text-white transition-colors text-left font-bold uppercase tracking-widest">Copyright Notice</button>
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">© 2025 Rox Voices</span>
             <span className="text-[8px] font-medium text-slate-800 uppercase tracking-widest">All Rights Reserved</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto pt-16 px-4 md:px-12 pb-20 scroll-smooth">
        <div className="max-w-5xl mx-auto w-full py-8 md:py-12">
          {children}
        </div>
        
        {/* App Footer */}
        <footer className="max-w-5xl mx-auto w-full pt-20 pb-12 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth="2"/></svg>
              </div>
              <span className="font-black text-white tracking-tighter uppercase text-sm">{APP_NAME}</span>
            </div>
            <p className="text-xs font-medium text-slate-500 max-w-xs">The world's most advanced AI vocal synthesizer. Create realistic, expressive audio for any medium instantly.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://wa.me/260765546444" target="_blank" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Support</a>
            <button onClick={() => setActiveLegal('terms')} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Terms</button>
            <button onClick={() => setActiveLegal('privacy')} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacy</button>
            <button onClick={() => setActiveLegal('copyright')} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Copyright</button>
          </div>
        </footer>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, label, icon }: any) => (
  <button 
    onClick={onClick} 
    className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-widest transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-slate-600 group-hover:text-blue-500'} transition-colors`}>
      {icon}
    </div>
    {label}
  </button>
);
