import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { generateJson } from './geminiClient.js';
import { saveTicket } from './db.js';

const bugSchema = z.object({
  error_type: z.enum(['UI', 'API', 'Database']),
  severity: z.number().int().min(1).max(10),
  fix_suggestion: z.string().min(1)
});

const bugJsonSchema = zodToJsonSchema(bugSchema, { target: 'jsonSchema' });

async function triageBugReport(errorText) {
  const prompt = `Analisa este reporte de erro e devolve apenas JSON válido com os campos error_type, severity e fix_suggestion. Usa valores de error_type: UI, API ou Database. Texto do erro: ${errorText}`;
  const response = await generateJson(prompt, bugJsonSchema);

  const raw = response.text?.trim();
  if (!raw) {
    throw new Error('Resposta inválida ao classificar o bug.');
  }

  const parsed = JSON.parse(raw);
  const result = bugSchema.parse(parsed);

  const critical = result.severity >= 8;
  if (critical) {
    await saveTicket(errorText, result.error_type, result.severity, result.fix_suggestion);
  }

  return {
    ...result,
    critical,
    saved: critical
  };
}

export { triageBugReport };
