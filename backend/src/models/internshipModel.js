const db = require('../config/db');

// Create a new internship post in PostgreSQL
const createInternship = async ({ title, company, location, stipend, duration, description, required_skills, posted_by }) => {
  const result = await db.query(
    `INSERT INTO internships (title, company, location, stipend, duration, description, required_skills, posted_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, title, company, location, stipend, duration, description, required_skills, posted_by, created_at, updated_at`,
    [
      title,
      company,
      location || null,
      stipend || null,
      duration || null,
      description,
      required_skills || [],
      posted_by,
    ]
  );
  return result.rows[0];
};

// Retrieve all internships from PostgreSQL ordered by creation date
const getAllInternships = async () => {
  const result = await db.query(
    `SELECT i.id, i.title, i.company, i.location, i.stipend, i.duration, i.description, i.required_skills, i.posted_by, 
            u.name AS poster_name, u.email AS poster_email, 
            i.created_at, i.updated_at
     FROM internships i
     JOIN users u ON i.posted_by = u.id
     ORDER BY i.created_at DESC`
  );
  return result.rows;
};

// Retrieve a single internship by ID
const getInternshipById = async (id) => {
  const result = await db.query(
    `SELECT i.id, i.title, i.company, i.location, i.stipend, i.duration, i.description, i.required_skills, i.posted_by, 
            u.name AS poster_name, u.email AS poster_email, 
            i.created_at, i.updated_at
     FROM internships i
     JOIN users u ON i.posted_by = u.id
     WHERE i.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

module.exports = {
  createInternship,
  getAllInternships,
  getInternshipById,
};
