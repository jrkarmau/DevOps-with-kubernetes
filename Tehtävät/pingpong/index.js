const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'postgres-stset-0.postgres-svc',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

const getPongs = async () => {
  console.log('Connecting with user:', process.env.POSTGRES_USER);
  console.log('Connecting to database:', process.env.POSTGRES_DB);
  const res = await pool.query('SELECT count FROM pong_counter WHERE id = 1');
  return res.rows.length > 0 ? parseInt(res.rows[0].count) : 0;
};

const incCounterAndSave = async () => {
  const pongs = await getPongs();
  const newPongs = pongs + 1;
  await pool.query('INSERT INTO pong_counter (id, count) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET count = $1', [newPongs]);
  return newPongs;
};

app.get('/pingpong', async (request, response) => {
  try {
    const pongs = await incCounterAndSave()
    response.send(`<p>pong ${pongs}</p>`)
  } catch (error) {
    console.error(error);
    response.status(500).send('Error incrementing pong count');
  }
})

app.get('/pongcount', async (request, response) => {
  try {
    const pongs = await getPongs()
    response.json({ pongs: pongs })
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Failed to fetch pong count' })
  }
})

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})