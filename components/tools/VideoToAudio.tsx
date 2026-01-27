
import React from 'react';
import { TRANSLATIONS } from '../../constants';

interface ToolProps {
  language: string;
}

export const VideoToAudio: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in-95">
      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-10 border border-white/5">
        <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/><path d="M15 10l-4 4-4-4" strokeWidth="2"/></svg>
      </div>
      <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.videoToAudio}</h2>
      <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.underConstruction}</p>
      <p className="text-slate-600 text-sm italic mt-2">
        {t.videoToAudioDescription.includes('server-side processing') ? 
         t.videoToAudioDescription.split('. This feature')[0] + '. This feature requires advanced server-side processing for optimal performance and compatibility across all video formats. Coming soon.' :
         "Extracting audio from video on the client-side is complex and often unreliable. This feature requires advanced server-side processing for optimal performance and compatibility across all video formats. Coming soon."}
      </p>
    </div>
  );
};