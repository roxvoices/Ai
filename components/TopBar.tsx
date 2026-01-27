
import React from 'react';
import { User } from '../types';
import { TRANSLATIONS } from '../constants';

// Rox Studio SVG Logo Component (Stylized)
const RoxStudioLogo = () => (
  <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17.5c0-1.41 1.01-2.61 2.44-2.92l4.12-1.03c.53-.13 1.08-.13 1.61 0l4.12 1.03C19.99 14.89 21 16.09 21 17.5V19h-2V17.5c0-.83-.67-1.5-1.5-1.5-.72 0-1.33.51-1.47 1.23l-4.12 1.03c-.53.13-1.08.13-1.61 0l-4.12-1.03C6.33 16.51 5.72 17.12 5.58 17.83 5.43 17.12 4 15.93 4 14.5V5h2V14.5c0 .83.67 1.5 1.5 1.5.72 0 1.33-.51 1.47-1.23l4.12-1.03c-.53.13-1.08.13-1.61 0l-4.12-1.03C6.33 13.51 5.72 12.89 5.58 12.17 5.43 12.89 4 14.07 4 15.5V19H2z"/>
    <path d="M4 10h3v4H4zM9 10h3v4H9zM14 10h3v4h-3z"/>
    {/* Stylized R within a soundwave/studio concept */}
    <path d="M7 5L12 2L17 5V10L12 13L7 10Z" fill="url(#gradientRox)" stroke="none"/>
    <defs>
      <linearGradient id="gradientRox" x1="7" y1="2" x2="17" y2="13" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
  </svg>
);


interface TopBarProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  toggleSidebar: () => void;
  language: string;
}

export const TopBar: React.FC<TopBarProps> = ({ user, onLogout, onLoginClick, onRegisterClick, toggleSidebar, language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <nav className="fixed md:hidden top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#020617]/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button type="button" onClick={toggleSidebar} className="text-slate-400 hover:text-white transition-colors">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2.5"/></svg>
        </button>

        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <RoxStudioLogo /> {/* Use the new SVG logo component */}
          </div>
          <span className="text-lg font-black tracking-tighter uppercase italic">Rox Studio</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                {user.name.charAt(0)}
              </div>
              <button type="button" onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                {t.logout}
              </button>
            </div>
          ) : (
            <>
              <button type="button" onClick={onLoginClick} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white px-2 transition-colors">
                {t.login}
              </button>
              <button 
                type="button"
                onClick={onRegisterClick}
                className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full transition-all hover:bg-blue-50 hover:shadow-xl hover:shadow-white/10 active:scale-95"
              >
                {t.register}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
