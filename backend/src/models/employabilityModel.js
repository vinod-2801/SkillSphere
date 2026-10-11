const db = require('../config/db');

/**
 * Save an employability score calculation in PostgreSQL
 */
const saveScore = async ({ userId, score, breakdown, targetRole }) => {
  const result = await db.query(
    `INSERT INTO employability_scores (user_id, score, breakdown, target_role, calculated_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, user_id, score, breakdown, target_role, calculated_at`,
    [userId, Math.min(100, Math.max(0, Math.round(score))), JSON.stringify(breakdown || {}), targetRole || null]
  );
  return result.rows[0];
};

/**
 * Get latest employability score for a user
 */
const getLatestScore = async (userId) => {
  const result = await db.query(
    `SELECT id, user_id, score, breakdown, target_role, calculated_at
     FROM employability_scores
     WHERE user_id = $1
     ORDER BY calculated_at DESC
     LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
};

module.exports = {
  saveScore,
  getLatestScore,
};
