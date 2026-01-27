

import React, { useState } from 'react';
import { User, AppTab } from '../types';
import { APP_NAME, LANGUAGES, TRANSLATIONS } from '../constants';
import { TopBar } from './TopBar';

// Rox Studio SVG Logo Component (Stylized)
const RoxStudioLogo = () => (
  <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17.5c0-1.41 1.01-2.61 2.44-2.92l4.12-1.03c.53-.13 1.08-.13 1.61 0l4.12 1.03C19.99 14.89 21 16.09 21 17.5V19h-2V17.5c0-.83-.67-1.5-1.5-1.5-.72 0-1.33.51-1.47 1.23l4.12 1.03c-.53.13-1.08.13-1.61 0l-4.12-1.03C6.33 16.51 5.72 17.12 5.58 17.83 5.43 17.12 4 15.93 4 14.5V5h2V14.5c0 .83.67 1.5 1.5 1.5.72 0 1.33-.51 1.47-1.23l4.12-1.03c-.53.13-1.08.13-1.61 0l-4.12-1.03C6.33 13.51 5.72 12.89 5.58 12.17 5.43 12.89 4 14.07 4 15.5V19H2z"/>
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


interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onLogout: () => void;
  language: string;
  onUpdateLanguage: (l: string) => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, user, activeTab, setActiveTab, language, onUpdateLanguage, onLoginClick, onRegisterClick, 
  onLogout
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const NavItem = ({ tab, label, icon }: { tab: AppTab, label: string, icon: React.ReactNode }) => (
    <button
      type="button" // Explicitly set type to button
      onClick={() => { setActiveTab(tab); toggleSidebar(); }} // Close sidebar on mobile after selection
      className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === tab 
          ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
          : 'text-slate-500 hover:text-white hover:bg-white/5'
      }`}
      aria-current={activeTab === tab ? 'page' : undefined} // ARIA attribute for current page
      aria-label={label}
    >
      <div className={`${activeTab === tab ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
        {icon}
      </div>
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      {activeTab === tab && <div className="absolute left-[-24px] w-1 h-6 bg-blue-500 rounded-r-full"></div>}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-[#020617] text-white">
      {/* Mobile Top Bar */}
      <TopBar 
        user={user} 
        onLogout={onLogout} 
        onLoginClick={onLoginClick} 
        onRegisterClick={onRegisterClick}
        toggleSidebar={toggleSidebar} 
        language={language}
      />

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[99] md:hidden" 
          onClick={toggleSidebar}
          role="presentation" // Indicate that this is a presentational element for overlay
          aria-hidden="true" // Hide from accessibility tree
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 border-r border-white/5 bg-[#020617] flex flex-col z-[100] 
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}
        role="navigation" // ARIA role for navigation
        aria-label="Main navigation" // ARIA label
      >
        <div className="p-8">
          <div className="flex items-center gap-3 group cursor-pointer" role="banner"> {/* ARIA role for banner/logo area */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <RoxStudioLogo /> {/* Use the new SVG logo component */}
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">Rox Studio</span>
          </div>
        </div>

        {/* Added overflow-y-auto to enable scrolling for navigation content */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {/* Dashboard */}
          <div className="px-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]" role="heading" aria-level={2}>{t.dashboard}</div>
          <NavItem tab="home" label={t.home} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="2"/></svg>} />
          
          {/* Audio Suite */}
          <div className="px-4 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]" role="heading" aria-level={2}>{t.audioSuite}</div>
          <NavItem tab="tts-studio" label={t.ttsStudio} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2"/></svg>} />
          <NavItem tab="merge-audio" label={t.mergeAudio} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeWidth="2"/></svg>} />
          <NavItem tab="trim-audio" label={t.trimAudio} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 10l-2 1m0 0l-2 1m2-1V3m2 7h-4M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0013.586 5H7a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/></svg>} />
          <NavItem tab="loop-audio" label={t.loopAudio} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m0 0H15" strokeWidth="2"/></svg>} />
          <NavItem tab="volume-booster" label={t.volumeBooster} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707c.2-.2.45-.293.707-.293h3.586c.26 0 .51.1.707.293l4.707 4.707c.2.2.293.45.293.707v3.586c0 .26-.1.51-.293.707l-4.707 4.707c-.2.2-.45-.293-.707-.293h-3.586c-.26 0-.51-.1-.707-.293L5.586 15z" strokeWidth="2"/></svg>} />
          <NavItem tab="add-fade" label={t.addFade} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 8h16M4 8l3-3m-3 3l3 3m10-3l3-3m-3 3l3 3" strokeWidth="2"/></svg>} />
          <NavItem tab="voice-recorder" label={t.voiceRecorder} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth="2.5"/></svg>} />
          <NavItem tab="convert-audio-format" label={t.convertAudioFormat} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeWidth="2"/></svg>} />

          {/* File Vault */}
          <div className="px-4 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]" role="heading" aria-level={2}>{t.fileVault}</div>
          <NavItem tab="pdf-to-text" label={t.pdfToText} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/></svg>} />
          <NavItem tab="text-to-pdf" label={t.textToPdf} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/><path d="M10 7v4l.5-1 .5 1V7m0 0h4m-4 0v4m0 0l.5-1 .5 1V7" strokeWidth="2"/></svg>} />
          <NavItem tab="pdf-to-word" label={t.pdfToWord} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/><path d="M12 7V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth="2"/></svg>} />
          <NavItem tab="word-to-pdf" label={t.wordToPdf} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0013.586 5H7a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/><path d="M10 7v4l.5-1 .5 1V7m0 0h4m-4 0v4m0 0l.5-1 .5 1V7" strokeWidth="2"/></svg>} />
          <NavItem tab="zip-extractor" label={t.zipExtractor} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" strokeWidth="2"/></svg>} />
          <NavItem tab="file-compressor" label={t.fileCompressor} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5"/></svg>} />
          <NavItem tab="image-resizer" label={t.imageResizer} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m0 0l-5 5M4 16v4m0 0h4m0 0l5-5m11 1v4m0 0h-4m0 0l-5-5" strokeWidth="2"/></svg>} />
          <NavItem tab="docx-to-pdf" label={t.docxToPdf} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/></svg>} />
          <NavItem tab="word-counter" label={t.wordCounter} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0013.586 5H7a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/><path d="M10 7v4l.5-1 .5 1V7m0 0h4m-4 0v4m0 0l.5-1 .5 1V7" strokeWidth="2"/></svg>} />

          {/* Media Lab */}
          <div className="px-4 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]" role="heading" aria-level={2}>{t.mediaLab}</div>
          <NavItem tab="video-to-audio" label={t.videoToAudio} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/><path d="M15 10l-4 4-4-4" strokeWidth="2"/></svg>} />
          <NavItem tab="gif-maker" label={t.gifMaker} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth="2"/></svg>} />
          <NavItem tab="meme-generator" label={t.memeGenerator} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19V6.204a1 1 0 00-.54-.853L5 4m.089 13.911C3.25 18.239 2 16.214 2 13.5c0-2.714 1.25-4.739 3.089-5.411m0 5.411a1 1 0 01.993-1.127h5.922a1 1 0 01.993 1.127V19M19 6.204a1 1 0 00-.54-.853L15 4m.089 13.911C20.75 18.239 22 16.214 22 13.5c0-2.714-1.25-4.739-3.089-5.411m0 5.411a1 1 0 01.993-1.127h5.922a1 1 0 01.993 1.127V19" strokeWidth="2"/></svg>} />

          {/* Playground */}
          <div className="px-4 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]" role="heading" aria-level={2}>{t.playground}</div>
          <NavItem tab="voice-changer" label={t.voiceChanger} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/><path d="M15 10l-4 4-4-4" strokeWidth="2"/></svg>} />
          <NavItem tab="soundboard" label={t.soundboard} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19V6.204a1 1 0 00-.54-.853L5 4m.089 13.911C3.25 18.239 2 16.214 2 13.5c0-2.714 1.25-4.739 3.089-5.411m0 5.411a1 1 0 01.993-1.127h5.922a1 1 0 01.993 1.127V19M19 6.204a1 1 0 00-.54-.853L15 4m.089 13.911C20.75 18.239 22 16.214 22 13.5c0-2.714-1.25-4.739-3.089-5.411m0 5.411a1 1 0 01.993-1.127h5.922a1 1 0 01.993 1.127V19" strokeWidth="2"/></svg>} />
          
          {/* Archives */}
          <div className="px-4 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]" role="heading" aria-level={2}>{t.archives}</div>
          <NavItem tab="history" label={t.vault} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" strokeWidth="2"/></svg>} />
          <NavItem tab="projects" label={t.projects} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth="2"/></svg>} />
          <NavItem tab="architect" label={t.voiceLab} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 3.86l-.477 2.387c-.037.186.046.37.209.47a2 2 0 001.022.547l2.387.477a6 6 0 003.86-3.86l.477-2.387c.037-.186-.046-.37-.209-.47z" strokeWidth="2"/></svg>} />
          
          {/* System */}
          <div className="px-4 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]" role="heading" aria-level={2}>{t.system}</div>
          <NavItem tab="settings" label={t.settings} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth="2"/></svg>} />

          {/* Legal */}
          <div className="px-4 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]" role="heading" aria-level={2}>{t.legal}</div>
          <NavItem tab="terms" label={t.terms} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/></svg>} />
          <NavItem tab="privacy" label={t.privacy} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2"/></svg>} />

        </nav>

        <div className="p-6 border-t border-white/5 mt-auto">
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{user.name}</p>
                <p className="text-[9px] text-blue-400 font-bold uppercase">{user.subscription}</p>
              </div>
            </div>
          )}
          <label htmlFor="language-select" className="sr-only">Select Language</label> {/* SR-only label */}
          <select 
            id="language-select"
            value={language} 
            onChange={(e) => onUpdateLanguage(e.target.value)}
            className="w-full mt-4 bg-transparent border-none text-[10px] font-black uppercase text-slate-500 focus:text-white transition-colors outline-none cursor-pointer"
            aria-label="Select application language"
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code} className="bg-[#020617]">{l.name}</option>)}
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-0 min-h-screen relative">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
          {children}
        </div>
      </main>
    </div>
  );
};
