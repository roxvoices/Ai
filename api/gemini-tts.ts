import type { VercelRequest, VercelResponse } from "vercel";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, voice, settings } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    // ⚠️ TEMP MOCK RESPONSE (so UI WORKS 100%)
    // Replace later with real Gemini / ElevenLabs logic

    const sampleRate = 24000;
    const channels = 1;

    // Generate silent WAV buffer (valid audio)
    const durationSeconds = Math.min(10, text.length / 15);
    const frameCount = sampleRate * durationSeconds;
    const buffer = new Int16Array(frameCount);

    const audioBase64 = Buffer.from(buffer.buffer).toString("base64");

    return res.status(200).json({
      audioBase64,
      sampleRate,
      channels,
    });
  } catch (err) {
    console.error("TTS ERROR:", err);
    return res.status(500).json({ error: "TTS generation failed" });
  }
      }
