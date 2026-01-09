
import { GoogleGenAI, Modality } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with Service Role Key for secure backend operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // 1. Authenticate User
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: "Invalid session" });

    // 2. Fetch Profile and Enforce Quota
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) return res.status(404).json({ error: "Profile not found" });

    const { text, voice, settings } = req.body;
    const textLength = text?.length || 0;

    // Plan Configurations (Mirroring constants.ts for backend enforcement)
    const PLAN_LIMITS: Record<string, number> = {
      free: 500,
      starter: 50000,
      vip: 200000,
      vvip: 1500000,
      exclusive: 5000000,
    };

    const userPlan = profile.plan || "free";
    const limit = PLAN_LIMITS[userPlan] || 500;

    if (profile.chars_used + textLength > limit) {
      return res.status(403).json({ error: "Quota exceeded for your plan" });
    }

    // 3. Call Gemini TTS using the correct SDK pattern
    const styleDescriptor = settings.customDescription 
      ? `Profile: ${settings.customDescription}.` 
      : `Emotional Expression: ${settings.expression.toLowerCase()}.`;

    const prompt = `Deliver this text with high emotional fidelity. 
    ${styleDescriptor} 
    Pitch adjustment: ${settings.pitch}. 
    Speaking rate: ${settings.speed}.
    Text: "${text}"`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Synthesis failed: No audio data returned");

    // 4. Update Usage
    await supabase
      .from("profiles")
      .update({ chars_used: profile.chars_used + textLength })
      .eq("id", user.id);

    return res.status(200).json({ base64Audio });
  } catch (error: any) {
    console.error("TTS Backend Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
