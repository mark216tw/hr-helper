
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateTeamNames(count: number, theme: string = "general"): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} creative and professional team names for a corporate event. Theme: ${theme}. Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const names = JSON.parse(response.text.trim());
    return names;
  } catch (error) {
    console.error("Error generating team names:", error);
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
}
