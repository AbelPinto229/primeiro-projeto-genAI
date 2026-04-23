import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Função base para simples prompts
async function callGemini(userPrompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: userPrompt }] }]
  });
  return response.candidates[0].content.parts[0].text;
}

// exercício 1
async function traduzirComContexto(texto, idiomaDestino) {
  const prompt = `Age como um tradutor profissional. Traduz o seguinte texto para ${idiomaDestino}: ${texto}`;
  return await callGemini(prompt);
}

(async () => {
  const result = await traduzirComContexto(
    "O meu código tem um bug que não consigo encontrar",
    "Alemão"
  );
  console.log(result);
})();
