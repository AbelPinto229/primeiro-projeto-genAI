import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { geminiRequest } from './geminiRequest.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Função para gerar nomes criativos com temperatura customizada
async function generateNames(temp) {
  const prompt = `Gere 5 nomes criativos de tarefas. Separe por vírgula.`;
  return await geminiRequest(ai, prompt, undefined, { temperature: temp });
}

  (async () => {
    const temp = 1.2
    const nomes = await generateNames(temp);
    console.log(`Nomes gerados (temp=${temp}):`, nomes);
  })();

export { generateNames };