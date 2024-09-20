const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

let counter = 0

const incCounter = () => {  
    counter = counter + 1
}

app.get('/pingpong', (request, response) => {
    incCounter()
    response.send(`<p>pong ${counter}</p>`)
  })

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})