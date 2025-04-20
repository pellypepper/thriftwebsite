
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:pidYPZhgtJ08LYQs@db.gzgkvxckoeqqiztbvqwq.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false // Supabase requires SSL
  }
});

if (process.env.NODE_ENV !== 'test') {
  pool.connect()
    .then(() => console.log('Connected to PostgreSQL (Supabase)'))
    .catch((err) => console.error('Error connecting to PostgreSQL:', err));
}

module.exports = pool;
