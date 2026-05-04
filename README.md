# ClickBot Backend - Primeiro Projeto GenAI

Este projeto implementa um backend Express para o "ClickBot", um assistente inteligente para a plataforma de produtividade ClickUp. O objetivo é oferecer funcionalidades avançadas de linguagem natural, streaming de respostas, validação estruturada com Zod e persistência em SQLite.

## O que foi adicionado

### 1. Chat de Suporte com Memória Persistente
- Criado o endpoint `GET /chat` que retorna `text/event-stream`.
- A rota consome o stream de resposta do Gemini usando `generateContentStream`.
- Cada chunk é escrito no SSE e também logado no console.
- Ao terminar o stream, o sistema salva `user_message` e `ai_response` na tabela `chat_history`.

### 2. Smart Task Parser (NLP para JSON)
- Adicionada a funcionalidade de parser de texto para tarefa estruturada.
- Implementado em `taskParser.js` com `zod` e `zod-to-json-schema`.
- Valida e gera um JSON com os campos:
  - `title`
  - `due_date` (ISO)
  - `priority` (`urgent` | `high` | `normal` | `low`)
  - `department` (`design` | `dev` | `marketing`)
- Endpoint exposto em `POST /task-parser`.

### 3. Transcritor de Reuniões em Tempo Real
- Criado `meetingSummary.js` para gerar sumários de reunião via stream.
- Endpoint `POST /meeting-summary` retorna chunks SSE e exibe uma mensagem de status inicial.
- O resultado final é persistido na tabela `meeting_summaries`.

### 4. Triage Automática de Bugs
- Adicionada função `triageBugReport` em `bugTriage.js`.
- O modelo classifica o erro e gera JSON com:
  - `error_type` (`UI` | `API` | `Database`)
  - `severity` (1 a 10)
  - `fix_suggestion`
- Ao detectar severidade crítica, o sistema grava automaticamente na tabela `tickets`.
- Endpoint exposto em `POST /bug-triage`.

### 5. Smart Planner Semanal
- Implementado `weeklyPlanner.js` para gerar planejamento semanal em streaming.
- Endpoint `POST /plan-weekly` retorna texto incremental durante a geração.

### 6. Sentiment Dashboard para Gestores
- Criado `sentimentDashboard.js` para analisar comentários de equipe e gerar JSON com:
  - `team_mood` (`happy` | `stressed` | `neutral`)
  - `main_blocker`
  - `burnout_risk`
- Endpoint exposto em `POST /sentiment-dashboard`.

## Banco de dados
- Criada persistência SQLite em `db.js`.
- Tabelas suportadas:
  - `chat_history`
  - `meeting_summaries`
  - `tickets`

## Dependências
- `express`
- `sqlite3`
- `zod`
- `zod-to-json-schema`
- `dotenv`
- `@google/genai`

## Estrutura do Projeto
```
primeiro projeto genAI/
├── src/                    # Código fonte principal
│   ├── api.js             # Servidor Express principal
│   ├── db.js              # Configuração e funções do SQLite
│   ├── geminiClient.js    # Cliente Gemini com streaming
│   ├── taskParser.js      # Parser de tarefas com Zod
│   ├── bugTriage.js       # Triage automática de bugs
│   ├── meetingSummary.js  # Sumário de reuniões
│   ├── weeklyPlanner.js   # Planner semanal
│   └── sentimentDashboard.js # Dashboard de sentimento
├── routes/                # Rotas adicionais
│   └── apiChat.js         # Rotas de chat (se usadas)
├── utils/                 # Utilitários e funções auxiliares
│   ├── geminiRequest.js
│   ├── systemPrompt.js
│   ├── create.js
│   ├── refine.js
│   ├── summarize.js
│   ├── suggestTag.js
│   ├── classifyPriority.js
│   ├── generateNames.js
│   ├── planSprint.js
│   ├── summarizeHistory.js
│   ├── generateTaskBreakdown.js
│   └── chatHistory.js
├── exercicio1.js          # Exemplos/exercícios
├── exercicio2.js
├── package.json
├── README.md
└── clickbot.db*           # Arquivos do SQLite (db, -wal, -shm)
```

## Endpoints principais
- `GET /chat?message=...` - conversa de suporte em streaming SSE.
- `POST /task-parser` - converte texto livre em tarefa estruturada.
- `POST /meeting-summary` - gera sumário de reunião em streaming e persiste.
- `POST /bug-triage` - classifica automaticamente relatórios de bugs.
- `POST /plan-weekly` - gera plano semanal em streaming.
- `POST /sentiment-dashboard` - analisa comentários e devolve JSON de humor da equipa.

## Observações
- O servidor foi iniciado com sucesso em `http://localhost:3000`.
- Foi necessário reconstruir o binário do `sqlite3` para o Node.js em uso.
