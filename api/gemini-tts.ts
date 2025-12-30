import { GoogleGenAI, Modality } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, voice, settings } = req.body;

  if (!text || !voice) {
    return res.status(400).json({ error: "Missing required data" });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY!, // 🔒 SAFE (Vercel env var)
    });

    const styleDescriptor = settings?.customDescription
      ? `Profile: ${settings.customDescription}.`
      : `Emotional Expression: ${settings?.expression || "Natural"}.`;

    const instruction = `
SYSTEM: You are a world-class voice actor.
Deliver hyper-realistic audio with natural breathing, realistic pauses,
and emotionally perfect inflection.

${styleDescriptor}
Pitch: ${settings?.pitch ?? 1.0}
Speed: ${settings?.speed ?? 1.0}

TEXT TO SPEAK:
"${text}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: instruction }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: "No audio returned from Gemini" });
    }

    // Send base64 audio to frontend
    res.status(200).json({
      audioBase64: base64Audio,
      sampleRate: 24000,
      channels: 1,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Gemini TTS failed" });
  }
}