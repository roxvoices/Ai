
import React, { useState, useEffect } from 'react';
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

  const refreshUserData = async (userId: string, email: string, isInitialLogin = false) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn("Supabase profile fetch warning:", error.message);
      }

      let activeProfile = profile;
      if (!activeProfile) {
        const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: email,
            name: email.split('@')[0],
            plan: 'free',
            chars_used: 0,
            role: isAdmin ? 'admin' : 'user',
            chars_reset_at: getResetCheckString('day')
          }, { onConflict: 'id' })
          .select()
          .maybeSingle();
        
        if (!insertError && newProfile) {
          activeProfile = newProfile;
        }
      }

      const defaultReset = getResetCheckString('day');
      const plan = (activeProfile?.plan || 'free') as Plan;
      let role = (activeProfile?.role || 'user') as 'user' | 'admin';
      if (ADMIN_EMAILS.includes(email.toLowerCase())) role = 'admin';

      const duration = PLAN_CONFIGS[plan]?.duration || 'day';
      const currentResetString = getResetCheckString(duration);
      const cloudData = activeProfile?.data_payload || {};
      const resetNeeded = activeProfile?.chars_reset_at !== currentResetString;
      const currentCharsUsed = resetNeeded ? 0 : (activeProfile?.chars_used || 0);

      const mergedUser: User = {
        id: userId,
        email: email,
        name: activeProfile?.name || email.split('@')[0],
        history: cloudData.history || [],
        charsUsed: currentCharsUsed,
        lastResetDate: currentResetString,
        customVoices: cloudData.customVoices || [],
        theme: cloudData.theme || 'default',
        subscription: plan,
        role: role
      };

      if (resetNeeded && activeProfile) {
        await supabase
          .from('profiles')
          .update({ chars_used: 0, chars_reset_at: currentResetString })
          .eq('id', userId);
      }
      
      setUser(mergedUser);
      setHistory(mergedUser.history);
      setCustomVoices(mergedUser.customVoices);
      setCharsUsed(mergedUser.charsUsed);
      setTheme(mergedUser.theme as any);

      if (isInitialLogin && role === 'admin' && activeTab === 'generate') {
        setActiveTab('admin');
      }
    } catch (err) {
      console.error("Critical refresh user data failure:", err);
      // Ensure we don't break the app flow even on DB errors
      setUser({
        id: userId, email, name: email.split('@')[0],
        history: [], charsUsed: 0, lastResetDate: getResetCheckString('day'), 
        customVoices: [], theme: 'default', subscription: 'free', role: ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user'
      });
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // Initializing auth state
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await refreshUserData(session.user.id, session.user.email || '', true);
        } else {
          setAuthLoading(false);
        }
      } catch (e) {
        console.error("Auth init failed", e);
        setAuthLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const isLoginEvent = event === 'SIGNED_IN' || event === 'INITIAL_SESSION';
        await refreshUserData(session.user.id, session.user.email || '', isLoginEvent);
      } else if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setUser(null);
        setAuthLoading(false);
      }
    });

    // Final safety timeout to ensure loader goes away no matter what
    const timer = setTimeout(() => setAuthLoading(false), 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const saveUserData = async (updated: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updated };
    setUser(newUser);
    
    if (updated.history) setHistory(updated.history);
    if (updated.customVoices) setCustomVoices(updated.customVoices);
    if (updated.charsUsed !== undefined) setCharsUsed(updated.charsUsed);
    if (updated.theme) setTheme(updated.theme);

    try {
      await supabase
        .from('profiles')
        .update({ 
          data_payload: {
            history: updated.history ?? history,
            customVoices: updated.customVoices ?? customVoices,
            theme: updated.theme ?? theme,
          },
          chars_used: updated.charsUsed ?? charsUsed
        })
        .eq('id', user.id);
    } catch (err) {
      console.warn("Saving profile failed:", err);
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
      const newCharsUsed = charsUsed + text.length;
      
      await saveUserData({
        history: newHistory,
        charsUsed: newCharsUsed
      });
    } catch (err: any) {
      console.error("TTS synthesis error:", err);
      alert(err.message || "Synthesis failed. Please check your quota or connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogin = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const handleRegister = async (name: string, email: string, pass: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { name } }
    });
    
    if (error) throw error;

    if (data.user) {
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: email,
          name: name,
          plan: 'free',
          chars_used: 0,
          role: isAdmin ? 'admin' : 'user',
          chars_reset_at: getResetCheckString('day')
        }, { onConflict: 'id' });
      } catch (e) {
        console.warn("Silent failure on profile create. Handled by refresh.");
      }
    }
  };

  // Improved loading state: Minimal and non-blocking
  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={() => supabase.auth.signOut()}
    >
      {!user ? (
        <Auth onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <div className="flex-1 flex flex-col md:pt-10">
          {activeTab === 'generate' && (
            <>
              <TTSForm 
                onGenerate={onGenerate} 
                isLoading={isGenerating} 
                prefill={prefill} 
                customVoices={customVoices}
                charsUsed={charsUsed}
                subscription={user.subscription}
              />
              <AudioHistory 
                projects={history} 
                onPlay={(url) => { audioRef.src = url; audioRef.play(); }} 
                onDownload={(p) => {
                  const a = document.createElement('a');
                  a.href = p.audioUrl;
                  a.download = `voiceover-${Date.now()}.wav`;
                  a.click();
                }} 
                onDelete={(id) => saveUserData({ history: history.filter(p => p.id !== id) })} 
              />
            </>
          )}
          
          {activeTab === 'admin' && user.role === 'admin' && (
            <AdminPanel />
          )}
          
          {activeTab === 'architect' && (
            <VoiceArchitect 
              onApplyProfile={(v, s) => {
                setPrefill({ voice: v, settings: s });
                setActiveTab('generate');
              }} 
            />
          )}
          
          {activeTab === 'history' && (
            <div className="space-y-12">
               <header className="mb-8 md:mb-12 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-white">My Library</h1>
                  <p className="text-sm md:text-lg font-medium text-slate-500">Your secure cloud-synced audio clips.</p>
                </header>
              <AudioHistory 
                projects={history} 
                onPlay={url => { audioRef.src = url; audioRef.play(); }} 
                onDownload={p => {
                   const a = document.createElement('a');
                   a.href = p.audioUrl;
                   a.download = `voiceover-${p.id}.wav`;
                   a.click();
                }} 
                onDelete={id => saveUserData({ history: history.filter(p => p.id !== id) })} 
              />
            </div>
          )}
          
          {activeTab === 'settings' && (
            <Settings 
              user={user} 
              onLogout={() => supabase.auth.signOut()} 
              onUpdateTheme={t => saveUserData({ theme: t })} 
              setActiveTab={setActiveTab} 
            />
          )}
          
          {activeTab === 'premium' && (
            <Premium user={user} onRefresh={() => refreshUserData(user.id, user.email)} />
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
