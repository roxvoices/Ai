
import React from 'react';
import { TRANSLATIONS } from '../../constants';

interface ToolProps {
  language: string;
}

export const Soundboard: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in-95">
      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-10 border border-white/5">
        <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19V6.204a1 1 0 00-.54-.853L5 4m.089 13.911C3.25 18.239 2 16.214 2 13.5c0-2.714 1.25-4.739 3.089-5.411m0 5.411a1 1 0 01.993-1.127h5.922a1 1 0 01.993 1.127V19M19 6.204a1 1 0 00-.54-.853L15 4m.089 13.911C20.75 18.239 22 16.214 22 13.5c0-2.714-1.25-4.739-3.089-5.411m0 5.411a1 1 0 01.993-1.127h5.922a1 1 0 01.993 1.127V19" strokeWidth="2"/></svg>
      </div>
      <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.soundboard}</h2>
      <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.underConstruction}</p>
    </div>
  );
};