
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export async function generateTeamNames(count: number, theme: string = "general"): Promise<string[]> {
  const ai = getAIClient();
  if (!ai) {
    console.warn("Gemini API Key missing. Returning default team names.");
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate ${count} creative and professional team names for a corporate event. Theme: ${theme}. Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const responseText = response.text;
    const names = JSON.parse(typeof responseText === 'string' ? responseText.trim() : String(responseText));
    return names;
  } catch (error) {
    console.error("Error generating team names:", error);
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
}
