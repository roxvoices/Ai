
import { TTSSettings, VoiceName } from "../types";

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// IMPORTANT: This URL MUST match the URL of your deployed Node.js backend on Render.
// Based on the code you provided, this is the correct URL:
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const BACKEND_BASE_URL = "https://tts-5b1d.onrender.com"; 

/**
 * Professional TTS synthesis via the secure backend proxy.
 */
// Fix: Update return type to include 'charsUsed' for total characters.
export const generateTTS = async (text: string, voice: VoiceName, settings: TTSSettings, userId: string, textLength: number): Promise<{ audioUrl: string, base64Audio: string, dailyCharsUsed: number, dailyLimitResetTime: string, currentDailyLimit: number, charsUsed: number }> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/generate-tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, settings, userId, textLength }), // Pass userId and textLength
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText, details: `HTTP status ${response.status}` }));
      // Prioritize 'details' from backend for more specific errors, or use statusText
      throw new Error(errorData.details || errorData.error || `Synthesis failed (HTTP status ${response.status}).`);
    }

    const responseData = await response.json();
    // Fix: Destructure 'charsUsed' from responseData as it's returned by the backend
    const { audioUrl, base64Audio, dailyCharsUsed, dailyLimitResetTime, currentDailyLimit, charsUsed } = responseData;
    
    // The backend now returns a full WAV base64 string directly
    if (!audioUrl || !base64Audio) throw new Error("No audio data received from engine.");

    // Fix: Include 'charsUsed' in the returned object to match the Promise return type
    return { audioUrl, base64Audio, dailyCharsUsed, dailyLimitResetTime, currentDailyLimit, charsUsed };

  } catch (error: any) {
    console.error("TTS Proxy Error:", error);
    // Removed alert, errors should be handled gracefully upstream or silently logged.
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(`Failed to connect to backend server at ${BACKEND_BASE_URL}. Please ensure the server is running and accessible.`);
    }
    throw new Error(error.message || "Synthesis failed. Check server connection.");
  }
};

/**
 * AI Voice Architect via secure backend proxy.
 */
export const architectVoiceProfile = async (description: string): Promise<any> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/architect-voice`, {
      method: 'POST',
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText, details: `HTTP status ${response.status}` }));
        // Prioritize 'details' from backend for more specific errors
        throw new Error(errorData.details || errorData.error || `Architect proxy failed (HTTP status ${response.status}).`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Architect Proxy Error:", error);
    // Removed alert, errors should be handled gracefully upstream or silently logged.
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(`Failed to connect to backend server at ${BACKEND_BASE_URL}. Please ensure the server is running and accessible.`);
    }
    throw new Error(error.message || "Voice Lab failed to reach the architect.");
  }
};

/**
 * Fetches the user's TTS project history from the backend.
 */
export const fetchUserTTSHistory = async (userId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/user-history?userId=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText, details: `HTTP status ${response.status}` }));
      throw new Error(errorData.details || errorData.error || `Failed to fetch user history (HTTP status ${response.status}).`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Fetch User History Proxy Error:", error);
    // Removed alert, errors should be handled gracefully upstream or silently logged.
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(`Failed to connect to backend server at ${BACKEND_BASE_URL}. Please ensure the server is running and accessible.`);
    }
    throw new Error(error.message || "Failed to retrieve user history.");
  }
};

/**
 * Deletes a TTS project from the backend.
 */
// Fix: Update return type to include 'charsUsed' for total characters.
export const deleteTTSProject = async (userId: string, projectId: string): Promise<{ message: string, dailyCharsUsed: number, charsUsed: number }> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/delete-tts/${projectId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }), // Pass userId for authorization on backend
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText, details: `HTTP status ${response.status}` }));
      throw new Error(errorData.details || errorData.error || `Failed to delete project (HTTP status ${response.status}).`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Delete TTS Project Proxy Error:", error);
    // Removed alert, errors should be handled gracefully upstream or silently logged.
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(`Failed to connect to backend server at ${BACKEND_BASE_URL}. Please ensure the server is running and accessible.`);
    }
    throw new Error(error.message || "Failed to delete project.");
  }
};