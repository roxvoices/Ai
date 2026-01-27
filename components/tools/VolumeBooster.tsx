
import React from 'react';
import { TRANSLATIONS } from '../../constants';

interface ToolProps {
  language: string;
}

export const VolumeBooster: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in-95">
      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-10 border border-white/5">
        <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707c.2-.2.45-.293.707-.293h3.586c.26 0 .51.1.707.293l4.707 4.707c.2.2.293.45.293.707v3.586c0 .26-.1.51-.293.707l-4.707 4.707c-.2.2-.45.293-.707.293h-3.586c-.26 0-.51-.1-.707-.293L5.586 15z" strokeWidth="2"/></svg>
      </div>
      <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.volumeBooster}</h2>
      <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.underConstruction}</p>
    </div>
  );
};