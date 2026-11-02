const db = require('../config/db');

/**
 * Save extracted skills for a user into PostgreSQL user_skills table.
 * Resume-derived skills are persisted as source-aware records, never as Verified.
 */
const saveUserSkills = async (userId, skillsArray, options = {}) => {
  if (!Array.isArray(skillsArray) || skillsArray.length === 0) return [];

  const sourceType = options.sourceType || 'Resume-Extracted';
  const verificationStatus = options.verificationStatus || 'Unverified';
  const evidenceType = options.evidenceType || 'resume_analysis';
  const evidenceRef = options.evidenceRef || null;

  for (const skill of skillsArray) {
    const trimmedSkill = typeof skill === 'string' ? skill.trim() : String(skill || '').trim();
    if (!trimmedSkill) continue;

    try {
      await db.query(
        `INSERT INTO user_skills (
          user_id,
          skill_name,
          source_type,
          verification_status,
          evidence_type,
          evidence_ref,
          verified_by,
          verified_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NULL, NULL)
        ON CONFLICT (user_id, skill_name) DO UPDATE SET
          source_type = EXCLUDED.source_type,
          verification_status = EXCLUDED.verification_status,
          evidence_type = EXCLUDED.evidence_type,
          evidence_ref = EXCLUDED.evidence_ref,
          verified_by = NULL,
          verified_at = NULL`,
        [userId, trimmedSkill, sourceType, verificationStatus, evidenceType, evidenceRef]
      );
    } catch (err) {
      console.warn('saveUserSkills DB query notice:', err.message);
    }
  }

  return skillsArray;
};

/**
 * Retrieve saved skill names for a user from PostgreSQL.
 */
const getUserSkills = async (userId) => {
  try {
    const result = await db.query(
      `SELECT skill_name FROM user_skills WHERE user_id = $1 ORDER BY skill_name ASC`,
      [userId]
    );
    return result.rows ? result.rows.map((row) => row.skill_name) : [];
  } catch (err) {
    console.warn('getUserSkills DB query notice:', err.message);
    return [];
  }
};

/**
 * Retrieve full skill records including source and verification metadata.
 */
const getUserSkillRecords = async (userId) => {
  try {
    const result = await db.query(
      `SELECT id, user_id, skill_name, source_type, verification_status, evidence_type, evidence_ref, verified_by, verified_at, created_at
       FROM user_skills
       WHERE user_id = $1
       ORDER BY skill_name ASC`,
      [userId]
    );
    return result.rows || [];
  } catch (err) {
    console.warn('getUserSkillRecords DB query notice:', err.message);
    return [];
  }
};

module.exports = {
  saveUserSkills,
  getUserSkills,
  getUserSkillRecords,
};
