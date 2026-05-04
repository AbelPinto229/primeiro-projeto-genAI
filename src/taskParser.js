import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { generateJson } from './geminiClient.js';

const taskSchema = z.object({
  title: z.string().min(1),
  due_date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'A data deve estar em formato ISO.'
  }),
  priority: z.enum(['urgent', 'high', 'normal', 'low']),
  department: z.enum(['design', 'dev', 'marketing'])
});

const taskJsonSchema = zodToJsonSchema(taskSchema, { target: 'jsonSchema' });

async function parseTaskFromText(text) {
  const prompt = `Transforma a seguinte mensagem numa tarefa estruturada para ClickUp. Devolve apenas JSON válido com os campos title, due_date, priority e department. Texto: ${text}`;
  const response = await generateJson(prompt, taskJsonSchema);
  const raw = response.text?.trim();
  if (!raw) {
    throw new Error('Resposta inválida do modelo ao gerar tarefa estruturada.');
  }

  const parsed = JSON.parse(raw);
  return taskSchema.parse(parsed);
}

export { parseTaskFromText, taskSchema };
