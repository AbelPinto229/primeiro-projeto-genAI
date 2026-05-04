import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { generateJson } from './geminiClient.js';

const sentimentSchema = z.object({
  team_mood: z.enum(['happy', 'stressed', 'neutral']),
  main_blocker: z.string().min(1),
  burnout_risk: z.boolean()
});

const sentimentJsonSchema = zodToJsonSchema(sentimentSchema, { target: 'jsonSchema' });

const defaultComments = [
  'A equipa está a fazer progresso, mas há muitas reuniões que interrompem o fluxo.',
  'Falta comunicação entre design e desenvolvimento em algumas tarefas.',
  'Os prazos estão justos e alguns colegas estão a trabalhar até mais tarde.',
  'Gostei do apoio do gestor, mas preciso de menos tarefas urgentes no mesmo dia.',
  'A equipa está motivada com o projeto, mas existe ansiedade sobre a entrega final.'
];

async function analyzeTeamMood(comments = defaultComments) {
  const prompt = `Analisa estes comentários de tarefas e devolve apenas JSON válido com os campos team_mood, main_blocker e burnout_risk. Os valores válidos para team_mood são happy, stressed ou neutral. Comentários:\n${comments.join('\n')}`;
  const response = await generateJson(prompt, sentimentJsonSchema);
  const raw = response.text?.trim();
  if (!raw) {
    throw new Error('Resposta inválida do modelo para o dashboard de sentimento.');
  }

  const parsed = JSON.parse(raw);
  return sentimentSchema.parse(parsed);
}

export { analyzeTeamMood, defaultComments };
