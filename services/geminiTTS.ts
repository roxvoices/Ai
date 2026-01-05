
import { supabase } from "../lib/supabase";
import { TTSSettings, VoiceName } from "../types";

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

const audioBufferToWav = (buffer: AudioBuffer): Blob => {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; 
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const bufferLength = buffer.length;
  const dataSize = bufferLength * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);
  
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
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
  
  const offset = 44;
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < bufferLength; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
};

export const generateTTS = async (text: string, voice: VoiceName, settings: TTSSettings): Promise<{ audioUrl: string, blob: Blob }> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch("/api/gemini-tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({ text, voice, settings }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Backend synthesis failed");
  }

  const { base64Audio } = await response.json();

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
  const blob = audioBufferToWav(audioBuffer);
  const audioUrl = URL.createObjectURL(blob);
  
  return { audioUrl, blob };
};

export const architectVoiceProfile = async (description: string): Promise<any> => {
  // Architecting is still fine on frontend as it doesn't consume credits 
  // and doesn't expose sensitive logic, but can be moved to backend if preferred.
  // For now, we'll keep it simple.
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch("/api/architect-voice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({ description }),
  });
  return response.json();
};
