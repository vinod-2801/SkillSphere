const path = require('path');
const { Pool } = require('pg');

// Ensure .env is loaded regardless of current working directory
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../../backend/.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'SkillSphere',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Vinod',
});

// Helper function to execute parameterized SQL queries cleanly
const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query,
};
