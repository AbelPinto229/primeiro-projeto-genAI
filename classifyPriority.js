
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { geminiRequest } from './geminiRequest.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Função para classificar prioridade usando few-shot
(async () => {
  const text = "site caiu";  
  const prompt = `Com base nestes exemplos:
        "site caiu" -> Alta
        "mudar botão" -> Média
        "trocar favicon" -> Baixa
Classifica a prioridade da tarefa como Alta, Média ou Baixa.  Tarefa: ${text} Prioridade:`;
  return await geminiRequest(ai, prompt);
})();

export { classifyPriority };