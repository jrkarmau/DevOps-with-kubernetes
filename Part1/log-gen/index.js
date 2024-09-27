const fs = require('fs')
const path = require('path')
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'timestamp.txt')

const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false)
    return res(true)
  })
})

const getTimestamp = () => {
    const date = new Date()
    const aika = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    return aika
}

const logString = async () => {  
  const timestamp = getTimestamp()
  console.log(timestamp)
  if (!await fileAlreadyExists()) {
    await new Promise(res => fs.mkdir(directory, { recursive: true }, (err) => res()))
  }
  fs.createWriteStream(filePath).write(timestamp)
  setTimeout(logString, 5000)
}


logString()