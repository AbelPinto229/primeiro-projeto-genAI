
import express from 'express';
import 'dotenv/config';

import { createTaskFromText } from '../utils/create.js';
import { RefineTask } from '../utils/refine.js';
import { summarize } from '../utils/summarize.js';
import { suggestTags } from '../utils/suggestTag.js';
import { saveChatHistory } from './db.js';
import { supportChatStream, extractText, extractIncrementalText } from './geminiClient.js';
import { parseTaskFromText } from './taskParser.js';
import { summarizeMeeting } from './meetingSummary.js';
import { triageBugReport } from './bugTriage.js';
import { planWeekly } from './weeklyPlanner.js';
import { analyzeTeamMood } from './sentimentDashboard.js';

const app = express();
app.use(express.json());

// Endpoint: Criar tarefa
app.post('/api/tasks/create', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Campo "text" é obrigatório.' });
  try {
    const result = await createTaskFromText(text);
    res.json({ task: result });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// Endpoint: Refinar tarefa
app.post('/api/tasks/refine', async (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: 'Campo "task" é obrigatório.' });
  try {
    const result = await RefineTask(task);
    res.json({ refinedTask: result });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// Endpoint: Resumir descrição
app.post('/api/tasks/summarize', async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Campo "description" é obrigatório.' });
  try {
    const result = await summarize(description);
    res.json({ summary: result });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// Endpoint: Sugerir tags
app.post('/api/tasks/suggest-tags', async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Campo "description" é obrigatório.' });
  try {
    const tags = await suggestTags(description);
    res.json({ tags });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// Streaming support chat com memória persistente
app.get('/chat', async (req, res) => {
  const message = String(req.query.message || '').trim();
  if (!message) {
    return res.status(400).json({ error: 'Campo "message" é obrigatório na query string.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const stream = await supportChatStream(message);
    let aiResponse = '';
    let previousText = '';

    for await (const chunk of stream) {
      const textChunk = extractIncrementalText(chunk, previousText);
      if (!textChunk) continue;
      previousText += textChunk;
      console.log('Gemini stream chunk:', textChunk);
      aiResponse += textChunk;
      res.write(`data: ${JSON.stringify(textChunk)}\n\n`);
    }

    await saveChatHistory(message, aiResponse);
    res.write('event: done\ndata: [DONE]\n\n');
  } catch (error) {
    console.error('Erro no streaming de chat:', error);
    res.write(`event: error\ndata: ${JSON.stringify(error.message || 'Erro interno')}\n\n`);
  } finally {
    res.end();
  }
});

// Smart Task Parser
app.post('/task-parser', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Campo "text" é obrigatório.' });
  try {
    const task = await parseTaskFromText(text);
    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// Transcritor de reunião em tempo real
app.post('/meeting-summary', async (req, res) => {
  const { project_id, transcript } = req.body;
  if (!project_id || !transcript) {
    return res.status(400).json({ error: 'Campos "project_id" e "transcript" são obrigatórios.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  res.write('event: status\ndata: A processar pontos chave...\n\n');

  try {
    await summarizeMeeting(project_id, transcript, (chunk) => {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    });
    res.write('event: done\ndata: [DONE]\n\n');
  } catch (error) {
    console.error('Erro no resumo de reunião:', error);
    res.write(`event: error\ndata: ${JSON.stringify(error.message || 'Erro interno')}\n\n`);
  } finally {
    res.end();
  }
});

// Triage automática de bugs
app.post('/bug-triage', async (req, res) => {
  const { error_text } = req.body;
  if (!error_text) return res.status(400).json({ error: 'Campo "error_text" é obrigatório.' });
  try {
    const result = await triageBugReport(error_text);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// Smart planner semanal
app.post('/plan-weekly', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Campo "text" é obrigatório.' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    await planWeekly(text, (chunk) => {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    });
    res.write('event: done\ndata: [DONE]\n\n');
  } catch (error) {
    console.error('Erro no planner semanal:', error);
    res.write(`event: error\ndata: ${JSON.stringify(error.message || 'Erro interno')}\n\n`);
  } finally {
    res.end();
  }
});

// Sentiment dashboard para gestores
app.post('/sentiment-dashboard', async (req, res) => {
  try {
    const sentiment = await analyzeTeamMood(req.body.comments);
    res.json(sentiment);
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
