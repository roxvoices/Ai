
import React, { useState } from 'react';
import { architectVoiceProfile } from '../services/geminiTTS';
import { VoiceName, TTSSettings } from '../types';

interface VoiceArchitectProps {
  onApplyProfile: (voice: VoiceName, settings: TTSSettings) => void;
}

export const VoiceArchitect: React.FC<VoiceArchitectProps> = ({ onApplyProfile }) => {
  const [description, setDescription] = useState('');
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [result, setResult] = useState<{voice: VoiceName, settings: TTSSettings} | null>(null);

  const handleArchitect = async () => {
    if (!description.trim()) return;
    setIsArchitecting(true);
    try {
      const data = await architectVoiceProfile(description);
      setResult({ voice: data.baseVoice, settings: data.settings });
    } catch (error) {
      alert("Failed to create voice. Try a different description.");
    } finally {
      setIsArchitecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700 px-2">
      <header className="text-center">
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4 md:mb-6">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
          AI Voice Lab
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Create Your Own Voice</h2>
        <p className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto font-medium">
          Just describe how the voice should sound—age, mood, or personality—and we'll build it for you.
        </p>
      </header>

      <div className="bg-[#0a0f1d] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl relative group overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none transition-all group-hover:bg-blue-600/20"></div>
        
        <div className="relative space-y-6 md:space-y-8">
          <div className="space-y-3 md:space-y-4">
            <label className="block text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-2">Describe the Voice</label>
            <div className="relative">
               <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 md:h-48 bg-[#050914] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white font-medium focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-800 text-base md:text-xl leading-relaxed"
                placeholder="Example: A calm middle-aged woman with a professional tone, speaking slowly and clearly..."
              />
            </div>
          </div>

          <button
            onClick={handleArchitect}
            disabled={isArchitecting || !description.trim()}
            className="w-full py-4 md:py-6 bg-white hover:bg-blue-50 disabled:bg-slate-800 disabled:text-slate-600 text-[#020617] font-black rounded-xl md:rounded-[2rem] transition-all flex items-center justify-center gap-3 text-lg md:text-xl shadow-xl active:scale-[0.99]"
          >
            {isArchitecting ? (
              <span className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Creating Voice...
              </span>
            ) : "Create Voice Profile"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-blue-600 border border-blue-400/30 rounded-2xl md:rounded-[3rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 shadow-2xl shadow-blue-600/20 animate-in zoom-in-95 duration-300">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-3xl font-black text-white mb-2">Voice Ready!</h3>
            <p className="text-blue-100 font-medium text-xs md:text-base">We've tailored the engine based on your description.</p>
          </div>
          <button
            onClick={() => onApplyProfile(result.voice, result.settings)}
            className="w-full md:w-auto px-8 md:px-10 py-4 md:py-5 bg-[#020617] text-white font-black rounded-xl md:rounded-2xl hover:bg-slate-900 transition-all shadow-2xl active:scale-95"
          >
            Use in Studio
          </button>
        </div>
      )}
    </div>
  );
};
