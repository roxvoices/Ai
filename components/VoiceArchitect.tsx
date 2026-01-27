

import React, { useState } from 'react';
import { architectVoiceProfile } from '../services/geminiTTS';
import { VoiceName, TTSSettings, CustomVoiceProfile } from '../types';

interface VoiceArchitectProps {
  onApplyProfile: (voice: VoiceName, settings: TTSSettings) => void;
  onSaveProfile: (profile: CustomVoiceProfile) => void;
}

export const VoiceArchitect: React.FC<VoiceArchitectProps> = ({ onApplyProfile, onSaveProfile }) => {
  const [description, setDescription] = useState('');
  const [customName, setCustomName] = useState('');
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [result, setResult] = useState<{voice: VoiceName, settings: TTSSettings} | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleArchitect = async () => {
    if (!description.trim()) return;
    setIsArchitecting(true);
    setResult(null);
    setIsSaved(false);
    try {
      const data = await architectVoiceProfile(description);
      setResult({ voice: data.baseVoice, settings: data.settings });
    } catch (error) {
      alert("Neural mapping failed. Refine description.");
    } finally {
      setIsArchitecting(false);
    }
  };

  const handleSave = () => {
    if (!result || !customName.trim()) return;
    const profile: CustomVoiceProfile = {
      id: Math.random().toString(36).substring(2, 9),
      name: customName.trim(),
      description: description.substring(0, 100),
      baseVoice: result.voice,
      settings: result.settings
    };
    onSaveProfile(profile);
    setIsSaved(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="text-center">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter">Voice Architect</h1>
        <p className="text-slate-500 text-lg font-medium mt-4 max-w-2xl mx-auto uppercase tracking-widest opacity-60">
          Describe a persona. The neural engine will map its vocal architecture.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="relative w-full h-80 bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-10 text-white text-xl font-medium outline-none transition-all placeholder:text-slate-800 focus:placeholder:text-slate-700 leading-relaxed"
              placeholder="e.g. A world-weary traveler with a deep, rasping baritone and a slight cynical edge..."
            />
          </div>

          <button
            type="button"
            onClick={handleArchitect}
            disabled={isArchitecting || !description.trim()}
            className="w-full py-6 bg-white text-black font-black rounded-3xl text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:bg-slate-800 disabled:text-slate-600"
          >
            {isArchitecting ? "Processing Neural Matrix..." : "Begin Neural Mapping"}
          </button>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-[#0f172a] border border-blue-500/20 rounded-[3rem] p-10 space-y-10 animate-in zoom-in-95">
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase italic">Profile Result</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Architected Engine Map</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DataCard label="Model" value={result.voice} />
                <DataCard label="Pitch" value={result.settings.pitch.toFixed(2)} />
                <DataCard label="Speed" value={result.settings.speed.toFixed(2)} />
                <DataCard label="Mood" value={result.settings.expression} />
              </div>

              <div className="space-y-4 pt-6">
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="ID Descriptor"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none text-center text-xs uppercase tracking-widest"
                />
                <div className="flex gap-3">
                  <button type="button" onClick={handleSave} disabled={isSaved || !customName.trim()} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button type="button" onClick={() => onApplyProfile(result.voice, result.settings)} className="flex-1 py-4 bg-white/5 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">
                    Load Studio
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/5 rounded-[3rem] flex items-center justify-center p-12 text-center opacity-30">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Awaiting Input Map</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DataCard = <T extends string | number | undefined>({ label, value }: { label: string, value: T }) => (
  <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
    <span className="block text-[8px] font-black text-slate-600 uppercase mb-2">{label}</span>
    <span className="text-sm font-black text-white uppercase italic">{value}</span>
  </div>
);