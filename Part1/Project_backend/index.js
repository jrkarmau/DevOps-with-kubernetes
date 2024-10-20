const express = require('express')
const { Pool } = require('pg');
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'postgres-stset-0.postgres-svc',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
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


app.post('/todos', async (request, response) => {
  const { text } = request.body;
  try {
    const result = await pool.query(
        'INSERT INTO todos (todo_text) VALUES ($1) RETURNING *', [text]
    );
    const newTodo = result.rows[0];
    console.log(`Todo added: ${newTodo.todo_text}`);
    response.status(201).json(newTodo);
  } catch (error) {
    console.error('Error adding todo:', error);
    response.status(500).json({ error: 'Failed to add todo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
