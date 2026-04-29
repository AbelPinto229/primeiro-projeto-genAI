import express from "express";
import { sendMessage } from "./chatHistory.js";
import { generateNames } from "./generateNames.js";
import { planSprint } from "./planSprint.js";
import { summarizeHistory } from "./summarizeHistory.js";
import { classifyPriority } from "./classifyPriority.js";
import { generateTaskBreakdown } from "./generateTaskBreakdown.js";

const router = express.Router();

// Endpoint para chat
router.post("/clickbot/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Mensagem não fornecida." });
    }
    const resposta = await sendMessage(message);
    res.json({ resposta });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// Endpoint: Gerar nomes criativos
router.post("/clickbot/generate-names", async (req, res) => {
  const { temp } = req.body;
  try {
    const nomes = await generateNames(temp || 1.0);
    res.json({ nomes });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// Endpoint: Planejar sprint
router.post("/clickbot/plan-sprint", async (req, res) => {
  try {
    const plano = await planSprint();
    res.json({ plano });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// Endpoint: Resumir histórico do chat
router.post("/clickbot/summarize-history", async (req, res) => {
  const { history } = req.body;
  if (!history) return res.status(400).json({ error: 'Campo "history" é obrigatório.' });
  try {
    const resumo = await summarizeHistory(history);
    res.json({ resumo });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// Endpoint: Classificar prioridade
router.post("/clickbot/classify-priority", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Campo "text" é obrigatório.' });
  try {
    const prioridade = await classifyPriority(text);
    res.json({ prioridade });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// Endpoint: Gerar breakdown de tarefas
router.post("/clickbot/breakdown", async (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: 'Campo "task" é obrigatório.' });
  try {
    const breakdown = await generateTaskBreakdown(task);
    res.json({ breakdown });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

export default router;
