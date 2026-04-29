import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { geminiRequest } from './geminiRequest.js';
import { history } from './chatHistory.js';

function summarizeHistory(history) {
  const prompt = `Resuma a seguinte conversa, destacando os pontos principais. 
                A conversa é a seguinte: ${history.map(m => `${m.role}: ${m.parts.map(p => p.text).join(' ')}`).join('\n')}`;
  return geminiRequest(new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }), prompt);
}

(async () => {
  const resumo = await summarizeHistory(history);
  console.log("Resumo do histórico:", resumo);
})();

export { summarizeHistory };
