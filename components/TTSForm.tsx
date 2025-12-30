
import React, { useState, useEffect, useRef } from 'react';
import { VOICES, EXPRESSIONS, DAILY_CHAR_LIMIT } from '../constants';
import { VoiceName, TTSSettings, CustomVoiceProfile } from '../types';
import { generateTTS } from '../services/geminiTTS';

interface TTSFormProps {
  onGenerate: (text: string, voice: VoiceName, settings: TTSSettings) => Promise<void>;
  isLoading: boolean;
  prefill?: { voice: VoiceName, settings: TTSSettings };
  customVoices: CustomVoiceProfile[];
  charsUsed: number;
}

export const TTSForm: React.FC<TTSFormProps> = ({ onGenerate, isLoading, prefill, customVoices, charsUsed }) => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState<VoiceName>(VoiceName.ZEPHYR);
  const [settings, setSettings] = useState<TTSSettings>({
    pitch: 1,
    speed: 1,
    expression: 'Natural'
  });
  const [isExpressionManual, setIsExpressionManual] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState<string | null>(null);

  const [activeMenu, setActiveMenu] = useState<'voice' | 'settings' | 'expression' | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Remaining characters
  const remaining = Math.max(0, DAILY_CHAR_LIMIT - charsUsed);
  const isLimitReached = text.length > remaining;

  useEffect(() => {
    if (prefill) {
      setVoice(prefill.voice);
      setSettings(prefill.settings);
      setIsExpressionManual(true);
    }
  }, [prefill]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menu: 'voice' | 'settings' | 'expression') => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleVoiceSelect = (v: any) => {
    setVoice(v.baseVoice);
    // User requested the explanation (expression) to remain natural unless manually changed.
    // We only apply default settings for pitch/speed, but keep expression if manually set.
    if (!isExpressionManual) {
      setSettings({
        ...settings,
        ...v.defaultSettings,
        expression: 'Natural' // Forced natural by default as requested
      });
    } else {
      setSettings({
        ...settings,
        pitch: v.defaultSettings?.pitch ?? settings.pitch,
        speed: v.defaultSettings?.speed ?? settings.speed,
      });
    }
    setActiveMenu(null);
  };

  const handlePreview = async (e: React.MouseEvent, voiceDef: any) => {
    e.stopPropagation();
    if (isPreviewing) return;
    
    setIsPreviewing(voiceDef.id);
    try {
      const { audioUrl } = await generateTTS(voiceDef.previewText, voiceDef.baseVoice, {
        pitch: voiceDef.defaultSettings?.pitch || 1.0,
        speed: voiceDef.defaultSettings?.speed || 1.0,
        expression: voiceDef.defaultSettings?.expression || 'Natural'
      });
      
      if (previewAudioRef.current) {
        previewAudioRef.current.src = audioUrl;
        previewAudioRef.current.play();
        previewAudioRef.current.onended = () => setIsPreviewing(null);
      }
    } catch (err) {
      console.error("Preview failed", err);
      setIsPreviewing(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading && !isLimitReached) {
      onGenerate(text, voice, settings);
    }
  };

  const selectedVoiceDef = VOICES.find(v => v.baseVoice === voice);
  const selectedCustom = customVoices.find(v => v.baseVoice === voice);
  const displayName = selectedCustom?.name || selectedVoiceDef?.name || voice;

  return (
    <div className="w-full flex flex-col gap-6" ref={formRef}>
      <audio ref={previewAudioRef} hidden />

      {/* Premium Notification Banner */}
      <div className="w-full bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-lg animate-pulse">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-wider">Want Premium? Unlimited access & Advanced features</h4>
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">Contact: WhatsApp +260765546444 • markwell244@gmail.com</p>
          </div>
        </div>
        <a href="https://wa.me/260765546444" target="_blank" className="px-5 py-2 bg-white text-blue-900 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-50 transition-all whitespace-nowrap">Upgrade Now</a>
      </div>
      
      {/* Central Input Workspace */}
      <div className={`bg-[#0a0f1d]/60 backdrop-blur-xl border rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl relative transition-all ${isLimitReached ? 'border-red-500/50 ring-2 ring-red-500/10' : 'border-white/10 focus-within:ring-2 focus-within:ring-blue-500/20'}`}>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, remaining + 50))} 
            className="w-full min-h-[300px] md:min-h-[400px] bg-transparent text-slate-100 text-xl md:text-3xl font-medium leading-relaxed outline-none resize-none placeholder:text-slate-800 scrollbar-hide py-2"
            placeholder="Paste your script here... "
          />
        </div>
        
        <div className="mt-4 flex justify-between items-center px-2">
          <div className="flex flex-col">
            <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${isLimitReached ? 'text-red-500' : 'text-slate-600'}`}>
              {text.length} / {remaining} characters left today
            </span>
            {isLimitReached && <span className="text-[8px] text-red-400 font-bold uppercase mt-1">Daily Limit Exceeded</span>}
          </div>
          <span className="hidden md:block text-[10px] font-bold text-slate-700 uppercase tracking-widest">Resets 00:00 CAT</span>
        </div>
      </div>

      {/* Control Area */}
      <div className="flex flex-col items-center gap-6 w-full px-2">
        <div className="flex flex-wrap justify-center items-center gap-3 w-full">
          
          {/* Voice Menu */}
          <div className="relative">
            <label className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Choose Voice</label>
            <button 
              type="button"
              onClick={() => toggleMenu('voice')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg transition-all border ${
                activeMenu === 'voice' ? 'bg-blue-600 text-white border-blue-400' : 'bg-[#0a0f1d] text-slate-300 border-white/10 hover:border-white/30'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth="2.5"/></svg>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest truncate max-w-[100px]">{displayName}</span>
            </button>
            {activeMenu === 'voice' && (
              <div className="absolute bottom-full mb-4 left-0 w-[20rem] md:w-[28rem] bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-4 max-h-[25rem] overflow-y-auto custom-scrollbar">
                  {customVoices.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-[8px] font-black text-blue-500 uppercase tracking-widest px-2 mb-2">Architected Voices</h4>
                      {customVoices.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => { setVoice(v.baseVoice); setSettings(v.settings); setActiveMenu(null); }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                            voice === v.baseVoice ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">{v.name}</span>
                            <span className="text-[8px] opacity-60 uppercase truncate w-40">{v.description}</span>
                          </div>
                          {voice === v.baseVoice && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="space-y-1">
                    <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-2 mb-2">Studio Voices</h4>
                    {VOICES.map((v) => (
                      <div
                        key={v.id}
                        className={`group/voiceitem w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                          voice === v.baseVoice ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'
                        }`}
                        onClick={() => handleVoiceSelect(v)}
                      >
                        <button 
                          onClick={(e) => handlePreview(e, v)}
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            isPreviewing === v.id ? 'bg-white text-blue-600 animate-pulse' : 'bg-white/10 group-hover/voiceitem:bg-white/20 text-white'
                          }`}
                        >
                           {isPreviewing === v.id ? (
                             <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                           ) : (
                             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                           )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black truncate">{v.name}</span>
                            <span className="text-[7px] font-bold opacity-60 uppercase bg-black/20 px-1 rounded">{v.description}</span>
                          </div>
                          <p className="text-[9px] opacity-70 leading-tight mt-0.5 line-clamp-1 italic">{v.role}</p>
                        </div>
                        {voice === v.baseVoice && <svg className="w-3 h-3 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Style Menu */}
          <div className="relative">
            <label className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Delivery Style</label>
            <button 
              type="button"
              onClick={() => toggleMenu('expression')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg transition-all border ${
                activeMenu === 'expression' ? 'bg-blue-600 text-white border-blue-400' : 'bg-[#0a0f1d] text-slate-300 border-white/10 hover:border-white/30'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{settings.expression}</span>
            </button>
            {activeMenu === 'expression' && (
              <div className="absolute bottom-full mb-4 left-0 w-52 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-1">
                  {EXPRESSIONS.map((e) => (
                    <button
                      key={e}
                      onClick={() => { 
                        setSettings({...settings, expression: e}); 
                        setIsExpressionManual(true);
                        setActiveMenu(null); 
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-[10px] font-bold ${
                        settings.expression === e ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audio Controls */}
          <div className="relative">
            <label className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Speed & Pitch</label>
            <button 
              type="button"
              onClick={() => toggleMenu('settings')}
              className={`p-3 rounded-xl shadow-lg transition-all border ${
                activeMenu === 'settings' ? 'bg-blue-600 text-white border-blue-400' : 'bg-[#0a0f1d] text-slate-400 border-white/10 hover:border-white/30'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {activeMenu === 'settings' && (
              <div className="absolute bottom-full mb-4 left-0 w-64 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      <span>Speed</span>
                      <span className="text-blue-500 font-mono">{settings.speed}x</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="2" step="0.1" 
                      value={settings.speed} 
                      onChange={(e) => setSettings({...settings, speed: parseFloat(e.target.value)})}
                      className="w-full accent-blue-600 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      <span>Pitch</span>
                      <span className="text-blue-500 font-mono">{settings.pitch}</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="1.5" step="0.1" 
                      value={settings.pitch} 
                      onChange={(e) => setSettings({...settings, pitch: parseFloat(e.target.value)})}
                      className="w-full accent-blue-600 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Generate Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !text.trim() || isLimitReached}
          className="w-full max-w-md group relative flex items-center justify-center gap-4 px-8 py-5 md:py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black rounded-2xl md:rounded-[2rem] transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98] mt-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          ) : (
            <>
              <span className="text-lg md:text-xl">{isLimitReached ? 'Limit Reached' : 'Generate Audio'}</span>
              <svg className="w-5 h-5 md:w-6 md:h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
