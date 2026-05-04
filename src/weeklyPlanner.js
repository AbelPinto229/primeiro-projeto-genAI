import { extractIncrementalText, streamText } from './geminiClient.js';

async function planWeekly(input, onChunk) {
  const prompt = `O utilizador descreveu sua semana. Organiza as tarefas em um plano semanal. Enquanto escreves, apresenta o teu raciocínio em texto e, no final, devolve um bloco JSON com o cronograma. Texto: ${input}`;
  const stream = await streamText(prompt);
  let fullResponse = '';
  let previousText = '';

  for await (const chunk of stream) {
    const chunkText = extractIncrementalText(chunk, previousText);
    if (!chunkText) continue;
    previousText += chunkText;
    fullResponse += chunkText;
    onChunk(chunkText);
  }

  return fullResponse;
}

export { planWeekly };
