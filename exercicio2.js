import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Função base para simples prompts
async function callGemini(userPrompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: userPrompt }] }]
  });
  return response.candidates[0].content.parts[0].text;
}

// exercício 2
async function transformarListaEmJSON(lista) {
  const prompt = `Transforma esta lista de tarefas num objeto JSON estruturado com os campos 'tarefa' e 'horario'. Devolve APENAS o JSON. ${lista}`;
  return await callGemini(prompt);
}

(async () => {
  const result = await transformarListaEmJSON(
`Tenho que comprar Ovos 
- Ir ao ginásio às 18h
- Ligar para a mãe`
  );
  console.log(result);
})();
