const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const fs = require('fs')
const path = require('path')
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'pongs.txt')

const getPongs = () => {
  if (!fs.existsSync(filePath)) {
    return 0
  }
  return parseInt(fs.readFileSync
    (filePath).toString())
}

const incCounterAndSave = () => {  
  const pongs = getPongs()
  if (pongs === 0) {
      fs.mkdirSync(directory, { recursive: true })
    }
    const newPongs = pongs + 1
  fs.createWriteStream(filePath).write(newPongs.toString())
  return newPongs
}

app.get('/pingpong', (request, response) => {
    const pongs = incCounterAndSave()
    response.send(`<p>pong ${pongs}</p>`)
  })

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})