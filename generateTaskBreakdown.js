import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { geminiRequest } from "./geminiRequest.js";

function generateTaskBreakdown(task) {
  const prompt = `Dado a seguinte tarefa: "${task}", quebre-a em subtarefas. 
  Definição de regras para splitting de tarefas:
  1. Estrutura JSON para subtarefas
  2. Regras para não over-split
  3. Casos edge (tarefas curtas / vagas)`;
  return geminiRequest(new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }), prompt);
}

(async () => {
  const task = "Criar sistema completo de login com OAuth, recuperação de password e 2FA"
  const breakdown = await generateTaskBreakdown(task);
  console.log("Subtarefas geradas:", breakdown);
}
)();

export { generateTaskBreakdown };
