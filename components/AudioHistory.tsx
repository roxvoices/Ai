

import React, { useState } from 'react';
import { TTSProject } from '../types';

interface AudioHistoryProps {
  projects: TTSProject[];
  onPlay: (url: string) => void;
  onDownload: (project: TTSProject) => void;
  onDelete: (id: string) => void;
  onCloseVault: () => void; // New prop
}

export const AudioHistory: React.FC<AudioHistoryProps> = ({ projects, onPlay, onDownload, onDelete, onCloseVault }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (projects.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95">
        <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-10 border border-white/5 group hover:border-blue-500/20 transition-all">
          <svg className="w-10 h-10 text-slate-700 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth="2"/></svg>
        </div>
        <h3 className="text-4xl font-black uppercase italic tracking-tighter">Vault Empty</h3>
        <p className="text-slate-500 font-medium max-w-sm text-sm mt-4 uppercase tracking-widest opacity-60">Synthesize your first master clip to populate the archives.</p>
        <button 
          type="button"
          onClick={onCloseVault}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
        >
          Return to Studio
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-1000">
      <header className="flex items-center justify-between border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Audio Vault</h2>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.3em] mt-1">{projects.length} Encrypted Assets</p>
        </div>
        <button 
          type="button"
          onClick={onCloseVault}
          className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
          title="Close Vault and return to Studio"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5"/></svg>
        </button>
      </header>

      <div className="grid gap-6">
        {projects.map((p, idx) => (
          <div 
            key={p.id} 
            className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-6 sm:p-8 transition-all hover:bg-[#1e293b] hover:border-white/10 hover:shadow-2xl animate-in slide-in-from-bottom-8"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Play Button */}
            <button 
              type="button"
              onClick={() => onPlay(p.audioUrl)}
              className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all flex-shrink-0"
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>

            {/* Content Info */}
            <div className="flex-1 min-w-0 w-full"> {/* Added w-full for better stacking */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{p.voiceName}</span>
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">•</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.settings.expression}</span>
              </div>
              <h4 className="text-lg font-bold text-white line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">{p.text}</h4>
              
              {/* Pseudo Waveform */}
              <div className="flex items-end gap-1 h-8 mt-6 opacity-30 group-hover:opacity-60 transition-all">
                {[...Array(40)].map((_, i) => (
                  <div key={i} className="flex-1 bg-blue-400 rounded-full" style={{ height: `${20 + (Math.sin(i * 0.5) + 1) * 40}%` }}></div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-4 sm:pt-0 pr-0 sm:pr-4 w-full sm:w-auto"> {/* Adjusted for mobile */}
              <button 
                type="button"
                onClick={() => handleCopyLink(p.audioUrl, p.id)}
                className={`p-3 rounded-xl transition-all ${copiedId === p.id ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                title="Copy Link"
              >
                {copiedId === p.id ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2.5"/></svg>}
              </button>
              <button 
                type="button"
                onClick={() => onDownload(p)}
                className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"
                title="Download"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5"/></svg>
              </button>
              <button 
                type="button"
                onClick={() => onDelete(p.id)}
                className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-red-500 transition-all"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};