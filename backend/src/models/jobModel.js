const db = require('../config/db');

// Create a new job post in PostgreSQL
const createJob = async ({ title, company, location, description, required_skills, posted_by }) => {
  const result = await db.query(
    `INSERT INTO jobs (title, company, location, description, required_skills, posted_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, title, company, location, description, required_skills, posted_by, created_at, updated_at`,
    [title, company, location || null, description, required_skills || [], posted_by]
  );
  return result.rows[0];
};

// Retrieve all jobs from PostgreSQL ordered by creation date
const getAllJobs = async () => {
  const result = await db.query(
    `SELECT j.id, j.title, j.company, j.location, j.description, j.required_skills, j.posted_by, 
            u.name AS poster_name, u.email AS poster_email, 
            j.created_at, j.updated_at
     FROM jobs j
     JOIN users u ON j.posted_by = u.id
     ORDER BY j.created_at DESC`
  );
  return result.rows;
};

// Retrieve a single job by ID
const getJobById = async (id) => {
  const result = await db.query(
    `SELECT j.id, j.title, j.company, j.location, j.description, j.required_skills, j.posted_by, 
            u.name AS poster_name, u.email AS poster_email, 
            j.created_at, j.updated_at
     FROM jobs j
     JOIN users u ON j.posted_by = u.id
     WHERE j.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
};
