
export type Plan = 'free' | 'starter' | 'vip' | 'vvip' | 'exclusive';

export interface User {
  id: string;
  email: string;
  name: string;
  history: TTSProject[];
  charsUsed: number;
  lastResetDate: string; 
  customVoices: CustomVoiceProfile[];
  theme?: 'default' | 'black' | 'white' | 'blue';
  subscription: Plan;
  role: 'user' | 'admin'; // Added role
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
  enhancement?: 'none' | 'studio' | 'warmth' | 'compressed';
  customDescription?: string;
  baseVoice?: VoiceName; 
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

export interface PaymentRequest {
  id: string;
  user_id: string;
  user_email: string;
  plan: Plan;
  screenshot_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export type AppTab = 'generate' | 'architect' | 'history' | 'settings' | 'premium' | 'admin';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
