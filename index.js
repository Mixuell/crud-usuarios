const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.get('/usuarios', async (req, res) => {
  const result = await pool.query('SELECT * FROM usuarios');
  res.json(result.rows);
});

app.post('/usuarios', async (req, res) => {
  const { nombre, email } = req.body;

  const result = await pool.query(
    'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *',
    [nombre, email]
  );

  res.json(result.rows[0]);
});

app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  await pool.query('DELETE FROM usuarios WHERE id=$1', [id]);

  res.json({ mensaje: 'Eliminado' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor corriendo');
});