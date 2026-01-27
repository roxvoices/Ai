
import React from 'react';
import { TRANSLATIONS } from '../../constants';

interface ToolProps {
  language: string;
}

export const ImageResizer: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in-95">
      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-10 border border-white/5">
        <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m0 0l-5 5M4 16v4m0 0h4m0 0l5-5m11 1v4m0 0h-4m0 0l-5-5" strokeWidth="2"/></svg>
      </div>
      <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.imageResizer}</h2>
      <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.underConstruction}</p>
    </div>
  );
};