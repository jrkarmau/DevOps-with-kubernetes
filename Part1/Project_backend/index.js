const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

let todos = [
  { id: 1, text: 'Todo 1' },
  { id: 2, text: 'Todo 2' },
  { id: 3, text: 'Todo 3' },
]
let todonumber = todos.length

app.get('/gettodos', async (request, response) => {
  try {
    response.json(todos)
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch todos' })
  }
})

app.post('/todos', async (request, response) => {
  try {
    const newTodo = {
      id: todonumber + 1,
      text: request.body.text,
    };
    todos.push(newTodo);
    todonumber++;
    console.log(`Todo added: ${newTodo.text}`);
    response.status(201).json(newTodo);
  } catch (error) {
    console.error('Error adding todo:', error);
    response.status(500).json({ error: 'Failed to add todo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
