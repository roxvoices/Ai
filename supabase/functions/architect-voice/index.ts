
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
import { GoogleGenAI, Type } from '@google/genai';

// Initialize GoogleGenAI
const API_KEY = Deno.env.get('API_KEY');
if (!API_KEY) {
  console.error("API_KEY environment variable is not set.");
  throw new Error("GoogleGenAI API_KEY environment variable not configured.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { description } = await req.json();

    if (!description) {
      return new Response(JSON.stringify({ error: 'Description is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the following description, suggest a base voice ('Zephyr', 'Kore', 'Puck', 'Charon', 'Fenrir'), a pitch (number between 0.5 and 1.5, default 1.0), a speed (number between 0.5 and 2.0, default 1.0), and an expression ('Natural', 'Professional', 'Cheerful', 'Somber', 'Whispering', 'Authoritative', 'Excited'). Provide the output as a JSON object.`,
      config: {
        systemInstruction: "You are the Rox Voices AI Architect. Interpret the user's personality/mood description and map it to our engine's base voices (Zephyr, Kore, Puck, Charon, Fenrir) and settings (pitch 0.5-1.5, speed 0.5-2.0, expressions: Natural, Cheerful, Somber, Whispering, Authoritative, Excited, Professional). Return only a JSON object.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            baseVoice: {
              type: Type.STRING,
              enum: ['Zephyr', 'Kore', 'Puck', 'Charon', 'Fenrir'],
            },
            settings: {
              type: Type.OBJECT,
              properties: {
                pitch: { type: Type.NUMBER },
                speed: { type: Type.NUMBER },
                expression: { type: Type.STRING, enum: ['Natural', 'Professional', 'Cheerful', 'Somber', 'Whispering', 'Authoritative', 'Excited'] },
              },
              required: ["pitch", "speed", "expression"]
            }
          },
          required: ["baseVoice", "settings"],
        },
      },
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("No valid JSON response from AI.");
    }

    const parsedResponse = JSON.parse(jsonStr);
    return new Response(JSON.stringify(parsedResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Architect voice API error in Edge Function:", error.message || error);
    return new Response(JSON.stringify({ error: 'Failed to architect voice profile', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});