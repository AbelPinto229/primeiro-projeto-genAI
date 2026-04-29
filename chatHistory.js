import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { geminiRequest } from "./geminiRequest.js";

// array para guardar o histórico da conversa
const history = [];

// aparecer apenas os 5 últimas mensagens no histórico

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


async function sendMessage(text) {
  history.push({ role: "user", parts: [{ text }] });

  // Junta apenas as 5 últimas mensagens do histórico num único prompt
  const prompt = history.slice(-5).map(m => m.parts[0].text).join("\n");
  const reply = await geminiRequest(ai, prompt);
  history.push({ role: "model", parts: [{ text: reply }] });
  return reply;
}
export { sendMessage, history };

  (async () => {
    await sendMessage("O meu nome é Ana");
    await sendMessage("Trabalho em marketing");
    const resposta = await sendMessage("Como me chamo?");
    console.log("Resposta:", resposta);
  })();

export { sendMessage, history };