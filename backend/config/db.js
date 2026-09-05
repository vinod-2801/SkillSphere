/**
 * Database Configuration & Data Access Layer
 * Supports PostgreSQL connection pool with seamless in-memory fallback for local demo.
 */

const { Pool } = require('pg');

let pool = null;
let isPgConnected = false;

// Default Seed Jobs matching the SIH 2026 Industry Portal scenarios
const initialSeedJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'NovaTech Innovations',
    department: 'Engineering',
    location: 'Remote / Bengaluru',
    description: 'Build high-performance web applications using modern UI technologies and state management.',
    required_skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Docker']
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'CloudScale Systems',
    department: 'Product Engineering',
    location: 'Hyderabad',
    description: 'Lead backend API development and frontend integration across scalable cloud services.',
    required_skills: ['Python', 'SQL', 'React', 'Node.js', 'MongoDB', 'Docker']
  },
  {
    id: 3,
    title: 'Data Platform Engineer',
    company: 'Alpha Insights',
    department: 'Data Science',
    location: 'Pune',
    description: 'Design robust ETL pipelines and analytical services for enterprise clients.',
    required_skills: ['Python', 'SQL', 'PostgreSQL', 'Docker', 'Git', 'AWS']
  }
];

// In-Memory Store
const inMemoryStore = {
  students: new Map(),
  jobs: [...initialSeedJobs],
  matches: []
};

// Default prototype student
inMemoryStore.students.set(1, {
  id: 1,
  name: 'Rahul Kumar',
  email: 'rahul.kumar@innovx.edu',
  education: ['B.Tech Computer Science'],
  skills: ['Python', 'SQL', 'React'],
  projects: ['E-Commerce Website'],
  certifications: ['Python Certification'],
  experience: ['Web Development Intern']
});

async function initDb() {
  const connectionString = process.env.DATABASE_URL || (
    process.env.PGHOST ? `postgres://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'skillsphere'}` : null
  );

  if (connectionString) {
    try {
      pool = new Pool({ connectionString, connectionTimeoutMillis: 2000 });
      const client = await pool.connect();
      client.release();
      isPgConnected = true;
      console.log(' Connected to PostgreSQL database.');
    } catch (err) {
      console.warn('⚠️ PostgreSQL connection failed, operating with in-memory prototype database:', err.message);
      isPgConnected = false;
    }
  } else {
    console.log('ℹ️ No PostgreSQL credentials configured. Using in-memory store for prototype mode.');
  }
}

const db = {
  initDb,
  isPgConnected: () => isPgConnected,

  async getJobs() {
    if (isPgConnected && pool) {
      const res = await pool.query('SELECT * FROM jobs ORDER BY id ASC');
      return res.rows;
    }
    return inMemoryStore.jobs;
  },

  async getStudent(id = 1) {
    if (isPgConnected && pool) {
      const res = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return inMemoryStore.students.get(Number(id)) || null;
  },

  async saveStudentProfile(studentData) {
    const id = studentData.id || 1;
    if (isPgConnected && pool) {
      const res = await pool.query(
        `INSERT INTO students (id, name, email, education)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE 
         SET name = EXCLUDED.name, education = EXCLUDED.education
         RETURNING *`,
        [id, studentData.name, studentData.email || 'student@skillsphere.edu', studentData.education]
      );
      return res.rows[0];
    }

    const updated = {
      id,
      name: studentData.name || 'Rahul Kumar',
      email: studentData.email || 'student@skillsphere.edu',
      education: studentData.education || [],
      skills: studentData.skills || [],
      projects: studentData.projects || [],
      certifications: studentData.certifications || [],
      experience: studentData.experience || []
    };
    inMemoryStore.students.set(id, updated);
    return updated;
  },

  async saveSkillMatch(matchData) {
    inMemoryStore.matches.push(matchData);
    return matchData;
  }
};

module.exports = db;
