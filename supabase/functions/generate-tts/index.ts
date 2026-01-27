// Fix: Declare Deno global to resolve type errors in environments where 'deno.ns' lib definition is not found.
// This provides minimal type information for Deno.env.get without requiring the full 'deno.ns' lib.
declare global {
  namespace Deno {
    namespace env {
      function get(key: string): string | undefined;
    }
  }
}
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { GoogleGenAI, Modality } from '@google/genai';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.90.1';

// Initialize Supabase Client for backend access to Storage and Database
// Use Deno.env.get for environment variables in Deno Edge Functions
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable is not set.");
  throw new Error("Supabase environment variables not configured.");
}
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Initialize GoogleGenAI
const API_KEY = Deno.env.get('API_KEY');
if (!API_KEY) {
  console.error("API_KEY environment variable is not set.");
  throw new Error("GoogleGenAI API_KEY environment variable not configured.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Character limits (match constants.ts for simplicity)
const PLAN_LIMITS = {
  'free': 700,
  'starter': 50000,
  'vip': 200000,
  'vvip': 1500000,
  'exclusive': 5000000
};

// Helper to create WAV header (corrected for Deno/JavaScript Uint8Array)
function createWavHeader(dataSize: number): Uint8Array {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM Format
  view.setUint16(22, 1, true); // Channels (Mono)
  view.setUint32(24, 24000, true); // Sample Rate
  view.setUint32(28, 48000, true); // Byte Rate (SampleRate * Channels * BitsPerSample / 8)
  view.setUint16(32, 2, true); // Block Align
  view.setUint16(34, 16, true); // Bits per Sample
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
  
  return new Uint8Array(buffer);
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text, voice, settings, userId, textLength } = await req.json();

    if (!text || !voice || !settings || !userId || textLength === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required parameters.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isPreview = userId === "preview_user_id";
    let userData; // Will hold profile data and usage for logged-in users

    let updatedCharsUsed = 0;
    let updatedDailyCharsUsed = 0;
    let updatedCurrentDailyLimit = PLAN_LIMITS['free'];
    let updatedDailyLimitResetTime = new Date().toISOString();

    if (!isPreview) {
      // Fetch user profile from Supabase to check subscription and chars_used
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('subscription, chars_used')
        .eq('id', userId)
        .single();

      if (profileError && profileData === null) { // If user profile not found, create a default one
        console.warn(`Profile for user ${userId} not found. Creating default.`);
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert({ id: userId, subscription: 'free', chars_used: 0, role: 'user', language: 'en' })
          .select()
          .single();
        if (createProfileError) throw createProfileError;
        userData = {
          subscription: newProfile.subscription,
          chars_used: newProfile.chars_used,
        };
      } else if (profileError) {
        throw profileError;
      } else {
        // Use existing profile data
        userData = {
          subscription: profileData.subscription,
          chars_used: profileData.chars_used,
        };
      }

      // Read daily usage and limit from headers (frontend state)
      // NOTE: For a Deno Edge Function, req.headers.get is the only way to get custom headers.
      const dailyCharsUsedFromHeaders = parseInt(req.headers.get('x-daily-chars-used') || '0', 10);
      const currentDailyLimitFromHeaders = parseInt(req.headers.get('x-current-daily-limit') || PLAN_LIMITS['free'].toString(), 10);

      // Check daily character limit based on frontend-provided values
      if (dailyCharsUsedFromHeaders + textLength > currentDailyLimitFromHeaders) {
        return new Response(JSON.stringify({ error: 'Daily character limit reached. Upgrade for unlimited generation.' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Update values for response
      updatedCharsUsed = userData.chars_used + textLength;
      updatedDailyCharsUsed = dailyCharsUsedFromHeaders + textLength; 
      updatedCurrentDailyLimit = currentDailyLimitFromHeaders;
      // Set to current time for consistency, actual reset time managed by frontend/cron job
      updatedDailyLimitResetTime = new Date().toISOString(); 
    }

    /*
     * IMPORTANT: To fix errors like "Could not find the table 'public.tts_projects' in the schema cache"
     * and "Failed to save generated audio project.", you MUST create the 'tts_projects' table
     * in your Supabase project with the following schema:
     *
     * Table Name: tts_projects
     * Enable Row Level Security (RLS): Unchecked (for service role key access)
     * Columns:
     *   - id: TEXT (Primary Key, e.g., 'tts-12345-abcde')
     *   - user_id: TEXT (Foreign Key to 'profiles' table 'id' column)
     *   - text: TEXT
     *   - voice_name: TEXT
     *   - settings: JSONB (stores TTSSettings object: { pitch, speed, expression })
     *   - audio_data_base64: TEXT (stores the full base64 WAV string)
     *   - created_at: TIMESTAMP WITH TIME ZONE (Default value: now())
     */
    // Reverted model name to the one that works for standard TTS generation
    const modelName = 'gemini-2.5-flash-preview-tts'; 
    
    const expressionStr = settings?.expression && settings.expression !== 'Natural' 
      ? ` in a ${settings.expression.toLowerCase()} tone` 
      : '';
    const finalPrompt = `Read the following transcript exactly${expressionStr}: ${text}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: finalPrompt }] }], 
      config: {
        responseModalities: [Modality.AUDIO], 
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('Neural engine attempted to generate text instead of audio. Check prompt clarity or model configuration.');
    }

    const binaryString = atob(base64Audio);
    const binaryAudio = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      binaryAudio[i] = binaryString.charCodeAt(i);
    }
    const wavHeader = createWavHeader(binaryAudio.length);
    const wavFile = new Uint8Array(wavHeader.length + binaryAudio.length);
    wavFile.set(wavHeader);
    wavFile.set(binaryAudio, wavHeader.length);
    const fullBase64Wav = btoa(String.fromCharCode(...wavFile));
    const audioUrl = `data:audio/wav;base64,${fullBase64Wav}`;

    if (!isPreview) {
      // Create a new TTS project record in Supabase
      const { data: newProject, error: projectError } = await supabase
        .from('tts_projects')
        .insert({
          user_id: userId,
          text: text,
          voice_name: voice,
          settings: settings,
          audio_data_base64: fullBase64Wav, // Store base64 audio data
        })
        .select()
        .single();

      if (projectError) throw projectError;

      const { error: updateCharsError } = await supabase
        .from('profiles')
        .update({ chars_used: updatedCharsUsed })
        .eq('id', userId);

      if (updateCharsError) {
        console.error("Error updating chars_used in Supabase:", updateCharsError.message);
      }
    }

    return new Response(JSON.stringify({
      audioUrl: audioUrl,
      base64Audio: fullBase64Wav,
      dailyCharsUsed: isPreview ? 0 : updatedDailyCharsUsed,
      dailyLimitResetTime: isPreview ? new Date().toISOString() : updatedDailyLimitResetTime,
      currentDailyLimit: isPreview ? PLAN_LIMITS['free'] : updatedCurrentDailyLimit,
      charsUsed: isPreview ? 0 : updatedCharsUsed,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Gemini TTS API error in Edge Function:", error.message || error);
    return new Response(JSON.stringify({ error: 'Failed to generate speech', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});