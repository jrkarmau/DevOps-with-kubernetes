const express = require('express')
const { Pool } = require('pg');
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
const { createLogger, transports, format } = require('winston');
const LokiTransport = require('winston-loki');

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'postgres-svc',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

const logger = createLogger({
  format: format.json(),
  transports: [
      new LokiTransport({
          host: 'http://loki.loki-stack:3100',
          labels: { app: 'todo-backend' },
      }),
  ],
});

app.get('/gettodos', async (request, response) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    const todos = result.rows.map(todo => ({
      id: todo.id,
      text: todo.todo_text
    }));
    response.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    response.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.get('/', (request, response) => {
  response.send('Service is running');
});

app.post('/todos', async (request, response) => {
  const { text } = request.body;
  if (text.length > 140) {
    logger.error('Todo text too long', { text: text });
    response.status(400).json({ error: 'Todo text too long' });
    return;
  }
  try {
    const result = await pool.query(
        'INSERT INTO todos (todo_text) VALUES ($1) RETURNING *', [text]
    );
    const newTodo = result.rows[0];
    console.log(`Todo added!: ${newTodo.todo_text}`);
    response.status(201).json(newTodo);
  } catch (error) {
    console.error('Error adding todo:', error);
    response.status(500).json({ error: 'Failed to add todo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})

app.use((req, res, next) => {
  logger.info('Received request', { method: req.method, url: req.url, body: req.body });
  next();
});
