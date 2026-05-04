import { extractIncrementalText, streamText } from './geminiClient.js';
import { saveMeetingSummary } from './db.js';

async function summarizeMeeting(projectId, originalText, onChunk) {
  const prompt = `Você é um assistente que transforma uma transcrição de reunião num sumário executivo conciso. Analisa o texto abaixo e destaca pontos chave, decisões e próximos passos. Texto da reunião: ${originalText}`;
  const stream = await streamText(prompt);
  let summary = '';

  let previousText = '';
  for await (const chunk of stream) {
    const chunkText = extractIncrementalText(chunk, previousText);
    if (!chunkText) continue;
    previousText += chunkText;
    summary += chunkText;
    onChunk(chunkText);
  }

  await saveMeetingSummary(projectId, originalText, summary);
  return summary;
}

export { summarizeMeeting };
