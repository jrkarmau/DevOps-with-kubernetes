const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001

app.get('/', (request, response) => {
  response.send('<h1>Project start page</h1>')
})


app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})