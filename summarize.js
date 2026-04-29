


import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { geminiRequest } from './geminiRequest.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Função para resumir descrições longas de tarefas
async function summarize(description) {
  const prompt = `Resume a seguinte descrição de tarefa numa frase simples e objetiva para leitura rápida. Descrição: ${description}`;
  return await geminiRequest(ai, prompt);
}

(async () => {
  const longDescription = "Utilizadores estão impossibilitados de fazer login devido a erro no sistema de autenticação. Deve ser investigado com urgência, pois afeta vários departamentos.";
  try {
    const resumo = await summarize(longDescription);
    console.log(resumo);
  } catch (error) {
    console.error("Erro ao resumir descrição:", error.message || error);
  }
})();

export { summarize };
