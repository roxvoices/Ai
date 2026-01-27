
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from '../constants';
import { generateTTS, BACKEND_BASE_URL } from '../services/geminiTTS'; // Import generateTTS and BACKEND_BASE_URL
import { VoiceName, AppTab } from '../types'; // Import AppTab

interface LandingProps {
  onEnter: () => void;
  setActiveTab: (tab: AppTab) => void; // New prop for internal navigation
}

// Rox Studio SVG Logo Component (Stylized) - Re-using the same consistent logo
const RoxStudioLogo = () => (
  <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17.5c0-1.41 1.01-2.61 2.44-2.92l4.12-1.03c.53-.13 1.08-.13 1.61 0l4.12 1.03C19.99 14.89 21 16.09 21 17.5V19h-2V17.5c0-.83-.67-1.5-1.5-1.5-.72 0-1.33.51-1.47 1.23l-4.12 1.03c-.53.13-1.08.13-1.61 0l-4.12-1.03C6.33 16.51 5.72 17.12 5.58 17.83 5.43 17.12 4 15.93 4 14.5V5h2V14.5c0 .83.67 1.5 1.5 1.5.72 0 1.33-.51 1.47-1.23l4.12-1.03c-.53.13-1.08.13-1.61 0l-4.12-1.03C6.33 13.51 5.72 12.89 5.58 12.17 5.43 12.89 4 14.07 4 15.5V19H2z"/>
    <path d="M4 10h3v4H4zM9 10h3v4H9zM14 10h3v4h-3z"/>
    {/* Stylized R within a soundwave/studio concept */}
    <path d="M7 5L12 2L17 5V10L12 13L7 10Z" fill="url(#gradientRox)" stroke="none"/>
    <defs>
      <linearGradient id="gradientRox" x1="7" y1="2" x2="17" y2="13" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
  </svg>
);

