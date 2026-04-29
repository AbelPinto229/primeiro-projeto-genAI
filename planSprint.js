import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { geminiRequest } from './geminiRequest.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Função para planejar uma sprint de 5 dias para lançar uma landing page
async function planSprint() {
  const prompt = `Numa ordem lógica e comprioridades, usando os tokens de forma eficiente. Organiza passo a passo uma sprint de 5 dias para lançar uma landing page.`;
  return await geminiRequest(ai, prompt);
}

  (async () => {
    const resposta = await planSprint();
    console.log("Plano de Sprint:", resposta);
  })();

export { planSprint };

