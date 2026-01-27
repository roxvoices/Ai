
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Landing } from './components/Landing';
import { Home } from './components/Home'; // New
import { TTSForm } from './components/TTSForm';
import { AudioHistory } from './components/AudioHistory';
import { VoiceArchitect } from './components/VoiceArchitect';
import { Settings } from './components/Settings';
import { Premium } from './components/Premium';
import { AdminPanel } from './components/AdminPanel';
// Functional Tool Components
import { MergeAudio } from './components/tools/MergeAudio';
import { TrimAudio } from './components/tools/TrimAudio';
import { PdfToText } from './components/tools/PdfToText';
import { TextToPdf } from './components/tools/TextToPdf';
import { FileCompressor } from './components/tools/FileCompressor';
import { WordCounter } from './components/tools/WordCounter';
import { LoopAudio } from './components/tools/LoopAudio'; // New
import { VolumeBooster } from './components/tools/VolumeBooster'; // New
import { AddFade } from './components/tools/AddFade'; // New
import { VoiceRecorder } from './components/tools/VoiceRecorder'; // New
import { ConvertAudio } from './components/tools/ConvertAudio'; // New
import { ZipExtractor } from './components/tools/ZipExtractor'; // New
import { ImageResizer } from './components/tools/ImageResizer'; // New
import { DocxToPdf } from './components/tools/DocxToPdf'; // New
import { PdfToWord } from './components/tools/PdfToWord'; // New
import { WordToPdf } from './components/tools/WordToPdf'; // New
import { VideoToAudio } from './components/tools/VideoToAudio'; // New
import { GifMaker } from './components/tools/GifMaker'; // New
import { MemeGenerator } from './components/tools/MemeGenerator'; // New
import { VoiceChanger } from './components/tools/VoiceChanger'; // New
import { Soundboard } from './components/tools/Soundboard'; // New
// Legal Pages
import { Terms } from './components/Terms';
import { Privacy } from './components/Privacy';