// Helper component for tool feature sections
const ToolFeatureSection: React.FC<{
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  reverseLayout?: boolean;
}> = ({ title, description, imageUrl, imageAlt, reverseLayout }) => (
  <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${reverseLayout ? 'lg:grid-flow-col-dense' : ''}`}>
      <div className={`reveal space-y-6 ${reverseLayout ? 'lg:col-start-2' : ''}`}>
        <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white leading-tight">
          {title}
        </h3>
        <p className="text-md text-slate-400 font-medium leading-relaxed">
          {description}
        </p>
      </div>
      <div className={`reveal relative ${reverseLayout ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
        <div className="absolute inset-0 bg-blue-600/10 blur-[80px] rounded-full animate-pulse-slow"></div>
        <img 
          src={imageUrl} 
          alt={imageAlt} 
          className="relative w-full h-auto rounded-[2rem] border border-white/10 shadow-2xl object-cover" 
          style={{aspectRatio: '16/9'}}
        />
      </div>
    </div>
  </section>
);


export const Landing: React.FC<LandingProps> = ({ onEnter, setActiveTab }) => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [generatedSamples, setGeneratedSamples] = useState<Record<string, string>>({}); // voiceId -> base64AudioUrl
  const [generatingSampleId, setGeneratingSampleId] = useState<string | null>(null); // To show loading
  const [error, setError] = useState<string | null>(null);

  // High-quality voice samples simulated
  const VOICES_PREVIEWS = [
    { id: 'zephyr', name: 'Zephyr', role: 'Global Narrator', baseVoice: VoiceName.ZEPHYR, previewText: 'Experience the clarity and depth of neural voice synthesis.', color: 'bg-blue-600' },
    { id: 'charon', name: 'Charon', role: 'Deep Cinema', baseVoice: VoiceName.CHARON, previewText: 'Unleash your creativity with voices that resonate.', color: 'bg-indigo-600' },
    { id: 'kore', name: 'Kore', role: 'Commercial Bright', baseVoice: VoiceName.KORE, previewText: 'Your words, beautifully spoken, every time.', color: 'bg-violet-600' },
  ];

  const t = TRANSLATIONS['en']; // Assuming English for landing page tool descriptions here

  const stopAllPlayback = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(null);
    setGeneratingSampleId(null); // Also clear any pending generation
  }, []);

  const generateSample = useCallback(async (voiceDef: typeof VOICES_PREVIEWS[0]) => {
    if (generatedSamples[voiceDef.id]) {
      return generatedSamples[voiceDef.id];
    }
    if (generatingSampleId === voiceDef.id) {
      // Already generating, wait for it
      // This simple wait won't prevent duplicate calls if clicked rapidly.
      // A more robust solution would involve a promise cache.
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (generatedSamples[voiceDef.id]) {
            clearInterval(checkInterval);
            resolve(generatedSamples[voiceDef.id]);
          }
        }, 100);
      });
    }

    setGeneratingSampleId(voiceDef.id);
    setError(null);
    try {
      const { audioUrl } = await generateTTS(
        voiceDef.previewText,
        voiceDef.baseVoice,
        { pitch: 1.0, speed: 1.0, expression: 'Natural' }, // Default settings for preview
        "preview_user_id", // Special user ID for previews, not counting against quota
        voiceDef.previewText.length
      );
      setGeneratedSamples(prev => ({ ...prev, [voiceDef.id]: audioUrl }));
      return audioUrl;
    } catch (err: any) {
      console.error(`Failed to generate preview for ${voiceDef.name}:`, err);
      // More specific error message for network issues on the landing page
      if (err.message.includes('Failed to connect to backend server')) {
        setError(`Cannot load audio previews. The Rox Studio backend server at ${BACKEND_BASE_URL} might be unreachable or not running. Please try again later.`);
      } else {
        setError(`Failed to load preview for ${voiceDef.name}: ${err.message || 'Unknown error'}`);
      }
      return null;
    } finally {
      setGeneratingSampleId(null);
    }
  }, [generatedSamples, generatingSampleId]);


  const toggleSample = async (voiceDef: typeof VOICES_PREVIEWS[0]) => {
    if (!audioRef.current) return;

    if (isPlaying === voiceDef.id) {
      stopAllPlayback();
    } else {
      stopAllPlayback(); // Stop any other playing or pending samples
      setIsPlaying(voiceDef.id); // Indicate this one is now playing (or loading)

      let audioUrl = generatedSamples[voiceDef.id];
      if (!audioUrl) {
        audioUrl = await generateSample(voiceDef);
        if (!audioUrl) {
          setIsPlaying(null); // Stop trying to play if generation failed
          return;
        }
      }
      
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };


  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-600/30 font-sans overflow-x-hidden">
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(null)}
        className="hidden"
      />

      {/* Decorative Glow Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>
      </div>

      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#020617]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <RoxStudioLogo /> {/* Use the new SVG logo component */}
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">Rox Studio</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Engine', 'Voice Lab', 'Enterprise', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button type="button" onClick={onEnter} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white px-4 transition-colors">Login</button>
            <button 
              type="button"
              onClick={onEnter}
              className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full transition-all hover:bg-blue-50 hover:shadow-xl hover:shadow-white/10 active:scale-95"
            >
              Enter Studio
            </button>
          </div>
        </div>
      </nav>

      {/* Immersive Hero Section */}
      <section className="relative pt-48 pb-32 px-6 flex flex-col items-center text-center z-10">
        <div className="reveal active inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-blue-400">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
          Generate audio from text for free
        </div>
        
        <h1 className="reveal active text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-10 text-gradient uppercase italic">
          BEYOND <br />
          <span className="text-blue-gradient">SPEECH.</span>
        </h1>
        
        <p className="reveal active text-lg md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed mb-16">
          Architect the perfect sonic identity. Our neural engine delivers elite vocal precision with unprecedented emotional depth.
        </p>

        <div className="reveal active flex flex-col sm:flex-row items-center gap-6">
          <button 
            type="button"
            onClick={onEnter}
            className="group relative px-16 py-8 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl text-sm uppercase tracking-widest transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)] active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Synthesis
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3"/></svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
          
          <div className="flex -space-x-3 items-center">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="pl-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Trusted by 50k+ Creators
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-32 animate-float">
          <div className="w-px h-16 bg-gradient-to-b from-blue-500/50 to-transparent mx-auto"></div>
        </div>
      </section>

      {/* Voice Showcase Explorer */}
      <section className="py-24 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="reveal">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4">Voice Explorer</h2>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Signature Personas.</h3>
          </div>
          <p className="reveal max-w-sm text-slate-500 text-sm font-medium leading-relaxed">
            Every voice is mathematically tuned for emotional resonance. Click to sample the elite quality of the Rox engine.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-4">
            <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
            </div>
            <p className="leading-relaxed flex-1">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VOICES_PREVIEWS.map((voice, idx) => (
            <div 
              key={voice.id} 
              className={`reveal group relative p-10 rounded-[3rem] border border-white/5 bg-[#0a0f1d] hover:bg-[#0f172a] transition-all cursor-pointer overflow-hidden shadow-2xl`}
              style={{ transitionDelay: `${idx * 150}ms` }}
              onClick={() => toggleSample(voice)}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${voice.color} opacity-0 group-hover:opacity-20 blur-[60px] transition-opacity`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${isPlaying === voice.id || generatingSampleId === voice.id ? 'bg-white text-black scale-110' : voice.color} transition-all shadow-xl`}>
                    {isPlaying === voice.id ? (
                      <div className="flex gap-1 items-end h-4">
                        {[1,2,3].map(i => <div key={i} className="w-1 bg-black animate-bounce" style={{animationDelay: `${i*0.1}s`, height: `${40+Math.random()*60}%`}}></div>)}
                      </div>
                    ) : generatingSampleId === voice.id ? (
                       <svg className="animate-spin h-6 w-6 text-black" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Sample HQ</span>
                </div>

                <h4 className="text-3xl font-black mb-2 uppercase italic">{voice.name}</h4>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">{voice.role}</p>
                
                <div className="mt-auto pt-8 border-t border-white/5">
                   <div className="flex gap-1 items-center h-8">
                     {[...Array(12)].map((_, i) => (
                       <div 
                        key={i} 
                        className={`flex-1 ${isPlaying === voice.id ? 'bg-blue-500' : 'bg-slate-800'} rounded-full transition-all`} 
                        style={{ height: isPlaying === voice.id ? `${30 + Math.random() * 70}%` : '4px' }}
                       ></div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Architect - Visual Feature */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="reveal space-y-10">
            <div>
              <h2 className="text-[10px] font-black text-violet-500 uppercase tracking-[0.5em] mb-4">Voice Lab Architecture</h2>
              <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">
                CRAFT FROM <br /><span className="text-blue-gradient">DESCRIPTION.</span>
              </h3>
            </div>
            
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              Don't just pick a voice. Build one. Our "Architect" engine translates abstract descriptions—like "The voice of a weary space captain"—into precise neural parameters.
            </p>

            <ul className="space-y-6">
              {[
                { t: 'Natural Breathing', d: 'AI-injected pauses and inhale dynamics for organic flow.' },
                { t: 'Emotion Mapping', d: 'Intensity scales from subtle whisper to authoritative command.' },
                { t: 'Studio Mastering', d: 'Automatic EQ and compression applied at the source.' }
              ].map(item => (
                <li key={item.t} className="flex gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0 group-hover:bg-blue-600 transition-all group-hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg>
                  </div>
                  <div>
                    <h5 className="text-sm font-black uppercase tracking-tight mb-1">{item.t}</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="relative glass-panel rounded-[3rem] p-10 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Architect Terminal</span>
                </div>
                <div className="font-mono text-sm space-y-4">
                  <p className="text-blue-400"># Input Description</p>
                  <p className="text-white bg-white/5 p-4 rounded-xl leading-relaxed">
                    "A wise academic mentor, aged 60, speaking with a gentle gravitas and slow pacing."
                  </p>
                  <p className="text-purple-400 mt-8"># AI Architect Processing...</p>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-xl border border-white/5 bg-black/40">
                        <span className="block text-[8px] text-slate-500 uppercase mb-2">Base Engine</span>
                        <span className="text-xs font-bold text-white uppercase italic">Zephyr v2</span>
                     </div>
                     <div className="p-4 rounded-xl border border-white/5 bg-black/40">
                        <span className="block text-[8px] text-slate-500 uppercase mb-2">Pitch Deviation</span>
                        <span className="text-xs font-bold text-white uppercase">-0.15Hz</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 reveal">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4">Market Standard vs Rox</h2>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">The Difference is Audible.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="reveal p-12 rounded-[3rem] bg-white/[0.01] border border-white/5 flex flex-col items-center text-center">
            <h4 className="text-xl font-black uppercase tracking-widest text-slate-500 mb-12">Basic AI Generators</h4>
            <div className="space-y-8 flex-1">
              {['Metallic Artifacts', 'Monotone Pacing', 'Stilted Pronunciation', 'Limited Customization'].map(t => (
                <div key={t} className="flex items-center gap-4 text-slate-600 font-bold uppercase text-xs">
                  <svg className="w-5 h-5 text-red-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg>
                  {t}
                </div>
              ))}
            </div>
          </div>
          
          <div className="reveal p-12 rounded-[3rem] bg-blue-600/10 border border-blue-500/30 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600 blur-[80px] opacity-10"></div>
            <h4 className="text-xl font-black uppercase tracking-widest text-white mb-12">Rox Neural Engine</h4>
            <div className="space-y-8 flex-1">
              {['Lossless 24kHz Mastering', 'Adaptive Breath Injection', 'Dynamic Emotional Range', 'Zero-Latency Synthesis'].map(t => (
                <div key={t} className="flex items-center gap-4 text-white font-bold uppercase text-xs">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Tool Sections */}
      <ToolFeatureSection
        title={t.videoToAudio}
        description={t.videoToAudioDescription}
        imageUrl="https://picsum.photos/id/1066/1000/700" // Abstract video/audio representation
        imageAlt="Video to Audio Conversion"
        reverseLayout={false}
      />
      <ToolFeatureSection
        title={t.textToPdf}
        description={t.textToPdfDescription}
        imageUrl="https://picsum.photos/id/401/1000/700" // Open book/document conversion
        imageAlt="Text to PDF Conversion"
        reverseLayout={true}
      />
      <ToolFeatureSection
        title={t.pdfToText}
        description={t.pdfToTextDescription}
        imageUrl="https://picsum.photos/id/355/1000/700" // Document scan/text recognition
        imageAlt="PDF to Text Extraction"
        reverseLayout={false}
      />
      <ToolFeatureSection
        title={t.trimAudio}
        description={t.trimAudioDescription}
        imageUrl="https://picsum.photos/id/132/1000/700" // Sound editing waves
        imageAlt="Audio Trimming"
        reverseLayout={true}
      />
      <ToolFeatureSection
        title={t.mergeAudio}
        description={t.mergeAudioDescription}
        imageUrl="https://picsum.photos/id/139/1000/700" // Audio mixing console
        imageAlt="Merge Audio Files"
        reverseLayout={false}
      />
      <ToolFeatureSection
        title={t.fileCompressor}
        description={t.fileCompressorDescription}
        imageUrl="https://picsum.photos/id/1080/1000/700" // Abstract compression
        imageAlt="File Compression"
        reverseLayout={true}
      />
      <ToolFeatureSection
        title={t.wordCounter}
        description={t.wordCounterDescription}
        imageUrl="https://picsum.photos/id/1049/1000/700" // Notepad and pen
        imageAlt="Word Counter"
        reverseLayout={false}
      />

      {/* Final CTA */}
      <section className="relative py-48 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        <div className="reveal relative z-10 max-w-4xl mx-auto space-y-12">
          <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-none italic uppercase">
            ENTER THE <br /><span className="text-blue-gradient">VAULT.</span>
          </h2>
          <p className="text-xl text-slate-400 font-medium">Join the elite rank of creators using the most advanced neural engine ever built.</p>
          <button 
            type="button"
            onClick={onEnter}
            className="px-16 py-8 bg-white text-black font-black rounded-full text-lg uppercase tracking-widest transition-all hover:scale-110 active:scale-95 shadow-[0_30px_60px_rgba(255,255,255,0.1)]"
          >
            Get Studio Access
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#01040f] z-20 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
               <RoxStudioLogo /> {/* Use the new SVG logo component */}
            </div>
            <span className="text-sm font-black uppercase tracking-widest italic">Rox Studio</span>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Elite Neural Synthesis © 2025</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10">
            {/* These links will now navigate to internal AppTabs */}
            <button 
              type="button"
              onClick={() => setActiveTab('terms')} 
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              {t.terms}
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('privacy')} 
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              {t.privacy}
            </button>
            <a href="mailto:markwell244@gmail.com" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Contact</a>
          </div>
          
          {/* Removed social media icons */}
        </div>
      </footer>
    </div>
  );
};