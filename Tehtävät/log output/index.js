const express = require('express')
const axios = require('axios');
const app = express()
const PORT = process.env.PORT || 3000
const message = process.env.MESSAGE;
const fs = require('fs');
const filePath = '/app/config/information.txt';

let string = ""

const getPongs = async () => {
  try {
    const response = await axios.get('http://pingpong-svc:2346/pongcount');
    console.log(response.data.pongs);
    return response.data.pongs;
  } catch (error) {
    console.error('Error fetching pongs:', error);
    return "0";
  }
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

function readConfigFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(`Error reading file from disk: ${err}`);
    return null;
  }
}

app.get('/logoutput', async (request, response) => {
  try {
    const pongs = await getPongs();
    const fileContent = readConfigFile(filePath);
    response.send(`
      <div>
        <h1>Log output</h1>
        <p>File content: ${fileContent}</p>
        <p>Env variable: MESSAGE=${message}</p>
        <p>Log output: ${string}</p>
        <p>Ping / Pongs: ${pongs}</p>
      </div>
    `);
  } catch (error) {
    response.status(500).send('Error fetching pongs');
  }
});

app.get('/', (request, response) => {
  response.send('Service is running');
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})

logString()