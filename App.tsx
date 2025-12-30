
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { TTSForm } from './components/TTSForm';
import { AudioHistory } from './components/AudioHistory';
import { VoiceArchitect } from './components/VoiceArchitect';
import { User, TTSProject, VoiceName, TTSSettings, AppTab, CustomVoiceProfile } from './types';
import { generateTTS } from './services/geminiTTS';
import { DAILY_CHAR_LIMIT } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<TTSProject[]>([]);
  const [customVoices, setCustomVoices] = useState<CustomVoiceProfile[]>([]);
  const [charsUsed, setCharsUsed] = useState(0);
  const [activeTab, setActiveTab] = useState<AppTab>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prefill, setPrefill] = useState<{voice: VoiceName, settings: TTSSettings} | undefined>(undefined);
  const [audioRef] = useState(new Audio());

  // CAT Reset Helper (UTC+2)
  const getCATDate = () => {
    const d = new Date();
    // Shift date by 2 hours for CAT manually or use Intl
    const catOffset = 2;
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const catTime = new Date(utc + (3600000 * catOffset));
    return catTime.toISOString().split('T')[0];
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('rox_voices_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as User;
      
      // Check for CAT reset
      const currentCAT = getCATDate();
      if (parsedUser.lastResetDate !== currentCAT) {
        parsedUser.charsUsed = 0;
        parsedUser.lastResetDate = currentCAT;
      }
      
      setUser(parsedUser);
      setCharsUsed(parsedUser.charsUsed || 0);
      setCustomVoices(parsedUser.customVoices || []);
      
      const savedHistory = localStorage.getItem(`rox_voices_history_${parsedUser.id}`);
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveUserData = (updated: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updated };
    setUser(newUser);
    localStorage.setItem('rox_voices_user', JSON.stringify(newUser));
  };

  const handleLogin = async (email: string, pass: string) => {
    const mockUser: User = { 
      id: btoa(email), 
      email, 
      name: email.split('@')[0], 
      history: [], 
      charsUsed: 0, 
      lastResetDate: getCATDate(),
      customVoices: []
    };
    setUser(mockUser);
    setCharsUsed(0);
    setCustomVoices([]);
    localStorage.setItem('rox_voices_user', JSON.stringify(mockUser));
    const savedHistory = localStorage.getItem(`rox_voices_history_${mockUser.id}`);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  };

  const handleRegister = async (name: string, email: string, pass: string) => {
    const mockUser: User = { 
      id: btoa(email), 
      email, 
      name, 
      history: [], 
      charsUsed: 0, 
      lastResetDate: getCATDate(),
      customVoices: []
    };
    setUser(mockUser);
    setCharsUsed(0);
    setCustomVoices([]);
    localStorage.setItem('rox_voices_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    setCharsUsed(0);
    setCustomVoices([]);
    localStorage.removeItem('rox_voices_user');
  };

  const onGenerate = async (text: string, voice: VoiceName, settings: TTSSettings) => {
    if (!user) return;
    
    // Check limit one last time
    if (charsUsed + text.length > DAILY_CHAR_LIMIT) {
      alert("Daily character limit exceeded. Resetting at midnight CAT.");
      return;
    }

    setIsGenerating(true);
    try {
      const { audioUrl } = await generateTTS(text, voice, settings);
      const newProject: TTSProject = {
        id: Date.now().toString(),
        text,
        voiceName: voice,
        createdAt: new Date().toISOString(),
        audioUrl,
        settings
      };
      
      const updatedHistory = [newProject, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(`rox_voices_history_${user.id}`, JSON.stringify(updatedHistory));
      
      // Update chars used
      const newCharsUsed = charsUsed + text.length;
      setCharsUsed(newCharsUsed);
      saveUserData({ charsUsed: newCharsUsed });

      audioRef.src = audioUrl;
      audioRef.play();
      
      // Automatically navigate to Library (history tab)
      setActiveTab('history');
    } catch (error) {
      console.error("Vocal engine failure:", error);
      alert("Something went wrong with the voice engine. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyArchitectProfile = (voice: VoiceName, settings: TTSSettings) => {
    if (!user) return;
    
    const newCustom: CustomVoiceProfile = {
      id: `custom-${Date.now()}`,
      name: (settings as any).name || `Persona ${customVoices.length + 1}`,
      description: settings.customDescription || "Tailored AI Voice",
      baseVoice: voice,
      settings
    };

    const updatedVoices = [...customVoices, newCustom];
    setCustomVoices(updatedVoices);
    saveUserData({ customVoices: updatedVoices });
    
    setPrefill({ voice, settings });
    setActiveTab('generate');
  };

  const onDelete = (id: string) => {
    const updated = history.filter(p => p.id !== id);
    setHistory(updated);
    if (user) localStorage.setItem(`rox_voices_history_${user.id}`, JSON.stringify(updated));
  };

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
    >
      {!user ? (
        <Auth onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <div className="flex-1 flex flex-col md:pt-10">
          {activeTab === 'generate' && (
            <>
              <div className="mb-12 md:mb-16">
                <header className="mb-8 md:mb-12 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Voiceover Studio</h1>
                  <p className="text-slate-400 text-sm md:text-lg font-medium">Create natural sounding speech for your videos and podcasts.</p>
                </header>
                <TTSForm 
                  onGenerate={onGenerate} 
                  isLoading={isGenerating} 
                  prefill={prefill} 
                  customVoices={customVoices}
                  charsUsed={charsUsed}
                />
              </div>
              
              <div className="mt-8">
                <AudioHistory 
                  projects={history} 
                  onPlay={(url) => { audioRef.src = url; audioRef.play(); }} 
                  onDownload={(p) => {
                    const a = document.createElement('a');
                    a.href = p.audioUrl;
                    a.download = `voiceover-${Date.now()}.wav`;
                    a.click();
                  }} 
                  onDelete={onDelete} 
                />
              </div>
            </>
          )}
          {activeTab === 'architect' && (
            <VoiceArchitect onApplyProfile={applyArchitectProfile} />
          )}
          {activeTab === 'history' && (
             <div className="pb-12">
               <header className="mb-8 md:mb-12 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">My Library</h1>
                  <p className="text-slate-400 text-sm md:text-lg font-medium">All your generated voiceovers are stored here.</p>
                </header>
               <AudioHistory 
                projects={history} 
                onPlay={(url) => { audioRef.src = url; audioRef.play(); }} 
                onDownload={(p) => {
                  const a = document.createElement('a');
                  a.href = p.audioUrl;
                  a.download = `voiceover-${Date.now()}.wav`;
                  a.click();
                }} 
                onDelete={onDelete} 
              />
             </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
