
export interface User {
  id: string;
  email: string;
  name: string;
  history: TTSProject[];
  charsUsed: number;
  lastResetDate: string; // ISO Date string for CAT reset tracking
  customVoices: CustomVoiceProfile[];
}

export interface TTSProject {
  id: string;
  text: string;
  voiceName: string;
  createdAt: string;
  audioUrl: string;
  settings: TTSSettings;
}

export interface TTSSettings {
  pitch: number;
  speed: number;
  expression: string;
  customDescription?: string;
  baseVoice?: VoiceName; // Added to help mapping virtual/custom voices
}

export interface CustomVoiceProfile {
  id: string;
  name: string;
  description: string;
  baseVoice: VoiceName;
  settings: TTSSettings;
}

export enum VoiceName {
  ZEPHYR = 'Zephyr',
  KORE = 'Kore',
  PUCK = 'Puck',
  CHARON = 'Charon',
  FENRIR = 'Fenrir'
}

export interface VoiceDefinition {
  id: string;
  name: string;
  description: string;
  baseVoice: VoiceName;
  tags: string[];
  defaultSettings: Partial<TTSSettings>;
}

export type AppTab = 'generate' | 'architect' | 'history';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
