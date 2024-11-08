const express = require('express')
const axios = require('axios');
const app = express()
const PORT = process.env.PORT || 3000
const fs = require('fs')
const path = require('path')
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'pic.txt')

const getTodos = async () => {
  try {
    const response = await axios.get('http://todo-backend-svc:2348/gettodos');
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    return {};
  }
}

const updatePicture = async () => {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(directory, { recursive: true })
  }
  try {
    response = await axios.get('https://picsum.photos/200');
    fs.createWriteStream(filePath).write(Date.now() + ";" + response.request.res.responseUrl.toString())
  } catch (error) {
    console.error('Error saving picture:', error);
  }
}

const getPic = async () => {
  if (!fs.existsSync(filePath)) {
    await updatePicture()
  }
  const data = await fs.readFileSync(filePath).toString().split(';')
  if (data[0] < Date.now() - 3600000) {
    await updatePicture()
  }
  return fs.readFileSync(filePath).toString().split(';')[1]
};

app.get('/', (request, response) => {
  response.send('Service is running');
});

app.get('/project', async (request, response) => {
  const pictureUrl = await getPic();
  const todos = await getTodos();
  response.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Project Start Page</title>
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    </head>
    <body>
      <h1>Project start page!!!</h1>
      <img src="${pictureUrl}" alt="Random Picture"/>
      <h1>Todo List</h1>
      <form id="todoForm">
        <input type="text" id="todoInput" maxlength="140" placeholder="Enter your todo" />
        <button type="submit" id="sendButton">Send</button>
      </form>
        <ul id="todoList">
        ${todos.map(todo => `<li>${todo.text}</li>`).join('')}
        </ul>
      <script>
        document.getElementById('todoForm').addEventListener('submit', async (event) => {
          event.preventDefault();
          const todoInput = document.getElementById('todoInput');
          const text = todoInput.value;
          if (text) {
            try {
              const postResponse = await axios.post('/todos', { text });
              if (postResponse.status === 201) {
                todoInput.value = '';
                const response = await axios.get('/gettodos');
                const todos = response.data;
                const todoList = document.getElementById('todoList');
                todoList.innerHTML = todos.map(todo => '<li>' + todo.text + '</li>').join('');
              } else {
                console.error('Error adding todo:', postResponse.statusText);
              }
            } catch (error) {
              console.error('Error adding todo:', error);
            }
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
