
import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';

import { createTaskFromText } from './create.js';
import { RefineTask } from './refine.js';
import { summarize } from './summarize.js';
import { suggestTags } from './suggestTag.js';
// imports removidos porque endpoints estão agora em apiChat.js
// endpoints removidos porque estão agora em apiChat.js

const app = express();
app.use(bodyParser.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
