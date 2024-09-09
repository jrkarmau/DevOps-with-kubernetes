const express = require('express')
const app = express()

app.get('/', (request, response) => {
  response.send('<h1>Project v0.1</h1>')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})