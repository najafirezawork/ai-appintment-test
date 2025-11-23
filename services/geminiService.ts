import { GoogleGenAI, Type } from "@google/genai";
import { PROVIDERS, SERVICES } from "../constants";

export const getSmartRecommendation = async (userQuery: string) => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    User Query (likely in Persian): "${userQuery}"
    
    Available Services: ${JSON.stringify(SERVICES.map(s => ({ id: s.id, name: s.name, description: s.description })))}
    Available Providers: ${JSON.stringify(PROVIDERS.map(p => ({ id: p.id, name: p.name, specialty: p.specialty, serviceIds: p.services })))}

    Based on the user query, recommend the most suitable Service ID and Provider ID.
    If the query is vague, pick the best fit General Practitioner.
    
    IMPORTANT: Provide the 'reasoning' field in Persian language (Farsi).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            serviceId: { type: Type.STRING },
            providerId: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Recommendation failed:", error);
    return null;
  }
};