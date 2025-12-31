import React, { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { Auth } from "./components/Auth";
import { TTSForm } from "./components/TTSForm";
import { AudioHistory } from "./components/AudioHistory";
import { VoiceArchitect } from "./components/VoiceArchitect";
import {
  User,
  TTSProject,
  VoiceName,
  TTSSettings,
  AppTab,
  CustomVoiceProfile,
} from "./types";
import { generateTTS } from "./services/geminiTTS";
import { DAILY_CHAR_LIMIT } from "./constants";
import { supabase } from "./lib/supabaseClient";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<TTSProject[]>([]);
  const [customVoices, setCustomVoices] = useState<CustomVoiceProfile[]>([]);
  const [charsUsed, setCharsUsed] = useState(0);
  const [activeTab, setActiveTab] = useState<AppTab>("generate");
  const [isGenerating, setIsGenerating] = useState(false);
  const [prefill, setPrefill] =
    useState<{ voice: VoiceName; settings: TTSSettings }>();
  const [audioRef] = useState(new Audio());

  const getCATDate = () => {
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const cat = new Date(utc + 2 * 3600000);
    return cat.toISOString().split("T")[0];
  };

  // 🔑 SUPABASE AUTH STATE
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        setUser({
          id: u.id,
          email: u.email || "",
          name: u.email?.split("@")[0] || "User",
          history: [],
          charsUsed: 0,
          lastResetDate: getCATDate(),
          customVoices: [],
        });
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          email: u.email || "",
          name: u.email?.split("@")[0] || "User",
          history: [],
          charsUsed: 0,
          lastResetDate: getCATDate(),
          customVoices: [],
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const onGenerate = async (
    text: string,
    voice: VoiceName,
    settings: TTSSettings
  ) => {
    if (!user) return;

    if (charsUsed + text.length > DAILY_CHAR_LIMIT) {
      alert("Daily character limit reached.");
      return;
    }

    setIsGenerating(true);
    try {
      const { audioUrl } = await generateTTS(text, voice, settings);

      const project: TTSProject = {
        id: Date.now().toString(),
        text,
        voiceName: voice,
        createdAt: new Date().toISOString(),
        audioUrl,
        settings,
      };

      setHistory((prev) => [project, ...prev]);
      setCharsUsed((prev) => prev + text.length);

      audioRef.src = audioUrl;
      audioRef.play();
      setActiveTab("history");
    } catch {
      alert("Audio generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyArchitectProfile = (
    voice: VoiceName,
    settings: TTSSettings
  ) => {
    setPrefill({ voice, settings });
    setActiveTab("generate");
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout}>
      {!user ? (
        <Auth />
      ) : (
        <>
          {activeTab === "generate" && (
            <TTSForm
              onGenerate={onGenerate}
              isLoading={isGenerating}
              prefill={prefill}
              customVoices={customVoices}
              charsUsed={charsUsed}
            />
          )}

          {activeTab === "architect" && (
            <VoiceArchitect onApplyProfile={applyArchitectProfile} />
          )}

          {activeTab === "history" && (
            <AudioHistory
              projects={history}
              onPlay={(url) => {
                audioRef.src = url;
                audioRef.play();
              }}
              onDownload={(p) => {
                const a = document.createElement("a");
                a.href = p.audioUrl;
                a.download = "voice.wav";
                a.click();
              }}
              onDelete={(id) =>
                setHistory((prev) => prev.filter((p) => p.id !== id))
              }
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
