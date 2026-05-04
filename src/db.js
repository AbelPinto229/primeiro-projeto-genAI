import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const databasePath = join(__dirname, 'clickbot.db');
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(databasePath, (err) => {
  if (err) {
    console.error('Erro ao abrir a base de dados:', err);
  }
});

db.serialize(() => {
  db.run('PRAGMA journal_mode = WAL');
  db.run(
    `CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_message TEXT NOT NULL,
      ai_response TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS meeting_summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL,
      original_text TEXT NOT NULL,
      summary TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      error_text TEXT NOT NULL,
      error_type TEXT NOT NULL,
      severity INTEGER NOT NULL,
      fix_suggestion TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`
  );
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function getRecentChatHistory(limit = 5) {
  const rows = await all(
    `SELECT user_message, ai_response FROM chat_history ORDER BY id DESC LIMIT ?`,
    [limit]
  );
  return rows.reverse();
}

async function saveChatHistory(userMessage, aiResponse) {
  const createdAt = new Date().toISOString();
  return run(
    `INSERT INTO chat_history (user_message, ai_response, created_at) VALUES (?, ?, ?)`,
    [userMessage, aiResponse, createdAt]
  );
}

async function saveMeetingSummary(projectId, originalText, summary) {
  const createdAt = new Date().toISOString();
  return run(
    `INSERT INTO meeting_summaries (project_id, original_text, summary, created_at) VALUES (?, ?, ?, ?)`,
    [projectId, originalText, summary, createdAt]
  );
}

async function saveTicket(errorText, errorType, severity, fixSuggestion) {
  const createdAt = new Date().toISOString();
  return run(
    `INSERT INTO tickets (error_text, error_type, severity, fix_suggestion, created_at) VALUES (?, ?, ?, ?, ?)`,
    [errorText, errorType, severity, fixSuggestion, createdAt]
  );
}

export { db, getRecentChatHistory, saveChatHistory, saveMeetingSummary, saveTicket };
