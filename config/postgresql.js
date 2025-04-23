require('dotenv').config();
const { Pool } = require('pg');

const pgPool = new Pool({
  host:     process.env.PG_HOST,
  port:     process.env.PG_PORT ?? 5432,
  database: process.env.PG_DATABASE,
  user:     process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30_000,
  ssl: { rejectUnauthorized: false }, 
});

pgPool
  .connect()
  .then(client => {
    console.log('Connected to PostgreSQL');
    client.release();
  })
  .catch(err => console.error('PostgreSQL connection failed:', err));

module.exports = { pgPool };