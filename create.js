import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// transformar texto livre em uma tarefa estruturada
async function createTaskFromText(text) {
  const prompt = `Transforma o seguinte texto numa tarefa estruturada em JSON, com os campos: title, description, priority e tags. Devolve apenas o JSON. Texto: ${text}`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  });
  return response.candidates[0].content.parts[0].text;
}

(async () => {
  const input = "Preciso de corrigir o bug do login que está a falhar para vários utilizadores e é urgente";
  try {
    const result = await createTaskFromText(input);
    console.log(result);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error.message || error);
  }
})();
