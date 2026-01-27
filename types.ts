

export type Plan = 'free' | 'starter' | 'vip' | 'vvip' | 'exclusive';

export interface User {
  id: string;
  email: string;
  name: string;
  history: TTSProject[];
  projects: SavedProject[];
  charsUsed: number; // Total characters used over time (now persistent in DB)
  dailyCharsUsed: number; // Characters used in the current daily period (in-memory)
  dailyLimitResetTime: string; // ISO string for when the daily limit resets (in-memory)
  currentDailyLimit: number; // The current daily character limit based on subscription (in-memory)
  lastResetDate?: string; // Optional, as it's primarily managed by backend's daily reset logic
  customVoices: CustomVoiceProfile[];
  theme?: 'default' | 'black' | 'white' | 'blue';
  subscription: Plan; // Now persistent in DB
  role: 'user' | 'admin';
  language: string;
}

// New interface for user data in the Admin Panel
export interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  subscription: Plan;
  charsUsed: number;
  role: 'user' | 'admin';
}

export interface TTSProject {
  id: string;
  text: string;
  voiceName: string;
  createdAt: string;
  audioUrl: string;
  settings: TTSSettings;
}

export interface SavedProject {
  id: string;
  name: string;
  text: string;
  // References the VoiceName enum directly (e.g., Zephyr, Kore)
  voiceName: VoiceName; 
  settings: TTSSettings;
  updatedAt: string;
}

export interface PaymentRequest {
  id: string;
  user_id: string;
  user_email: string;
  plan: Plan;
  screenshot_url: string; // This will now be a dynamically generated signed URL for display
  screenshot_path?: string; // This will be the actual path in Supabase Storage
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
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

// Fix: Add export for VoiceDefinition
export interface VoiceDefinition {
  id: string;
  name: string;
  baseVoice: VoiceName; // Added baseVoice here
  gender: 'male' | 'female';
  age: 'child' | 'young' | 'adult' | 'elder';
  role: string;
  description: string;
  tags: string[];
  previewText: string;
  defaultSettings: TTSSettings;
}

export type AppTab = 
  'home' | 
  'tts-studio' | // Renamed from 'generate'
  'projects' | 
  'history' | 
  'architect' | 
  'settings' | 
  'premium' | 
  'admin' |
  // New Audio Tools
  'merge-audio' |
  'trim-audio' |
  'loop-audio' |
  'volume-booster' |
  'add-fade' |
  'voice-recorder' |
  'convert-audio-format' |
  // New File Tools
  'pdf-to-text' |
  'text-to-pdf' |
  'zip-extractor' |
  'file-compressor' |
  'image-resizer' |
  'docx-to-pdf' |
  'word-counter' |
  'pdf-to-word' | // New: PDF to Word converter
  'word-to-pdf' | // New: Word to PDF converter
  // New Media Tools
  'video-to-audio' |
  'gif-maker' |
  'meme-generator' |
  // New Fun Tools
  'soundboard' |
  'voice-changer' | // Fix: Added 'voice-changer' to AppTab type
  // Legal Pages
  'terms' |
  'privacy';