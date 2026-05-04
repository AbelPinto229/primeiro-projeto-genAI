import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import { createSystemPrompt } from '../utils/systemPrompt.js';
import { getRecentChatHistory } from './db.js';

const MODEL = 'gemini-3-flash-preview';
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

function extractText(response) {
  if (!response) return '';
  if (typeof response.text === 'string' && response.text.trim().length > 0) {
    return response.text;
  }
  const candidate = response.candidates?.[0];
  if (!candidate) return '';
  return candidate.content?.parts?.map((part) => part.text || '').join('') || '';
}

function extractIncrementalText(response, previousText = '') {
  const full = extractText(response);
  if (!full) return '';
  if (previousText && full.startsWith(previousText)) {
    return full.slice(previousText.length);
  }
  return full;
}

async function supportChatStream(userMessage) {
  const previousHistory = await getRecentChatHistory(5);
  const contents = previousHistory.flatMap((row) => [
    { role: 'user', parts: [{ text: row.user_message }] },
    { role: 'assistant', parts: [{ text: row.ai_response }] }
  ]);
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const stream = await ai.models.generateContentStream({
    model: MODEL,
    contents,
    config: {
      temperature: 0.3,
      maxOutputTokens: 800
    }
  });
  return stream;
}

async function streamText(prompt) {
  const contents = [{ role: 'user', parts: [{ text: createSystemPrompt() + '\n' + prompt }] }];
  return ai.models.generateContentStream({
    model: MODEL,
    contents,
    config: {
      temperature: 0.2,
      maxOutputTokens: 900
    }
  });
}

async function generateJson(prompt, responseJsonSchema, config = {}) {
  const contents = [{ role: 'user', parts: [{ text: createSystemPrompt() + '\n' + prompt }] }];
  return ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema,
      temperature: 0,
      maxOutputTokens: 400,
      ...config
    }
  });
}

export { ai, MODEL, extractText, extractIncrementalText, supportChatStream, streamText, generateJson };
