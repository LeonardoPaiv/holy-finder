import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyMessage = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Gere uma mensagem curta, inspiradora e espiritual para um feed de comunidade de igreja. A mensagem deve ter no máximo 2 frases e ser acolhedora.",
    });
    return response.text || "Paz e bem a todos.";
  } catch (error) {
    console.error("Error generating message:", error);
    return "Que o seu dia seja abençoado e cheio de luz.";
  }
};
