
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { TTSForm } from './components/TTSForm';
import { AudioHistory } from './components/AudioHistory';
import { VoiceArchitect } from './components/VoiceArchitect';
import { Settings } from './components/Settings';
import { Premium } from './components/Premium';
import { AdminPanel } from './components/AdminPanel';
import { User, TTSProject, VoiceName, TTSSettings, AppTab, CustomVoiceProfile, Plan } from './types';
import { generateTTS } from './services/geminiTTS';
import { PLAN_CONFIGS, ADMIN_EMAILS } from './constants';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [history, setHistory] = useState<TTSProject[]>([]);
  const [customVoices, setCustomVoices] = useState<CustomVoiceProfile[]>([]);
  const [charsUsed, setCharsUsed] = useState(0);
  const [activeTab, setActiveTab] = useState<AppTab>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prefill, setPrefill] = useState<{voice: VoiceName, settings: TTSSettings, profileId?: string} | undefined>(undefined);
  const [audioRef] = useState(new Audio());
  const [theme, setTheme] = useState<'default' | 'black' | 'white' | 'blue'>('default');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const getCATDate = () => {
    const d = new Date();
    const catOffset = 2;
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const catTime = new Date(utc + (3600000 * catOffset));
    return catTime.toISOString().split('T')[0];
  };

  const getResetCheckString = (duration: 'day' | 'month' | 'year') => {
    const date = getCATDate();
    if (duration === 'day') return date;
    if (duration === 'month') return date.substring(0, 7); 
    return date.substring(0, 4);
  };

  const refreshUserData = useCallback(async (userId: string, email: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn("Profile fetch error:", error.message);
      }

      const plan = (profile?.plan || 'free') as Plan;
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase()) || profile?.role === 'admin';
      const duration = PLAN_CONFIGS[plan]?.duration || 'day';
      const currentResetString = getResetCheckString(duration);
      const cloudData = profile?.data_payload || {};
      const resetNeeded = profile?.chars_reset_at !== currentResetString;
      const currentCharsUsed = resetNeeded ? 0 : (profile?.chars_used || 0);

      const userData: User = {
        id: userId,
        email: email,
        name: profile?.name || email.split('@')[0],
        history: cloudData.history || [],
        charsUsed: currentCharsUsed,
        lastResetDate: currentResetString,
        customVoices: cloudData.customVoices || [],
        theme: cloudData.theme || 'default',
        subscription: plan,
        role: isAdmin ? 'admin' : 'user'
      };

      setUser(userData);
      setHistory(userData.history);
      setCustomVoices(userData.customVoices);
      setCharsUsed(userData.charsUsed);
      setTheme(userData.theme as any);

      if (resetNeeded && profile) {
        await supabase.from('profiles').update({ 
          chars_used: 0, 
          chars_reset_at: currentResetString 
        }).eq('id', userId);
      }
    } catch (err) {
      console.error("Critical refresh user data failure:", err);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    // Single point of truth for Auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await refreshUserData(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setHistory([]);
        setCharsUsed(0);
        setAuthLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshUserData]);

  const handleLogin = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password: pass 
    });
    if (error) throw error;
    return data;
  };

  const handleRegister = async (name: string, email: string, pass: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pass,
      options: { data: { name } }
    });
    if (error) throw error;
    
    if (data.user) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: email.trim(),
          name: name,
          plan: 'free',
          chars_used: 0,
          role: ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user',
          chars_reset_at: getResetCheckString('day')
        });
      } catch (e) {}
    }
    return data;
  };

  const handleLogout = async () => {
    try {
      setUser(null);
      setHistory([]);
      setCharsUsed(0);
      setActiveTab('generate');
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const saveUserData = async (updated: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updated };
    setUser(newUser);
    
    if (updated.history) setHistory(updated.history);
    if (updated.customVoices) setCustomVoices(updated.customVoices);
    if (updated.charsUsed !== undefined) setCharsUsed(updated.charsUsed);
    if (updated.theme) setTheme(updated.theme);

    try {
      await supabase.from('profiles').update({ 
        data_payload: {
          history: updated.history ?? history,
          customVoices: updated.customVoices ?? customVoices,
          theme: updated.theme ?? theme,
        },
        chars_used: updated.charsUsed ?? charsUsed
      }).eq('id', user.id);
    } catch (err) {
      console.warn("Cloud sync failed:", err);
    }
  };

  const onGenerate = async (text: string, voice: VoiceName, settings: TTSSettings) => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const { audioUrl } = await generateTTS(text, voice, settings);
      const newProject: TTSProject = {
        id: Math.random().toString(36).substring(2, 9),
        text,
        voiceName: voice,
        createdAt: new Date().toISOString(),
        audioUrl,
        settings
      };
      const newHistory = [newProject, ...history];
      await saveUserData({ history: newHistory, charsUsed: charsUsed + text.length });
    } catch (err: any) {
      alert(err.message || "Synthesis failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Initializing Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {!user ? (
        <Auth onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <div className="flex-1 flex flex-col md:pt-10">
          {activeTab === 'generate' && (
            <>
              <TTSForm onGenerate={onGenerate} isLoading={isGenerating} prefill={prefill} customVoices={customVoices} charsUsed={charsUsed} subscription={user.subscription} />
              <AudioHistory projects={history} onPlay={(url) => { audioRef.src = url; audioRef.play(); }} onDownload={(p) => { const a = document.createElement('a'); a.href = p.audioUrl; a.download = `voiceover-${Date.now()}.wav`; a.click(); }} onDelete={(id) => saveUserData({ history: history.filter(p => p.id !== id) })} />
            </>
          )}
          {activeTab === 'admin' && user.role === 'admin' && <AdminPanel />}
          {activeTab === 'architect' && <VoiceArchitect onApplyProfile={(v, s) => { setPrefill({ voice: v, settings: s }); setActiveTab('generate'); }} />}
          {activeTab === 'history' && (
            <div className="space-y-12">
               <header className="mb-8 md:mb-12 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-white">My Library</h1>
                  <p className="text-sm md:text-lg font-medium text-slate-500">Your secure cloud-synced audio clips.</p>
                </header>
              <AudioHistory projects={history} onPlay={url => { audioRef.src = url; audioRef.play(); }} onDownload={p => { const a = document.createElement('a'); a.href = p.audioUrl; a.download = `voiceover-${p.id}.wav`; a.click(); }} onDelete={id => saveUserData({ history: history.filter(p => p.id !== id) })} />
            </div>
          )}
          {activeTab === 'settings' && <Settings user={user} onLogout={handleLogout} onUpdateTheme={t => saveUserData({ theme: t })} setActiveTab={setActiveTab} />}
          {activeTab === 'premium' && <Premium user={user} onRefresh={() => refreshUserData(user.id, user.email)} />}
        </div>
      )}
    </Layout>
  );
};

export default App;
