
import React from 'react';
import { TRANSLATIONS } from '../../constants';

interface ToolProps {
  language: string;
}

export const ZipExtractor: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in-95">
      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-10 border border-white/5">
        <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" strokeWidth="2"/></svg>
      </div>
      <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.zipExtractor}</h2>
      <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.underConstruction}</p>
    </div>
  );
};