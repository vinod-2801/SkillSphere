const db = require('../config/db');

/**
 * Save extracted skills for a user into PostgreSQL user_skills table
 */
const saveUserSkills = async (userId, skillsArray) => {
  if (!Array.isArray(skillsArray) || skillsArray.length === 0) return [];
  
  for (const skill of skillsArray) {
    if (typeof skill === 'string' && skill.trim()) {
      await db.query(
        `INSERT INTO user_skills (user_id, skill_name)
         VALUES ($1, $2)
         ON CONFLICT (user_id, skill_name) DO NOTHING`,
        [userId, skill.trim()]
      );
    }
  }
};

/**
 * Retrieve saved skills for a user from PostgreSQL
 */
const getUserSkills = async (userId) => {
  const result = await db.query(
    `SELECT skill_name FROM user_skills WHERE user_id = $1 ORDER BY skill_name ASC`,
    [userId]
  );
  return result.rows.map((row) => row.skill_name);
};

module.exports = {
  saveUserSkills,
  getUserSkills,
};
