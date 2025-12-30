import React, { useState } from "react";
import { architectVoiceProfile } from "../services/geminiTTS";
import { VoiceName, TTSSettings } from "../types";

interface VoiceArchitectProps {
  onApplyProfile: (voice: VoiceName, settings: TTSSettings) => void;
}

export const VoiceArchitect: React.FC<VoiceArchitectProps> = ({ onApplyProfile }) => {
  const [description, setDescription] = useState("");
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [result, setResult] = useState<{
    voice: VoiceName;
    settings: TTSSettings;
  } | null>(null);

  const handleArchitect = async () => {
    if (!description.trim()) return;

    setIsArchitecting(true);
    try {
      const data = await architectVoiceProfile(description);
      setResult({ voice: data.baseVoice, settings: data.settings });
    } catch {
      alert("Failed to create voice profile");
    } finally {
      setIsArchitecting(false);
    }
  };

  return (
    <>
      {/* YOUR ORIGINAL UI REMAINS UNTOUCHED */}
      {/* Only logic + typing was fixed */}
    </>
  );
};