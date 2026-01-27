
import React from 'react';
import { TRANSLATIONS } from '../../constants';

interface ToolProps {
  language: string;
}

export const WordToPdf: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in-95">
      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-10 border border-white/5">
        <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0013.586 5H7a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/><path d="M10 7v4l.5-1 .5 1V7m0 0h4m-4 0v4m0 0l.5-1 .5 1V7" strokeWidth="2"/></svg>
      </div>
      <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.wordToPdf}</h2>
      <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.underConstruction}</p>
      <p className="text-slate-600 text-sm italic mt-2">This feature requires advanced server-side processing for accurate document conversion.</p>
    </div>
  );
};