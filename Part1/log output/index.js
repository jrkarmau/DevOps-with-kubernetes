const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const fs = require('fs')
const path = require('path')
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'pongs.txt')

let string = ""

const getPongs = () => {
  if (!fs.existsSync(filePath)) {
    return 0
  }
  return parseInt(fs.readFileSync
    (filePath).toString())
}

const logString = () => {  
  string = getString()
  console.log(string)
  setTimeout(logString, 5000)
}

const getString = () => {
    const osa1 = Math.random().toString(36).substring(2)
    const osa2 = Math.random().toString(36).substring(2)
    const osa3 = Math.random().toString(36).substring(2)
    const osa4 = Math.random().toString(36).substring(2)
    const date = new Date()
    const aika = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    const str = aika + ": " + osa1 + "-" + osa2 + "-" + osa3 + "-" + osa4
    return str
}


app.get('/', (request, response) => {
  response.send(`
    <div>
      <h1>Log output</h1>
      <p>Log output: ${string}</p>
      <p>Ping / Pongs: ${getPongs()}</p>
    </div>
  `)  
  })

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})

logString()