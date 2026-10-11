const db = require('../config/db');

/**
 * Save or update a student's resume in PostgreSQL
 */
const saveResume = async ({ userId, fileName, filePath, rawText, parsedSkills, employabilityScore }) => {
  const skillsArray = Array.isArray(parsedSkills) ? parsedSkills : [];
  const result = await db.query(
    `INSERT INTO resumes (user_id, file_name, file_path, raw_text, parsed_skills, employability_score, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING id, user_id, file_name, file_path, raw_text, parsed_skills, employability_score, uploaded_at, updated_at`,
    [userId, fileName, filePath || null, rawText || '', skillsArray, employabilityScore || null]
  );
  return result.rows[0];
};

/**
 * Get latest active resume for a user
 */
const getLatestResumeByUserId = async (userId) => {
  const result = await db.query(
    `SELECT id, user_id, file_name, file_path, raw_text, parsed_skills, employability_score, uploaded_at, updated_at
     FROM resumes
     WHERE user_id = $1
     ORDER BY uploaded_at DESC
     LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
};

/**
 * Get resume by ID and verify ownership
 */
const getResumeById = async (resumeId, userId) => {
  const result = await db.query(
    `SELECT id, user_id, file_name, file_path, raw_text, parsed_skills, employability_score, uploaded_at, updated_at
     FROM resumes
     WHERE id = $1 AND user_id = $2`,
    [resumeId, userId]
  );
  return result.rows[0] || null;
};

module.exports = {
  saveResume,
  getLatestResumeByUserId,
  getResumeById,
};
