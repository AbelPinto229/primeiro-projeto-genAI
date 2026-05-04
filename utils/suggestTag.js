

import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { geminiRequest } from './geminiRequest.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Função para sugerir tags relevantes para uma tarefa
async function suggestTags(description) {
  const prompt = `Sugira até 5 tags curtas e relevantes para organizar a seguinte tarefa: ${description}`;
  const tagsText = await geminiRequest(ai, prompt);
  return tagsText.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}

// Exemplo de uso das funções
(async () => {
  const taskDescription = "Utilizadores estão impossibilitados de fazer login devido a erro no sistema de autenticação. Deve ser investigado com urgência, pois afeta vários departamentos.";
  try {
    const tags = await suggestTags(taskDescription);
    console.log("Tags sugeridas:", tags);
  } catch (error) {
    console.error("Erro ao processar:", error.message || error);
  }
})();

export { suggestTags };