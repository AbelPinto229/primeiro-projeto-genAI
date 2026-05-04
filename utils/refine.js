

import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { geminiRequest } from './geminiRequest.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// transformar texto livre em uma tarefa estruturada
async function RefineTask(task) {
  const prompt = `Melhora tarefas já existentes, tornando-as mais claras, completas e profissionais. Tarefa: ${task}`;
  return await geminiRequest(ai, prompt);
}

(async () => {
  const input = {
  "title": "Bug no login",
  "description": "login não funciona",
  "priority": "high",
  "tags": ["bug"]
};
  try {
    const result = await RefineTask(input);
    console.log(result);
  } catch (error) {
    console.error("Erro ao melhorar tarefa:", error.message || error);
  }
})();

export { RefineTask };