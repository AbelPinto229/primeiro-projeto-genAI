import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// transformar texto livre em uma tarefa estruturada
async function RefineTask(task) {
  const prompt = `Melhora tarefas já existentes, tornando-as mais claras, completas e profissionais. Tarefa: ${task}`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  });
  return response.candidates[0].content.parts[0].text;
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
