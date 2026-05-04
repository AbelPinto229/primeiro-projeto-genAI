import { createSystemPrompt } from './systemprompt.js';

async function geminiRequest(ai, prompt, model = "gemini-3-flash-preview") {
  const contents = [
     { role: "user", parts: [{ text: createSystemPrompt() + "\n" + prompt }] }
  ];
  const response = await ai.models.generateContent({
    model,
    contents
  });
  return response.candidates[0].content.parts[0].text.trim();
}

export { geminiRequest };