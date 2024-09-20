const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const logString = () => {  
    console.log(getString())
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
    response.send(`<p>Log output: ${getString()}</p>`)
  })

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})

logString()