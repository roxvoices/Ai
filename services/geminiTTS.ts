import { supabase } from "../lib/supabase";
import { TTSSettings, VoiceName } from "../types";

/* =======================
   Base64 decoding helpers
======================= */

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
  numChannels: number
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] =
        dataInt16[i * numChannels + channel] / 32768.0;
    }
  }

  return buffer;
};

const audioBufferToWav = (buffer: AudioBuffer): Blob => {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const bufferLength = buffer.length;
  const dataSize = bufferLength * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  const channelData = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < bufferLength; i++, offset += 2) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(
      offset,
      sample < 0 ? sample * 0x8000 : sample * 0x7fff,
      true
    );
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
};

/* =======================
   MAIN TTS FUNCTION
======================= */

export const generateTTS = async (
  text: string,
  voice: VoiceName,
  settings: TTSSettings
): Promise<{ audioUrl: string; blob: Blob }> => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch("/api/gemini-tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text, voice, settings }),
  });

  /* 🔥 THIS IS THE CRITICAL FIX */
  if (!response.ok) {
    const textResponse = await response.text();

    try {
      const json = JSON.parse(textResponse);
      throw new Error(json.error || "TTS failed");
    } catch {
      throw new Error(textResponse);
    }
  }

  const { audioBase64 } = await response.json();

  if (!audioBase64) {
    throw new Error("No audio returned from server");
  }

  const audioContext = new AudioContext({ sampleRate: 24000 });
  const audioBuffer = await decodeAudioData(
    decode(audioBase64),
    audioContext,
    24000,
    1
  );

  const blob = audioBufferToWav(audioBuffer);
  const audioUrl = URL.createObjectURL(blob);

  return { audioUrl, blob };
};
