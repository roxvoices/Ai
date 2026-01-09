
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: "Invalid session" });

    const { description } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Architect a TTS voice profile based on this description: "${description}". 
      Select the most appropriate base voice from: Zephyr, Kore, Puck, Charon, Fenrir.
      Determine optimal pitch (0.5 to 1.5) and speed (0.5 to 2.0).
      Select an expression: Natural, Professional, Cheerful, Somber, Whispering, Authoritative, Excited.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            baseVoice: { type: Type.STRING, description: "One of: Zephyr, Kore, Puck, Charon, Fenrir" },
            settings: {
              type: Type.OBJECT,
              properties: {
                pitch: { type: Type.NUMBER },
                speed: { type: Type.NUMBER },
                expression: { type: Type.STRING },
              },
              required: ["pitch", "speed", "expression"]
            }
          },
          required: ["baseVoice", "settings"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Architect Backend Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
