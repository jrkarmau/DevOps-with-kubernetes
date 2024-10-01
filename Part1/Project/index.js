const express = require('express')
const axios = require('axios');
const app = express()
const PORT = process.env.PORT || 3000
const fs = require('fs')
const path = require('path')
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'pic.txt')

const todos = [
  { id: 1, text: 'Todo 1' },
  { id: 2, text: 'Todo 2' },
  { id: 3, text: 'Todo 3' },
];

const updatePicture = async () => {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(directory, { recursive: true })
  }
  try {
    response = await axios.get('https://picsum.photos/200');
    fs.createWriteStream(filePath).write(Date.now() + ";" + response.request.res.responseUrl.toString())
    console.log('Picture updated:', response.request.res.responseUrl.toString())
  } catch (error) {
    console.error('Error saving picture:', error);
  }
}

const getPic = async () => {
  if (!fs.existsSync(filePath)) {
    await updatePicture()
  }
  const data = fs.readFileSync(filePath).toString().split(';')
  if (data[0] < Date.now() - 3600000) {
    await updatePicture()
  }
  return fs.readFileSync(filePath).toString().split(';')[1]
};

app.get('/project', async (request, response) => {
  const pictureUrl = await getPic()
  response.send(`
    <h1>Project start page</h1>
    <img src="${pictureUrl}" alt="Random Picture"/>
    <h1>Todo List</h1>
    <form>
      <input type="text" id="todoInput" maxlength="140" placeholder="Enter your todo" />
      <button type="button" id="sendButton">Send</button>
    </form>
    <ul id="todoList">
      ${todos.map(todo => `<li>${todo.text}</li>`).join('')}
    </ul>
    `);
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
