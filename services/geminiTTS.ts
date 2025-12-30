import { TTSSettings, VoiceName, ArchitectResult } from "../types";

/* =========================
   Audio Helpers
========================= */

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
      channelData[i] = dataInt16[i * numChannels + channel] / 32768;
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
  const dataSize = buffer.length * blockAlign;

  const bufferArray = new ArrayBuffer(44 + dataSize);
  const view = new DataView(bufferArray);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
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

  for (let i = 0; i < buffer.length; i++, offset += 2) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample * 0x7fff, true);
  }

  return new Blob([bufferArray], { type: "audio/wav" });
};

/* =========================
   MAIN TTS
========================= */

export const generateTTS = async (
  text: string,
  voice: VoiceName,
  settings: TTSSettings
) => {
  const res = await fetch("/api/gemini-tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, settings }),
  });

  if (!res.ok) throw new Error("TTS failed");

  const { audioBase64, sampleRate, channels } = await res.json();

  const ctx = new AudioContext({ sampleRate });
  const audioBuffer = await decodeAudioData(
    decode(audioBase64),
    ctx,
    sampleRate,
    channels
  );

  const blob = audioBufferToWav(audioBuffer);
  return {
    audioUrl: URL.createObjectURL(blob),
    blob,
  };
};

/* =========================
   VOICE ARCHITECT (FIXED)
========================= */

export const architectVoiceProfile = async (
  description: string
): Promise<ArchitectResult> => {
  // You can later connect this to Gemini / OpenAI / custom AI logic
  // For now, this safely returns a structured result

  return {
    baseVoice: "nova",
    settings: {
      pitch: 1,
      rate: 1,
      style: "natural",
      description,
    },
  };
};