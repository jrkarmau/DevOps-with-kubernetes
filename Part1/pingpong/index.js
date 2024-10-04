const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const fs = require('fs')
const path = require('path')
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'pongs.txt')

const getPongs = async () => {
  if (!fs.existsSync(filePath)) {
    return 0
  }
  return parseInt(fs.readFileSync(filePath).toString())
}

const incCounterAndSave = async () => {  
  const pongs = await getPongs()
  if (pongs === 0) {
    fs.mkdirSync(directory, { recursive: true })
  }
  const newPongs = pongs + 1
  fs.writeFileSync(filePath, newPongs.toString())
  return newPongs
}

app.get('/pingpong', async (request, response) => {
  try {
    const pongs = await incCounterAndSave()
    response.send(`<p>pong ${pongs}</p>`)
  } catch (error) {
    response.status(500).send('Error incrementing pong count')
  }
})

app.get('/pongcount', async (request, response) => {
  try {
    const pongs = await getPongs()
    response.json({ pongs: pongs })
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch pong count' })
  }
})

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})