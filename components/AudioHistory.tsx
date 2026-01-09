
import React from 'react';
import { TTSProject } from '../types';

interface AudioHistoryProps {
  projects: TTSProject[];
  onPlay: (url: string) => void;
  onDownload: (project: TTSProject) => void;
  onDelete: (id: string) => void;
}

export const AudioHistory: React.FC<AudioHistoryProps> = ({ projects, onPlay, onDownload, onDelete }) => {
  if (projects.length === 0) {
    return (
      <div className="py-12 md:py-20 flex flex-col items-center justify-center opacity-40 text-center px-4">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6 md:mb-8 border border-blue-500/20">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth="2"/></svg>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-2">No audio clips yet</h3>
        <p className="text-slate-500 font-medium text-sm md:text-base max-w-sm">Write your script above and press 'Generate' to create your first high-quality voiceover.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 pb-16 animate-in fade-in duration-700 w-full">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 px-2">
        <h2 className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-[0.4em]">Your Creations</h2>
        <span className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest">{projects.length} Clips saved</span>
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        {projects.map((p) => (
          <div key={p.id} className="group flex flex-col gap-3 md:gap-4 animate-in slide-in-from-bottom-8">
            
            {/* User Script Bubble */}
            <div className="flex justify-end">
              <div className="max-w-[85%] md:max-w-[70%] bg-[#0f172a] border border-white/10 rounded-2xl md:rounded-[2rem] p-4 md:p-6 text-sm md:text-lg text-slate-300 font-medium leading-relaxed shadow-xl">
                {p.text}
              </div>
            </div>

            {/* AI Response / Audio Bubble */}
            <div className="flex justify-start">
              <div className="bg-[#0a0f1d] border border-blue-500/30 rounded-2xl md:rounded-[2.5rem] p-4 md:p-6 w-full max-w-xl shadow-2xl group/bubble transition-transform hover:scale-[1.01]">
                <div className="flex items-center gap-4 md:gap-6">
                  <button 
                    onClick={() => onPlay(p.audioUrl)}
                    className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex-shrink-0"
                  >
                    <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <span className="text-[8px] md:text-[10px] font-black text-blue-500 uppercase tracking-[0.1em] truncate">{p.voiceName} • {p.settings.expression}</span>
                      <span className="text-[8px] md:text-[9px] text-slate-600 font-mono font-bold whitespace-nowrap ml-2">{new Date(p.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    {/* Visualizer bar */}
                    <div className="h-1.5 md:h-2 w-full bg-slate-800/50 rounded-full overflow-hidden flex gap-0.5 md:gap-1 items-center px-0.5 md:px-1">
                      {[...Array(20)].map((_, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-blue-500/30 rounded-full"
                          style={{ height: `${20 + (i % 5) * 20}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-1 md:gap-2 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/5 opacity-100 md:opacity-0 group-hover/bubble:opacity-100 transition-all">
                  <button 
                    onClick={() => onDownload(p)} 
                    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-[8px] md:text-[10px] font-black uppercase text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Download
                  </button>
                  <button 
                    onClick={() => onDelete(p.id)} 
                    className="p-1.5 md:p-2 text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete Clip"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