import { User, TTSProject, VoiceName, TTSSettings, AppTab, CustomVoiceProfile, Plan, SavedProject } from './types';
import { generateTTS, fetchUserTTSHistory, deleteTTSProject, BACKEND_BASE_URL } from './services/geminiTTS'; // Import BACKEND_BASE_URL
import { supabase } from './lib/supabase';
import { ADMIN_EMAILS, PLAN_LIMITS } from './constants'; // Import ADMIN_EMAILS

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // ONLY for initial session check
  const [showAuth, setShowAuth] = useState(false);
  const [history, setHistory] = useState<TTSProject[]>([]);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [customVoices, setCustomVoices] = useState<CustomVoiceProfile[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prefill, setPrefill] = useState<{voice: VoiceName, settings: TTSSettings, text?: string} | undefined>(undefined);
  const [audioRef] = useState(new Audio());
  const [theme, setTheme] = useState<'default' | 'black' | 'white' | 'blue'>('default');
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Refactored `refreshUserData` to NOT control `authLoading`
  const refreshUserData = useCallback(async (userId: string, email: string) => {
    let userData: User | null = null;
    
    try {
      // 1. Fetch role, subscription, chars_used, AND language from Supabase profiles (core data)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, subscription, chars_used, language') // <--- ADDED 'language' HERE
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "No rows found" for .single()
        console.error("Supabase profile fetch failed:", profileError.message);
        // This is a critical failure, clear user and redirect to auth
        alert(`Session refresh failed: Core profile data unreachable. Details: ${profileError.message}. Please try logging in again.`);
        setUser(null); 
        setShowAuth(false); 
        setActiveTab('home');
        return; // Stop execution if core profile fetch fails
      }
      
      const dbRole = profileData?.role ?? 'user';
      const dbSubscription: Plan = profileData?.subscription ?? 'free';
      const dbCharsUsed: number = profileData?.chars_used ?? 0;
      const dbLanguage: string = profileData?.language ?? 'en'; // <--- Get language from DB, default to 'en'

      // Determine the user's role, with ADMIN_EMAILS override
      let userRole: 'user' | 'admin' = dbRole;
      if (ADMIN_EMAILS.includes(email)) {
        userRole = 'admin';
      }
      
      // Initialize user data with persistent values
      userData = {
        id: userId,
        email: email,
        name: email.split('@')[0],
        history: [], 
        projects: [],
        customVoices: [],
        subscription: dbSubscription, 
        charsUsed: dbCharsUsed,
        dailyCharsUsed: 0, // Default until fetched from backend
        dailyLimitResetTime: new Date().toISOString(), // Default until fetched
        currentDailyLimit: PLAN_LIMITS['free'], // Default until fetched
        theme: 'default',
        language: dbLanguage, // <--- Use the fetched language here
        role: userRole,
      };

      // 2. Fetch dynamic user data (daily usage stats, daily limit reset time, current daily limit) from our custom Node.js backend
      try {
        const backendUserDataResponse = await fetch(`${BACKEND_BASE_URL}/user-profile?userId=${userId}&subscription=${dbSubscription}&charsUsed=${dbCharsUsed}`);
        if (!backendUserDataResponse.ok) {
          const errorBody = await backendUserDataResponse.json();
          throw new Error(`Backend API error (${backendUserDataResponse.status}): ${errorBody.error || backendUserDataResponse.statusText}`);
        }
        const backendUserData = await backendUserDataResponse.json();
        userData = {
          ...userData,
          dailyCharsUsed: backendUserData.dailyCharsUsed,
          dailyLimitResetTime: backendUserData.dailyLimitResetTime,
          currentDailyLimit: backendUserData.currentDailyLimit,
          charsUsed: backendUserData.charsUsed, // Ensure this is updated from backend's calculation
        };
      } catch (backendFetchError: any) {
        console.warn("Failed to fetch dynamic user data from custom backend (non-critical):", backendFetchError);
        // DO NOT show alert, DO NOT redirect. Allow user to proceed with available data.
      }

      // 3. Fetch user TTS history from our custom backend
      try {
        const userHistory = await fetchUserTTSHistory(userId);
        userData.history = userHistory;
        setHistory(userHistory);
      } catch (historyFetchError: any) {
        console.warn("Failed to fetch user TTS history from backend (non-critical):", historyFetchError);
        // DO NOT show alert, DO NOT redirect. Allow user to proceed with available data.
      }
      
      setUser(userData);
      setSavedProjects([]); // Clear and re-fetch if you have a persistent project system
      setCustomVoices([]);  // Clear and re-fetch if you have a persistent custom voice system
      setTheme(userData.theme);
      setLanguage(userData.language); // <--- Set the language state with the fetched language
      
      // Admin routing logic:
      if (userData.role === 'admin') {
        setActiveTab('admin');
      } else if (activeTab === 'admin') { // If user was an admin but now isn't, redirect them
        setActiveTab('home'); 
      } else if (!user) { // Only set to home if first login
        setActiveTab('home'); 
      }
      // If user is already set and not admin, keep current activeTab
      

    } catch (err: any) {
      // This catch block is for unhandled errors during the entire refresh process
      // or for critical Supabase profile fetch failures.
      console.error("Critical session refresh error:", err.message || err);
      // Only show alert and redirect if userData is null (i.e., critical auth/profile issue)
      if (!userData) { // If userData is still null, it means critical data couldn't be fetched
        alert(`Critical Session Error: ${err.message || 'An unknown error occurred during session refresh.'} Please try logging in again.`);
        setUser(null); 
        setShowAuth(false); 
        setActiveTab('home'); // Only redirect to home on critical session errors
      }
    }
    // `authLoading` is handled in the useEffect hook below, not here.
  }, [BACKEND_BASE_URL, activeTab, user]); // Added user to dependencies

  // Effect to manage initial authentication and `authLoading` state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        refreshUserData(session.user.id, session.user.email || '');
      }
      setAuthLoading(false); // ALWAYS set authLoading to false after initial session check
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // When signed in, refresh data but do not block UI with authLoading
        refreshUserData(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') { 
        setUser(null); 
        setHistory([]); 
        setShowAuth(false); 
        setActiveTab('home'); 
        setAuthLoading(false); // Ensure authLoading is false on sign out
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshUserData]); // `refreshUserData` is a dependency as it's called here

  // Effect to protect the admin tab (already existed, ensuring it still works with new role logic)
  useEffect(() => {
    if (activeTab === 'admin' && user && user.role !== 'admin') {
      setActiveTab('home');
      console.log('App: Setting active tab to home (Unauthorized Admin access attempt)');
    }
  }, [activeTab, user]);

  // Add console log for active tab changes
  const handleSetActiveTab = useCallback((tab: AppTab) => {
    console.log('App: Setting active tab to', tab);
    setActiveTab(tab);
  }, []);


  const onGenerate = async (text: string, voice: VoiceName, settings: TTSSettings) => {
    if (!user) {
      alert("Please log in to generate TTS audio.");
      return;
    }

    if (user.dailyCharsUsed + text.length > user.currentDailyLimit) {
      alert(`Daily character limit reached (${user.dailyCharsUsed}/${user.currentDailyLimit}). Upgrade for unlimited generation.`);
      return;
    }

    setIsGenerating(true);
    try {
      const { audioUrl, dailyCharsUsed, dailyLimitResetTime, currentDailyLimit, charsUsed: totalCharsUsed } = await generateTTS(text, voice, settings, user.id, text.length);
      
      setUser(prevUser => prevUser ? { 
        ...prevUser, 
        dailyCharsUsed: dailyCharsUsed, 
        dailyLimitResetTime: dailyLimitResetTime,
        currentDailyLimit: currentDailyLimit,
        charsUsed: totalCharsUsed, // Update total chars from backend response
      } : null);

      audioRef.src = audioUrl;
      audioRef.play();

      // Refresh history in the background, without blocking main UI
      try {
        // Ensure to pass userId and email from the current user state
        if (user) {
          await refreshUserData(user.id, user.email || '');
        }
      } catch (refreshErr) {
        console.warn("Partial refresh after TTS failed (non-critical):", refreshErr);
      }

      handleSetActiveTab('history');

    } catch (err: any) {
      console.error("TTS Generation Error:", err);
      alert(`TTS Generation Failed: ${err.message || 'An unknown error occurred.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const onDeleteTTSProject = async (projectId: string) => {
    if (!user) {
      alert("Please log in to delete audio projects.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this audio project?")) return;

    try {
      const { dailyCharsUsed, charsUsed: totalCharsUsed } = await deleteTTSProject(user.id, projectId);
      
      setUser(prevUser => prevUser ? {
        ...prevUser,
        dailyCharsUsed: dailyCharsUsed,
        charsUsed: totalCharsUsed, // Update total chars from backend response
      } : null);

      // Refresh history in the background, without blocking main UI
      try {
        // Ensure to pass userId and email from the current user state
        if (user) {
          await refreshUserData(user.id, user.email || '');
        }
      } catch (refreshErr) {
        console.warn("Partial refresh after project deletion failed (non-critical):", refreshErr);
      }
    } catch (err: any) {
      console.error("Failed to delete project:", err);
      alert(`Failed to delete project: ${err.message || 'An unknown error occurred.'}`);
    }
  };

  const onSaveProject = async (name: string, text: string, voice: VoiceName, settings: TTSSettings) => {
    if (!user) {
      alert("Please log in to save projects.");
      return;
    }
    const newSaved: SavedProject = {
      id: Math.random().toString(36).substring(2, 9),
      name, text, voiceName: voice, settings,
      updatedAt: new Date().toISOString()
    };
    setSavedProjects(prev => [...prev, newSaved]);
    alert("Project saved successfully to your local browser storage."); // Inform user
  };

  const updateLanguage = async (l: string) => {
    setLanguage(l);
    if (user) {
      const { error } = await supabase.from('profiles').update({ language: l }).eq('id', user.id);
      if (error) console.error("Error updating language in Supabase:", error);
    }
  };

  const handleShowAuth = (show: boolean) => {
    setShowAuth(show);
  };

  // The "Neural Synchronizing..." overlay only appears if authLoading is true
  if (authLoading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Neural Synchronizing...</div>;
  
  // Render Legal pages directly if activeTab is 'terms' or 'privacy' and user is not logged in
  if (!user && (activeTab === 'terms' || activeTab === 'privacy')) {
    return activeTab === 'terms' ? <Terms language={language} setActiveTab={handleSetActiveTab} /> : <Privacy language={language} setActiveTab={handleSetActiveTab} />;
  }

  if (user) return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={handleSetActiveTab} // Use the wrapped setActiveTab
      onLogout={() => supabase.auth.signOut()}
      language={language}
      onUpdateLanguage={updateLanguage}
      onLoginClick={() => handleShowAuth(true)}
      onRegisterClick={() => handleShowAuth(true)}
    >
      <div className="flex-1 flex flex-col">
        {activeTab === 'home' && <Home setActiveTab={handleSetActiveTab} language={language} />} {/* Use wrapped setActiveTab */}
        {activeTab === 'tts-studio' && (
          <TTSForm 
            onGenerate={onGenerate} 
            onSaveProject={onSaveProject}
            isLoading={isGenerating} 
            prefill={prefill} 
            customVoices={customVoices} 
            charsUsed={user.dailyCharsUsed}
            subscription={user.subscription} 
            language={language}
          />
        )}
        {activeTab === 'history' && (
          <AudioHistory 
            projects={history} 
            onPlay={url => { audioRef.src = url; audioRef.play(); }} 
            onDownload={p => { const a = document.createElement('a'); a.href = p.audioUrl; a.download = `rox-${p.id}.wav`; a.click(); }} 
            onDelete={onDeleteTTSProject} 
            onCloseVault={() => handleSetActiveTab('tts-studio')} // Use wrapped setActiveTab
          />
        )}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white uppercase italic">Saved Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedProjects.map(p => (
                <div key={p.id} className="glass-panel p-6 rounded-3xl border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-lg">{p.name}</h3>
                    <span className="text-[8px] font-black uppercase text-blue-500">{p.voiceName}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{p.text}</p>
                  <button 
                    type="button"
                    onClick={() => { setPrefill({ voice: p.voiceName, settings: p.settings, text: p.text }); handleSetActiveTab('tts-studio'); }} // Use wrapped setActiveTab
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                  >
                    Open in Studio
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'architect' && <VoiceArchitect onApplyProfile={(v, s) => { setPrefill({ voice: v, settings: s }); handleSetActiveTab('tts-studio'); }} onSaveProfile={v => setCustomVoices([v, ...customVoices])} />} {/* Use wrapped setActiveTab */}
        {activeTab === 'settings' && <Settings user={user} onLogout={() => supabase.auth.signOut()} onUpdateTheme={setTheme} setActiveTab={handleSetActiveTab} />} {/* Use wrapped setActiveTab */}
        {activeTab === 'premium' && <Premium user={user} onRefresh={() => refreshUserData(user.id, user.email || '')} />}
        {activeTab === 'admin' && user.role === 'admin' && <AdminPanel />}
        
        {/* Only render functional tools */}
        {activeTab === 'merge-audio' && <MergeAudio language={language} />}
        {activeTab === 'trim-audio' && <TrimAudio language={language} />}
        {activeTab === 'loop-audio' && <LoopAudio language={language} />}
        {activeTab === 'volume-booster' && <VolumeBooster language={language} />}
        {activeTab === 'add-fade' && <AddFade language={language} />}
        {activeTab === 'voice-recorder' && <VoiceRecorder language={language} />}
        {activeTab === 'convert-audio-format' && <ConvertAudio language={language} />}
        {activeTab === 'pdf-to-text' && <PdfToText language={language} />}
        {activeTab === 'text-to-pdf' && <TextToPdf language={language} />}
        {activeTab === 'zip-extractor' && <ZipExtractor language={language} />}
        {activeTab === 'file-compressor' && <FileCompressor language={language} />}
        {activeTab === 'image-resizer' && <ImageResizer language={language} />}
        {activeTab === 'docx-to-pdf' && <DocxToPdf language={language} />}
        {activeTab === 'pdf-to-word' && <PdfToWord language={language} />}
        {activeTab === 'word-to-pdf' && <WordToPdf language={language} />}
        {activeTab === 'word-counter' && <WordCounter language={language} />}
        {activeTab === 'video-to-audio' && <VideoToAudio language={language} />}
        {activeTab === 'gif-maker' && <GifMaker language={language} />}
        {activeTab === 'meme-generator' && <MemeGenerator language={language} />}
        {activeTab === 'voice-changer' && <VoiceChanger language={language} />}
        {activeTab === 'soundboard' && <Soundboard language={language} />}

        {/* Legal Pages */}
        {activeTab === 'terms' && <Terms language={language} setActiveTab={handleSetActiveTab} />}
        {activeTab === 'privacy' && <Privacy language={language} setActiveTab={handleSetActiveTab} />}
      </div>
    </Layout>
  );

  // Default rendering for unauthenticated users (not terms/privacy)
  return showAuth 
    ? <Auth onLogin={(e, p) => supabase.auth.signInWithPassword({email: e, password: p})} onRegister={(n, e, p) => supabase.auth.signUp({email: e, password: p, options: {data: {name: n}}})} /> 
    : <Landing onEnter={() => handleShowAuth(true)} setActiveTab={handleSetActiveTab} />;
};

export default App;
