const { Pool } = require("pg");
const env = require("./env");

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false
});

const query = (text, params = []) => pool.query(text, params);

const testConnection = async () => {
  await query("SELECT 1");
};

const closePool = async () => {
  await pool.end();
};

module.exports = {
  pool,
  query,
  testConnection,
  closePool
};
