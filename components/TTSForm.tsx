

import React, { useState, useEffect, useRef } from 'react';
import { VOICES, EXPRESSIONS, PLAN_LIMITS, TRANSLATIONS } from '../constants';
import { VoiceName, TTSSettings, CustomVoiceProfile, Plan, VoiceDefinition } from '../types';
import { generateTTS } from '../services/geminiTTS';

interface TTSFormProps {
  onGenerate: (text: string, voice: VoiceName, settings: TTSSettings) => Promise<void>;
  onSaveProject: (name: string, text: string, voice: VoiceName, settings: TTSSettings) => Promise<void>;
  isLoading: boolean;
  prefill?: { voice: VoiceName, settings: TTSSettings, text?: string };
  customVoices: CustomVoiceProfile[];
  charsUsed: number;
  subscription: Plan;
  language: string;
}

// The createWavHeader function is no longer needed on the frontend as the backend
// now returns a complete base64-encoded WAV file.


export const TTSForm: React.FC<TTSFormProps> = ({ 
  onGenerate, onSaveProject, isLoading, prefill, customVoices, charsUsed, subscription, language 
}) => {
  const [text, setText] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(VOICES[0].id);
  const [settings, setSettings] = useState<TTSSettings>(VOICES[0].defaultSettings);
  const [activeMenu, setActiveMenu] = useState<'voice' | 'settings' | 'expression' | 'save' | null>(null);
  const [projectName, setProjectName] = useState('');
  const [isPreviewing, setIsPreviewing] = useState<string | null>(null);
  
  const formRef = useRef<HTMLDivElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const totalLimit = PLAN_LIMITS[subscription] || 500;
  const remaining = Math.max(0, totalLimit - charsUsed);
  const isLimitReached = text.length > remaining;

  useEffect(() => {
    if (prefill) {
      if (prefill.text) setText(prefill.text);
      setSettings(prefill.settings);
      const matchingVoice = VOICES.find(v => v.baseVoice === prefill.voice);
      if (matchingVoice) setSelectedVoiceId(matchingVoice.id);
    }
  }, [prefill]);

  const handleVoiceSelect = (v: VoiceDefinition) => {
    setSelectedVoiceId(v.id);
    setSettings(v.defaultSettings);
    setActiveMenu(null);
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }));
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }));
  };

  const handlePreview = async (e: React.MouseEvent, voiceDef: VoiceDefinition) => {
    e.stopPropagation();
    if (isPreviewing) return;
    setIsPreviewing(voiceDef.id);
    try {
      // Pass a dummy user ID ("preview_user_id") so backend doesn't count against quota
      const { audioUrl } = await generateTTS(voiceDef.previewText, voiceDef.baseVoice, voiceDef.defaultSettings, "preview_user_id", voiceDef.previewText.length);
      
      if (previewAudioRef.current) {
        previewAudioRef.current.src = audioUrl;
        previewAudioRef.current.play();
        previewAudioRef.current.onended = () => {
          setIsPreviewing(null);
          URL.revokeObjectURL(audioUrl); // Clean up the object URL
        };
      }
    } catch (err) {
      setIsPreviewing(null);
      console.error("Preview generation error:", err);
      alert(`Preview failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const selectedVoice = VOICES.find(v => v.id === selectedVoiceId) || VOICES[0];

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700" ref={formRef}>
      <audio ref={previewAudioRef} hidden />

      <header className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">Neural Editor</h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-1 uppercase tracking-widest">Mastering Console v2.5</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-8 mt-4 md:mt-0">
          <div className="text-left sm:text-right">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Quota Usage</span>
            <div className="flex items-center gap-3">
              <span className={`text-xs sm:text-sm font-black ${isLimitReached ? 'text-red-500' : 'text-white'}`}>
                {text.length.toLocaleString()} <span className="text-slate-700">/</span> {remaining.toLocaleString()}
              </span>
              <div className="w-20 sm:w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${isLimitReached ? 'bg-red-500' : 'bg-blue-600'}`} 
                  style={{ width: `${Math.min(100, (text.length / totalLimit) * 100)}%` }}
                  role="progressbar" // ARIA role for progress bar
                  aria-valuenow={text.length}
                  aria-valuemin={0}
                  aria-valuemax={totalLimit}
                  aria-label={`Character usage: ${text.length} out of ${totalLimit} characters used.`}
                ></div>
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setActiveMenu('save')}
            className="p-2 sm:p-3 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
            title="Save Project"
            aria-label="Save current project"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" strokeWidth="2.5"/></svg>
          </button>
        </div>
      </header>

      {/* Main Studio Canvas */}
      <div className="relative group">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)} 
          className="w-full min-h-[300px] md:min-h-[450px] bg-transparent text-lg md:text-2xl font-medium leading-relaxed outline-none resize-none placeholder:text-slate-800 transition-all focus:placeholder:text-slate-700"
          placeholder="Begin transcription here..."
          autoFocus
          aria-label="Text input for speech synthesis"
          aria-describedby="quota-usage-info" // Link to quota info
        />
      </div>

      {/* Floating Control Bar */}
      <div className="fixed bottom-0 md:bottom-10 left-0 right-0 z-[150] flex justify-center p-4 md:p-0 pointer-events-none md:pointer-events-auto md:left-64 md:right-10">
        <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-2 pointer-events-auto w-full md:w-auto">
          
          {/* Voice Select */}
          <div className="relative w-full md:w-auto">
            <button 
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'voice' ? null : 'voice')}
              className={`flex items-center justify-between w-full md:w-auto gap-3 px-4 py-3 rounded-2xl transition-all ${activeMenu === 'voice' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}
              aria-expanded={activeMenu === 'voice'} // ARIA attribute for dropdown state
              aria-controls="voice-selection-menu" // Link to the menu ID
              aria-haspopup="true" // Indicate it's a popup menu
            >
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Voice</p>
                <p className="text-sm font-bold uppercase italic">{selectedVoice.name}</p>
              </div>
              <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2"/></svg>
            </button>
            {activeMenu === 'voice' && (
              <div 
                id="voice-selection-menu"
                className="absolute bottom-full mb-2 md:mb-4 left-0 w-full md:w-80 bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl p-2 md:p-4 max-h-[400px] overflow-y-auto animate-in slide-in-from-bottom-2"
                role="menu" // ARIA role for menu
              >
                <div className="grid gap-2">
                  {VOICES.map(v => (
                    <button 
                      key={v.id}
                      type="button"
                      onClick={() => handleVoiceSelect(v)}
                      className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${selectedVoiceId === v.id ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                      role="menuitemradio" // ARIA role for selectable item in a single-select menu
                      aria-checked={selectedVoiceId === v.id} // ARIA checked state
                      aria-label={`Select ${v.name}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedVoiceId === v.id ? 'bg-white/20' : 'bg-blue-600/20 text-blue-400'}`} onClick={(e) => handlePreview(e, v)}>
                        {isPreviewing === v.id ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading preview"/> : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-xs font-black uppercase italic">{v.name}</p>
                        <p className="text-[9px] font-bold opacity-60 uppercase">{v.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mood Select with Pitch & Speed */}
          <div className="relative w-full md:w-auto">
            <button 
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'expression' ? null : 'expression')}
              className={`flex items-center justify-between w-full md:w-auto gap-3 px-4 py-3 rounded-2xl transition-all ${activeMenu === 'expression' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}
              aria-expanded={activeMenu === 'expression'} // ARIA attribute for dropdown state
              aria-controls="expression-settings-menu" // Link to the menu ID
              aria-haspopup="true" // Indicate it's a popup menu
            >
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Mood</p>
                <p className="text-sm font-bold uppercase italic">{settings.expression}</p>
              </div>
              <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2"/></svg>
            </button>
            {activeMenu === 'expression' && (
              <div 
                id="expression-settings-menu"
                className="absolute bottom-full mb-2 md:mb-4 left-0 w-full md:w-80 bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl p-2 animate-in slide-in-from-bottom-2"
                role="menu" // ARIA role for menu
              >
                {/* Expressions */}
                <div className="grid gap-2 mb-4">
                  {EXPRESSIONS.map(e => (
                    <button 
                      key={e} 
                      type="button"
                      onClick={() => { setSettings({...settings, expression: e}); setActiveMenu(null); }} // Close menu after expression selection
                      className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${settings.expression === e ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-500'}`}
                      role="menuitemradio" // ARIA role for selectable item in a single-select menu
                      aria-checked={settings.expression === e} // ARIA checked state
                      aria-label={`Set expression to ${e}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>

                {/* Separator */}
                <hr className="border-white/10 mx-2" />

                {/* Pitch Control */}
                <div className="px-5 py-4 space-y-3">
                  <label htmlFor="pitch-slider" className="block text-[10px] font-black uppercase tracking-widest opacity-60 text-slate-300">{t.pitch}</label>
                  <input 
                    id="pitch-slider"
                    type="range" 
                    min="0.5" 
                    max="1.5" 
                    step="0.01" 
                    value={settings.pitch} 
                    onChange={handlePitchChange} 
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    aria-label="Adjust voice pitch"
                    aria-valuetext={`${(settings.pitch * 100).toFixed(0)} percent`}
                  />
                  <p className="text-[10px] font-bold text-blue-400">{(settings.pitch * 100).toFixed(0)}%</p>
                </div>

                {/* Speed Control */}
                <div className="px-5 py-4 space-y-3">
                  <label htmlFor="speed-slider" className="block text-[10px] font-black uppercase tracking-widest opacity-60 text-slate-300">{t.speed}</label>
                  <input 
                    id="speed-slider"
                    type="range" 
                    min="0.5" 
                    max="2.0" 
                    step="0.01" 
                    value={settings.speed} 
                    onChange={handleSpeedChange} 
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    aria-label="Adjust voice speed"
                    aria-valuetext={`${(settings.speed * 100).toFixed(0)} percent`}
                  />
                  <p className="text-[10px] font-bold text-blue-400">{(settings.speed * 100).toFixed(0)}%</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Divider */}
          <div className="w-px h-10 bg-white/5 mx-2 hidden md:block"></div>


          <button
            type="button"
            disabled={isLoading || !text.trim() || isLimitReached}
            onClick={() => onGenerate(text, selectedVoice.baseVoice, settings)}
            className="group px-6 py-3 md:px-10 md:py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:bg-slate-800 disabled:text-slate-600 flex items-center gap-3 uppercase text-xs tracking-[0.2em] w-full md:w-auto"
            aria-live="polite" // Announce changes to screen readers
          >
            {isLoading ? (
              <div className="flex gap-1 items-end h-3" role="status" aria-label="Generating audio">
                {[1,2,3].map(i => <div key={i} className="w-1 bg-black animate-bounce" style={{animationDelay: `${i*0.1}s`}}></div>)}
              </div>
            ) : (
              <>
                Generate
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3"/></svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Modal Redesign */}
      {activeMenu === 'save' && (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-xl z-[300] flex items-center justify-center p-4 md:p-8 animate-in fade-in" role="dialog" aria-modal="true" aria-labelledby="save-project-title">
          <div className="w-full max-w-xl p-8 md:p-16 rounded-[2rem] md:rounded-[4rem] bg-[#0f172a] border border-white/10 shadow-2xl space-y-8 md:space-y-12 text-center animate-in zoom-in-95">
            <div>
              <h2 id="save-project-title" className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">Archiving Project</h2>
              <p className="text-slate-500 mt-2 text-sm font-medium">Encrypt and store this transcript in the vault.</p>
            </div>
            <label htmlFor="project-name-input" className="sr-only">Project Name</label> {/* SR-only label */}
            <input 
              id="project-name-input"
              type="text" 
              autoFocus
              placeholder="Descriptor (e.g. Genesis_Script_01)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-3xl p-4 text-white text-base font-bold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-center"
              aria-label="Project name input"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                type="button"
                onClick={() => setActiveMenu(null)} 
                className="flex-1 py-4 rounded-3xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                aria-label="Cancel saving project"
              >
                Abort
              </button>
              <button 
                type="button"
                onClick={async () => {
                  const v = VOICES.find(v => v.id === selectedVoiceId);
                  if (v) await onSaveProject(projectName, text, v.baseVoice, settings);
                  setActiveMenu(null);
                }} 
                disabled={!projectName.trim()} 
                className="flex-[2] py-4 bg-blue-600 text-white rounded-3xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all"
                aria-label="Confirm and deposit project"
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
