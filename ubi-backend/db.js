// Database connection setup
const { Pool } = require('pg');

// Create a new pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Export the pool for use in other modules
module.exports = { pool };
