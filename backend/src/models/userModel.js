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

// Student profile helpers for the portfolio module
const findStudentProfileByUserId = async (userId) => {
  const result = await db.query(
    `SELECT * FROM student_profiles WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0] || null;
};

const upsertStudentProfile = async (userId, profileData = {}) => {
  const {
    headline = '',
    about = '',
    bio = '',
    location = '',
    preferredRole = '',
    preferredJobType = '',
    preferredLocation = '',
    institution = '',
    department = '',
    degree = '',
    graduationYear = null,
    cgpa = '',
    profileVisibility = 'private',
  } = profileData;

  const result = await db.query(
    `INSERT INTO student_profiles (
      user_id,
      headline,
      about,
      bio,
      location,
      preferred_role,
      preferred_job_type,
      preferred_location,
      institution,
      department,
      degree,
      graduation_year,
      cgpa,
      profile_visibility,
      updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      headline = EXCLUDED.headline,
      about = EXCLUDED.about,
      bio = EXCLUDED.bio,
      location = EXCLUDED.location,
      preferred_role = EXCLUDED.preferred_role,
      preferred_job_type = EXCLUDED.preferred_job_type,
      preferred_location = EXCLUDED.preferred_location,
      institution = EXCLUDED.institution,
      department = EXCLUDED.department,
      degree = EXCLUDED.degree,
      graduation_year = EXCLUDED.graduation_year,
      cgpa = EXCLUDED.cgpa,
      profile_visibility = EXCLUDED.profile_visibility,
      updated_at = NOW()
    RETURNING *`,
    [
      userId,
      headline,
      about || bio,
      bio || about,
      location,
      preferredRole,
      preferredJobType,
      preferredLocation,
      institution,
      department,
      degree,
      graduationYear,
      cgpa,
      profileVisibility,
    ]
  );

  return result.rows[0];
};

const getUserSkillsByUserId = async (userId) => {
  const result = await db.query(
    `SELECT id, user_id, skill_name, source_type, verification_status, evidence_type, evidence_ref, verified_by, verified_at, created_at
     FROM user_skills
     WHERE user_id = $1
     ORDER BY skill_name ASC`,
    [userId]
  );
  return result.rows;
};

const createUserSkill = async (userId, skillName) => {
  const trimmed = String(skillName || '').trim();
  if (!trimmed) return null;

  const result = await db.query(
    `INSERT INTO user_skills (
      user_id,
      skill_name,
      source_type,
      verification_status,
      evidence_type,
      evidence_ref,
      verified_by,
      verified_at
    ) VALUES ($1, $2, 'Student-Declared', 'Unverified', 'manual_entry', NULL, NULL, NULL)
     ON CONFLICT (user_id, skill_name) DO UPDATE SET
       source_type = 'Student-Declared',
       verification_status = 'Unverified',
       evidence_type = 'manual_entry',
       evidence_ref = NULL,
       verified_by = NULL,
       verified_at = NULL
     RETURNING id, user_id, skill_name, source_type, verification_status, evidence_type, evidence_ref, verified_by, verified_at, created_at`,
    [userId, trimmed]
  );

  if (!result.rows[0]) {
    const existing = await db.query(
      `SELECT id, user_id, skill_name, source_type, verification_status, evidence_type, evidence_ref, verified_by, verified_at, created_at
       FROM user_skills WHERE user_id = $1 AND skill_name = $2`,
      [userId, trimmed]
    );
    return existing.rows[0] || null;
  }

  return result.rows[0];
};

const updateUserSkill = async (userId, skillRef, skillName) => {
  const trimmed = String(skillName || '').trim();
  const ref = String(skillRef || '').trim();
  if (!trimmed || !ref) return null;

  const result = await db.query(
    `UPDATE user_skills
     SET skill_name = $1,
         source_type = 'Student-Declared',
         verification_status = 'Unverified',
         evidence_type = 'manual_entry',
         evidence_ref = NULL,
         verified_by = NULL,
         verified_at = NULL
     WHERE user_id = $2 AND LOWER(skill_name) = LOWER($3)
     RETURNING id, user_id, skill_name, source_type, verification_status, evidence_type, evidence_ref, verified_by, verified_at, created_at`,
    [trimmed, userId, ref]
  );

  return result.rows[0] || null;
};

const deleteUserSkill = async (userId, skillRef) => {
  const ref = String(skillRef || '').trim();
  if (!ref) return false;

  const result = await db.query(
    `DELETE FROM user_skills
     WHERE user_id = $1 AND LOWER(skill_name) = LOWER($2)
     RETURNING skill_name`,
    [userId, ref]
  );

  return result.rowCount > 0;
};

const getStudentProjectsByUserId = async (userId) => {
  const result = await db.query(
    `SELECT *
     FROM student_projects
     WHERE user_id = $1
     ORDER BY is_featured DESC, created_at DESC`,
    [userId]
  );
  return result.rows;
};

const getStudentCertificationsByUserId = async (userId) => {
  const result = await db.query(
    `SELECT *
     FROM student_certifications
     WHERE user_id = $1
     ORDER BY issue_date DESC, created_at DESC`,
    [userId]
  );
  return result.rows;
};

const getStudentCertificationById = async (userId, certificationId) => {
  const result = await db.query(
    `SELECT *
     FROM student_certifications
     WHERE id = $1 AND user_id = $2`,
    [certificationId, userId]
  );
  return result.rows[0] || null;
};

const createStudentCertification = async (userId, certificationData = {}) => {
  const {
    certificateName,
    issuingOrganization,
    issueDate,
    expiryDate,
    credentialId,
    credentialUrl,
    certificateFileName,
    certificateFileUrl,
  } = certificationData;

  if (!certificateName || !issuingOrganization || !issueDate) {
    return null;
  }

  const result = await db.query(
    `INSERT INTO student_certifications (
      user_id,
      certificate_name,
      issuing_organization,
      issue_date,
      expiry_date,
      credential_id,
      credential_url,
      certificate_file_name,
      certificate_file_url,
      status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pending Verification')
     RETURNING *`,
    [
      userId,
      String(certificateName).trim(),
      String(issuingOrganization).trim(),
      issueDate,
      expiryDate || null,
      credentialId || null,
      credentialUrl || null,
      certificateFileName || null,
      certificateFileUrl || null,
    ]
  );

  return result.rows[0];
};

const updateStudentCertification = async (userId, certificationId, certificationData = {}) => {
  const existing = await getStudentCertificationById(userId, certificationId);
  if (!existing) return null;

  const {
    certificateName,
    issuingOrganization,
    issueDate,
    expiryDate,
    credentialId,
    credentialUrl,
    certificateFileName,
    certificateFileUrl,
  } = certificationData;

  const nextStatus = existing.status === 'Verified' || existing.status === 'Rejected' ? 'Pending Verification' : existing.status;

  const result = await db.query(
    `UPDATE student_certifications
     SET certificate_name = COALESCE($1, certificate_name),
         issuing_organization = COALESCE($2, issuing_organization),
         issue_date = COALESCE($3, issue_date),
         expiry_date = COALESCE($4, expiry_date),
         credential_id = COALESCE($5, credential_id),
         credential_url = COALESCE($6, credential_url),
         certificate_file_name = COALESCE($7, certificate_file_name),
         certificate_file_url = COALESCE($8, certificate_file_url),
         status = $9,
         rejection_reason = NULL,
         verified_by = NULL,
         verified_at = NULL,
         updated_at = NOW()
     WHERE id = $10 AND user_id = $11
     RETURNING *`,
    [
      certificateName ? String(certificateName).trim() : null,
      issuingOrganization ? String(issuingOrganization).trim() : null,
      issueDate || existing.issue_date,
      expiryDate !== undefined ? expiryDate : existing.expiry_date,
      credentialId !== undefined ? (credentialId || null) : existing.credential_id,
      credentialUrl !== undefined ? (credentialUrl || null) : existing.credential_url,
      certificateFileName !== undefined ? (certificateFileName || null) : existing.certificate_file_name,
      certificateFileUrl !== undefined ? (certificateFileUrl || null) : existing.certificate_file_url,
      nextStatus,
      certificationId,
      userId,
    ]
  );

  return result.rows[0] || null;
};

const deleteStudentCertification = async (userId, certificationId) => {
  const result = await db.query(
    `DELETE FROM student_certifications
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [certificationId, userId]
  );

  return result.rowCount > 0;
};

const verifyStudentCertification = async (verifierUserId, certificationId, verificationData = {}) => {
  const { status, rejectionReason } = verificationData;

  const existing = await db.query(
    `SELECT * FROM student_certifications WHERE id = $1`,
    [certificationId]
  );

  if (!existing.rows[0]) return null;

  if (existing.rows[0].user_id === verifierUserId) {
    return { forbidden: true };
  }

  const normalizedStatus = status === 'Rejected' ? 'Rejected' : 'Verified';
  const reason = normalizedStatus === 'Rejected' ? (rejectionReason || 'Certification could not be verified.') : null;

  const result = await db.query(
    `UPDATE student_certifications
     SET status = $1,
         rejection_reason = $2,
         verified_by = $3,
         verified_at = NOW(),
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [normalizedStatus, reason, verifierUserId, certificationId]
  );

  return result.rows[0] || null;
};

const createStudentProject = async (userId, projectData = {}) => {
  const {
    projectName,
    description,
    technologiesUsed = [],
    githubUrl = '',
    demoUrl = '',
    isFeatured = false,
  } = projectData;

  const sanitizedName = String(projectName || '').trim();
  if (!sanitizedName) return null;

  const normalizedTech = Array.isArray(technologiesUsed)
    ? technologiesUsed.map((tech) => String(tech).trim()).filter(Boolean)
    : typeof technologiesUsed === 'string'
      ? technologiesUsed.split(',').map((tech) => tech.trim()).filter(Boolean)
      : [];

  const result = await db.query(
    `INSERT INTO student_projects (
      user_id,
      project_name,
      description,
      technologies_used,
      github_url,
      demo_url,
      is_featured
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, sanitizedName, description || '', normalizedTech, githubUrl || '', demoUrl || '', Boolean(isFeatured)]
  );

  return result.rows[0];
};

const updateStudentProject = async (userId, projectId, projectData = {}) => {
  const {
    projectName,
    description,
    technologiesUsed,
    githubUrl,
    demoUrl,
    isFeatured,
  } = projectData;

  const values = [];
  let queryParts = ['UPDATE student_projects SET'];

  if (projectName !== undefined) {
    const trimmed = String(projectName || '').trim();
    if (!trimmed) return null;
    values.push(trimmed);
    queryParts.push(`project_name = $${values.length}`);
  }

  if (description !== undefined) {
    values.push(description || '');
    queryParts.push(`description = $${values.length}`);
  }

  if (technologiesUsed !== undefined) {
    const normalizedTech = Array.isArray(technologiesUsed)
      ? technologiesUsed.map((tech) => String(tech).trim()).filter(Boolean)
      : typeof technologiesUsed === 'string'
        ? technologiesUsed.split(',').map((tech) => tech.trim()).filter(Boolean)
        : [];
    values.push(normalizedTech);
    queryParts.push(`technologies_used = $${values.length}`);
  }

  if (githubUrl !== undefined) {
    values.push(githubUrl || '');
    queryParts.push(`github_url = $${values.length}`);
  }

  if (demoUrl !== undefined) {
    values.push(demoUrl || '');
    queryParts.push(`demo_url = $${values.length}`);
  }

  if (isFeatured !== undefined) {
    values.push(Boolean(isFeatured));
    queryParts.push(`is_featured = $${values.length}`);
  }

  if (values.length === 0) return null;

  queryParts.push('updated_at = NOW()');
  values.push(projectId, userId);

  const result = await db.query(
    `${queryParts.join(', ')} WHERE id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *`,
    values
  );

  return result.rows[0] || null;
};

const deleteStudentProject = async (userId, projectId) => {
  const result = await db.query(
    `DELETE FROM student_projects
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [projectId, userId]
  );

  return result.rowCount > 0;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
  findStudentProfileByUserId,
  upsertStudentProfile,
  getUserSkillsByUserId,
  createUserSkill,
  updateUserSkill,
  deleteUserSkill,
  getStudentProjectsByUserId,
  getStudentCertificationsByUserId,
  getStudentCertificationById,
  createStudentCertification,
  updateStudentCertification,
  deleteStudentCertification,
  verifyStudentCertification,
  createStudentProject,
  updateStudentProject,
  deleteStudentProject,
};
