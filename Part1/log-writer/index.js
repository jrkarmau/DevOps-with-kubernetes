const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path');
const PORT = process.env.PORT || 3000

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'timestamp.txt')

const getString = () => {
    const osa1 = Math.random().toString(36).substring(2)
    const osa2 = Math.random().toString(36).substring(2)
    const osa3 = Math.random().toString(36).substring(2)
    const osa4 = Math.random().toString(36).substring(2)
    const str = osa1 + "-" + osa2 + "-" + osa3 + "-" + osa4
    return str
}

app.get('/', (request, response) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err + ' ' + filePath)
      response.send('<p>File not found</p>')
      return
    }
    response.send(`<p>Log output: ${data + " " + getString()}</p>`)
  })
})

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})