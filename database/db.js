const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'pidYPZhgtJ08LYQs',
  host: 'db.gzgkvxckoeqqiztbvqwq.supabase.co',
  port: 5432,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  },
  // Force IPv4
  family: 4
});

if (process.env.NODE_ENV !== 'test') {
  pool.connect()
    .then(() => console.log('Connected to PostgreSQL (Supabase)'))
    .catch((err) => console.error('Error connecting to PostgreSQL:', err.stack));
}

module.exports = pool;