const db = require('../config/db');

// Check if an application already exists for this applicant and job/internship
const findApplication = async (applicantId, { jobId, internshipId }) => {
  if (jobId) {
    const result = await db.query(
      `SELECT id, applicant_id, job_id, status, created_at 
       FROM applications 
       WHERE applicant_id = $1 AND job_id = $2`,
      [applicantId, jobId]
    );
    return result.rows[0] || null;
  }

  if (internshipId) {
    const result = await db.query(
      `SELECT id, applicant_id, internship_id, status, created_at 
       FROM applications 
       WHERE applicant_id = $1 AND internship_id = $2`,
      [applicantId, internshipId]
    );
    return result.rows[0] || null;
  }

  return null;
};

// Insert a new application in PostgreSQL
const createApplication = async ({ applicantId, jobId, internshipId }) => {
  const result = await db.query(
    `INSERT INTO applications (applicant_id, job_id, internship_id, status)
     VALUES ($1, $2, $3, 'pending')
     RETURNING id, applicant_id, job_id, internship_id, status, created_at, updated_at`,
    [applicantId, jobId || null, internshipId || null]
  );
  return result.rows[0];
};

// Retrieve applications submitted by a specific student
const getApplicationsByStudent = async (studentId) => {
  const result = await db.query(
    `SELECT a.id, a.applicant_id, a.job_id, a.internship_id, a.status, a.created_at, a.updated_at,
            j.title AS job_title, j.company AS job_company, j.location AS job_location,
            i.title AS internship_title, i.company AS internship_company, i.location AS internship_location
     FROM applications a
     LEFT JOIN jobs j ON a.job_id = j.id
     LEFT JOIN internships i ON a.internship_id = i.id
     WHERE a.applicant_id = $1
     ORDER BY a.created_at DESC`,
    [studentId]
  );
  return result.rows;
};

// Retrieve applications received for jobs or internships posted by an industry recruiter
const getApplicationsForPoster = async (posterId) => {
  const result = await db.query(
    `SELECT a.id, a.applicant_id, u.name AS applicant_name, u.email AS applicant_email,
            a.job_id, a.internship_id, a.status, a.created_at, a.updated_at,
            j.title AS job_title, j.company AS job_company,
            i.title AS internship_title, i.company AS internship_company
     FROM applications a
     JOIN users u ON a.applicant_id = u.id
     LEFT JOIN jobs j ON a.job_id = j.id
     LEFT JOIN internships i ON a.internship_id = i.id
     WHERE j.posted_by = $1 OR i.posted_by = $1
     ORDER BY a.created_at DESC`,
    [posterId]
  );
  return result.rows;
};

module.exports = {
  findApplication,
  createApplication,
  getApplicationsByStudent,
  getApplicationsForPoster,
};
