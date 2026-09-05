const db = require('../config/db');

// Find user by email (used for login and duplicate email checks)
const findUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT id, name, email, password_hash, role, created_at, updated_at 
     FROM users 
     WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
  return result.rows[0] || null;
};

// Find user by ID (used for retrieving safe profile, excluding password_hash)
const findUserById = async (id) => {
  const result = await db.query(
    `SELECT id, name, email, role, created_at, updated_at 
     FROM users 
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

// Create new user in PostgreSQL
const createUser = async ({ name, email, passwordHash, role }) => {
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email.toLowerCase(), passwordHash, role]
  );
  return result.rows[0];
};

// Update user profile (safe fields like name)
const updateUserProfile = async (id, { name }) => {
  const result = await db.query(
    `UPDATE users 
     SET name = $1 
     WHERE id = $2 
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, id]
  );
  return result.rows[0] || null;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
};
