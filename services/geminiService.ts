import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const askRuleAssistant = async (question: string, context?: string): Promise<string> => {
  if (!apiKey) {
    return "API Key ontbreekt. Configureer de API key om de assistent te gebruiken.";
  }

  try {
    const systemInstruction = `
      Je bent een expert in het kaartspel 'Wiezen' (Belgische variant). Je bent een scheidsrechter en strategie-adviseur.
      Je antwoorden zijn kort, bondig en in het Nederlands.
      
      OFFICIËLE REGELS CONTEXT:
      - 4 spelers, 13 kaarten elk.
      - Volgorde: Aas, Heer, Vrouw, Boer, 10, ..., 2.
      - Puntenverdeling (per persoon, winnaar krijgt dit van verliezer):
        * Alleen gaan (5 slagen): 2p + 1 per overslag.
        * Vragen en meegaan (8 slagen): 2p + 1 per overslag. (13 slagen = dubbel).
        * Troel (8 slagen): 4p + 2 per overslag. (13 slagen = 20p).
        * Abondance: 9 slagen=4p, 10=7p, 11=8p, 12=9p.
        * Miserie (0 slagen): 7p.
        * Open Miserie (0 slagen): 14p.
        * Piccolo (1 slag): 5p (standaard regel).
        * Solo (13 slagen, eigen troef): 25p.
        * Solo Slim (13 slagen, gedraaide troef): 30p.
      
      Als er gevraagd wordt naar scoreberekening, gebruik strikt bovenstaande tabel.
      Huidige spel context: ${context || 'Geen spel data beschikbaar.'}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    return response.text || "Ik kon geen antwoord genereren.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Er is een fout opgetreden bij het raadplegen van de AI scheidsrechter.";
  }
};