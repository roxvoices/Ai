
import { VoiceName, VoiceDefinition, Plan } from './types';

export const APP_NAME = "Rox Voices";
export const ADMIN_EMAILS = ['markwell244@gmail.com'];

export interface PlanConfig {
  limit: number;
  duration: 'day' | 'month' | 'year';
  price: string;
}

export const PLAN_CONFIGS: Record<Plan, PlanConfig> = {
  'free': { limit: 500, duration: 'day', price: '$0' },
  'starter': { limit: 50000, duration: 'month', price: '$5' },
  'vip': { limit: 200000, duration: 'month', price: '$12.99' },
  'vvip': { limit: 1500000, duration: 'year', price: '$50' },
  'exclusive': { limit: 5000000, duration: 'year', price: '$99.99' }
};

// For backward compatibility
export const PLAN_LIMITS: Record<Plan, number> = {
  'free': 500,
  'starter': 50000,
  'vip': 200000,
  'vvip': 1500000,
  'exclusive': 5000000
};

export const VOICES: (VoiceDefinition & { role: string, previewText: string })[] = [
  { id: 'v-zephyr', name: 'Zephyr', baseVoice: VoiceName.ZEPHYR, description: 'Neutral Professional', tags: ['Classic', 'News'], role: 'Best for Audiobooks & Corporate News', previewText: 'Welcome to the future of professional narration.', defaultSettings: { expression: 'Professional' } },
  { id: 'v-kore', name: 'Kore', baseVoice: VoiceName.KORE, description: 'Bright Female', tags: ['Classic', 'Upbeat'], role: 'Ideal for Commercials & Tutorials', previewText: 'I can bring your brand to life with energy.', defaultSettings: { expression: 'Cheerful' } },
  { id: 'v-puck', name: 'Puck', baseVoice: VoiceName.PUCK, description: 'Youthful Male', tags: ['Classic', 'Fast'], role: 'Perfect for Social Media & Vlogs', previewText: 'Let’s make something amazing for your followers!', defaultSettings: { expression: 'Excited' } },
  { id: 'v-charon', name: 'Charon', baseVoice: VoiceName.CHARON, description: 'Deep Cinematic', tags: ['Classic', 'Bold'], role: 'Movie Trailers & Hardcore Gaming', previewText: 'In a world where sound defines reality...', defaultSettings: { expression: 'Authoritative' } },
  { id: 'v-fenrir', name: 'Fenrir', baseVoice: VoiceName.FENRIR, description: 'Atmospheric Storyteller', tags: ['Classic', 'Soft'], role: 'Meditations & Horror Podcasts', previewText: 'Listen closely to the whispers of the wind.', defaultSettings: { expression: 'Somber' } },
  { id: 'v-atlas', name: 'Atlas', baseVoice: VoiceName.CHARON, description: 'Deep Narrator', role: 'History & Space Documentaries', previewText: 'The universe is vaster than we can imagine.', tags: ['Documentary', 'Deep'], defaultSettings: { pitch: 0.8, speed: 0.9, expression: 'Authoritative' } },
  { id: 'v-luna', name: 'Luna', baseVoice: VoiceName.KORE, description: 'Soft Nighttime', role: 'Sleep Stories & Bedtime Apps', previewText: 'Close your eyes and breathe in the calm night.', tags: ['Calm', 'Female'], defaultSettings: { pitch: 1.1, speed: 0.8, expression: 'Whispering' } },
  { id: 'v-nova', name: 'Nova', baseVoice: VoiceName.KORE, description: 'Tech Enthusiast', role: 'Tech Reviews & Keynotes', previewText: 'This new update is absolutely revolutionary!', tags: ['Bright', 'Female'], defaultSettings: { speed: 1.1, expression: 'Excited' } },
  { id: 'v-silas', name: 'Silas', baseVoice: VoiceName.ZEPHYR, description: 'Academic Lecturer', role: 'E-Learning & Scientific Reports', previewText: 'The hypothesis suggests a significant correlation.', tags: ['Formal', 'Male'], defaultSettings: { pitch: 0.9, speed: 0.95, expression: 'Professional' } },
  { id: 'v-piper', name: 'Piper', baseVoice: VoiceName.PUCK, description: 'High-energy Host', role: 'Radio Shows & Event Intro', previewText: 'And now, for the main event of the night!', tags: ['Radio', 'Male'], defaultSettings: { pitch: 1.2, speed: 1.1, expression: 'Excited' } },
  { id: 'v-elara', name: 'Elara', baseVoice: VoiceName.KORE, description: 'Sophisticated Brand', role: 'Luxury Fashion & Jewelry Ads', previewText: 'Elegance is not about being noticed, but remembered.', tags: ['Luxury', 'Female'], defaultSettings: { pitch: 0.95, speed: 0.85, expression: 'Natural' } },
  { id: 'v-orion', name: 'Orion', baseVoice: VoiceName.CHARON, description: 'Epic Hero', role: 'Fantasy RPGs & War Games', previewText: 'My sword is ready. To victory or death!', tags: ['Games', 'Deep'], defaultSettings: { pitch: 0.7, speed: 1.0, expression: 'Authoritative' } },
  { id: 'v-milo', name: 'Milo', baseVoice: VoiceName.PUCK, description: 'Friendly Neighbor', role: 'Explainer Videos & Local Ads', previewText: 'Hey there! Let me show you around the neighborhood.', tags: ['Casual', 'Male'], defaultSettings: { pitch: 1.0, speed: 1.05, expression: 'Cheerful' } },
  { id: 'v-seraphina', name: 'Seraphina', baseVoice: VoiceName.FENRIR, description: 'Mystical Guide', role: 'Fortune Telling & Magic Apps', previewText: 'The cards reveal a path hidden in shadow.', tags: ['Fantasy', 'Soft'], defaultSettings: { pitch: 1.2, speed: 0.75, expression: 'Whispering' } },
  { id: 'v-jax', name: 'Jax', baseVoice: VoiceName.PUCK, description: 'Street Smart', role: 'Urban Podcasts & Sport Commentary', previewText: 'Keep it real, keep it moving, you know?', tags: ['Energetic', 'Urban'], defaultSettings: { pitch: 1.1, speed: 1.2, expression: 'Excited' } },
  { id: 'v-beatrice', name: 'Beatrice', baseVoice: VoiceName.KORE, description: 'Kind Grandmother', role: 'Stories for Kids & Cooking Tips', previewText: 'Welcome home, dear. I’ve baked something special.', tags: ['Warm', 'Female'], defaultSettings: { pitch: 0.85, speed: 0.8, expression: 'Natural' } },
  { id: 'v-arthur', name: 'Arthur', baseVoice: VoiceName.ZEPHYR, description: 'Wise Elder', role: 'Philosophical Quotes & Poetry', previewText: 'Time waits for no man, yet it holds all things.', tags: ['Vintage', 'Male'], defaultSettings: { pitch: 0.75, speed: 0.85, expression: 'Somber' } },
  { id: 'v-tess', name: 'Tess', baseVoice: VoiceName.KORE, description: 'Sassy Assistant', role: 'Interactive AI & Chatbots', previewText: 'Oh, really? Tell me something I don’t know.', tags: ['Witty', 'Female'], defaultSettings: { pitch: 1.05, speed: 1.15, expression: 'Excited' } },
  { id: 'v-victor', name: 'Victor', baseVoice: VoiceName.CHARON, description: 'Villainous Lord', role: 'Boss Fights & Dark Audiobooks', previewText: 'You are persistent, but ultimately futile.', tags: ['Dark', 'Deep'], defaultSettings: { pitch: 0.6, speed: 0.8, expression: 'Authoritative' } },
  { id: 'v-cleo', name: 'Cleo', baseVoice: VoiceName.FENRIR, description: 'Zen Master', role: 'Yoga Guides & Relaxation', previewText: 'Find your center. Let the outside world fade.', tags: ['Relaxing', 'Peaceful'], defaultSettings: { pitch: 0.9, speed: 0.7, expression: 'Natural' } },
  { id: 'v-hugo', name: 'Hugo', baseVoice: VoiceName.ZEPHYR, description: 'Sports Commentator', role: 'Live Play-by-play & Racing', previewText: 'He’s heading for the finish line! Unbelievable!', tags: ['Hype', 'Fast'], defaultSettings: { pitch: 1.1, speed: 1.3, expression: 'Excited' } },
  { id: 'v-rhea', name: 'Rhea', baseVoice: VoiceName.KORE, description: 'Motherly Comfort', role: 'Advice Columns & Therapy Content', previewText: 'It’s okay to feel this way. I’m here for you.', tags: ['Caring', 'Female'], defaultSettings: { pitch: 1.0, speed: 0.9, expression: 'Cheerful' } },
  { id: 'v-balthazar', name: 'Balthazar', baseVoice: VoiceName.CHARON, description: 'Ancient Wizard', role: 'Epic Fantasy Narrator', previewText: 'The age of men is coming to an end.', tags: ['Mythic', 'Deep'], defaultSettings: { pitch: 0.5, speed: 0.6, expression: 'Somber' } },
  { id: 'v-ziggy', name: 'Ziggy', baseVoice: VoiceName.PUCK, description: 'Playful Child', role: 'Cartoons & Children’s Games', previewText: 'Let’s go find some treasure! Race you there!', tags: ['High', 'Fun'], defaultSettings: { pitch: 1.4, speed: 1.2, expression: 'Excited' } },
  { id: 'v-freya', name: 'Freya', baseVoice: VoiceName.FENRIR, description: 'Nordic Spirit', role: 'Winter Themed Content', previewText: 'Ice and snow are my kingdom. Welcome to the frost.', tags: ['Cold', 'Ethereal'], defaultSettings: { pitch: 1.1, speed: 0.85, expression: 'Somber' } }
];

export const EXPRESSIONS = [
  'Natural',
  'Professional',
  'Cheerful',
  'Somber',
  'Whispering',
  'Authoritative',
  'Excited'
];
