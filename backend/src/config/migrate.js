const { pool } = require('./db');

async function runMigration() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Student portfolio profile table (one record per student)
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        headline VARCHAR(255),
        about TEXT,
        bio TEXT,
        location VARCHAR(255),
        preferred_role VARCHAR(255),
        preferred_job_type VARCHAR(255),
        preferred_location VARCHAR(255),
        institution VARCHAR(255),
        department VARCHAR(255),
        degree VARCHAR(255),
        graduation_year VARCHAR(20),
        cgpa VARCHAR(20),
        profile_visibility VARCHAR(30) NOT NULL DEFAULT 'private' CHECK (profile_visibility IN ('private', 'public', 'institution_only')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. User skill table (reused, not duplicated)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_skills (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        skill_name VARCHAR(100) NOT NULL,
        source_type VARCHAR(40) NOT NULL DEFAULT 'Student-Declared',
        verification_status VARCHAR(30) NOT NULL DEFAULT 'Unverified',
        evidence_type VARCHAR(50),
        evidence_ref VARCHAR(255),
        verified_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        verified_at TIMESTAMP WITH TIME ZONE,
        source_id INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_skill UNIQUE (user_id, skill_name)
      );
    `);

    await client.query(`
      ALTER TABLE user_skills
        ADD COLUMN IF NOT EXISTS source_type VARCHAR(40),
        ADD COLUMN IF NOT EXISTS verification_status VARCHAR(30),
        ADD COLUMN IF NOT EXISTS evidence_type VARCHAR(50),
        ADD COLUMN IF NOT EXISTS evidence_ref VARCHAR(255),
        ADD COLUMN IF NOT EXISTS verified_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
        ADD COLUMN IF NOT EXISTS source_id INTEGER;
    `);

    await client.query(`
      UPDATE user_skills
      SET source_type = COALESCE(NULLIF(source_type, ''), 'Student-Declared'),
          verification_status = COALESCE(NULLIF(verification_status, ''), 'Unverified')
      WHERE source_type IS NULL OR verification_status IS NULL;
    `);

    // 3. Student project table (one-to-many portfolio projects)
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        project_name VARCHAR(255) NOT NULL,
        description TEXT,
        technologies_used TEXT[] DEFAULT '{}',
        github_url TEXT,
        demo_url TEXT,
        is_featured BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Student certifications table (portfolio credentials pending external verification)
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_certifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        certificate_name VARCHAR(255) NOT NULL,
        issuing_organization VARCHAR(255) NOT NULL,
        issue_date DATE NOT NULL,
        expiry_date DATE,
        credential_id VARCHAR(255),
        credential_url TEXT,
        certificate_file_name VARCHAR(255),
        certificate_file_url TEXT,
        status VARCHAR(30) NOT NULL DEFAULT 'Pending Verification' CHECK (status IN ('Pending Verification', 'Verified', 'Rejected')),
        rejection_reason TEXT,
        verified_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        verified_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Resumes table (Permanent storage of resume text, metadata & extracted skills)
    await client.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500),
        raw_text TEXT,
        parsed_skills TEXT[] DEFAULT '{}',
        employability_score INTEGER,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Add resume_id to applications
    await client.query(`
      ALTER TABLE applications
      ADD COLUMN IF NOT EXISTS resume_id INTEGER REFERENCES resumes(id) ON DELETE SET NULL;
    `);

    // 3. Employability Scores table
    await client.query(`
      CREATE TABLE IF NOT EXISTS employability_scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
        breakdown JSONB NOT NULL,
        target_role VARCHAR(255),
        calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Career Roadmaps table
    await client.query(`
      CREATE TABLE IF NOT EXISTS career_roadmaps (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        target_role VARCHAR(255) NOT NULL,
        current_skills TEXT[] DEFAULT '{}',
        skills_to_learn TEXT[] DEFAULT '{}',
        estimated_timeline VARCHAR(100),
        raw_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_target_role UNIQUE (user_id, target_role)
      );
    `);

    // 5. Roadmap Milestones table
    await client.query(`
      CREATE TABLE IF NOT EXISTS roadmap_milestones (
        id SERIAL PRIMARY KEY,
        roadmap_id INTEGER NOT NULL REFERENCES career_roadmaps(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        milestone_key VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'learning_phase',
        description TEXT,
        duration VARCHAR(100),
        status VARCHAR(50) NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed')),
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_milestone UNIQUE (user_id, roadmap_id, milestone_key)
      );
    `);

    // 6. Safe benchmark jobs seeding if empty
    const jobsCountRes = await client.query('SELECT count(*) FROM jobs');
    if (parseInt(jobsCountRes.rows[0].count, 10) === 0) {
      // Find or create an industry user to act as poster
      let recruiterRes = await client.query("SELECT id FROM users WHERE role = 'industry' LIMIT 1");
      let posterId;
      if (recruiterRes.rows.length > 0) {
        posterId = recruiterRes.rows[0].id;
      } else {
        const bcrypt = require('bcryptjs');
        const hash = await bcrypt.hash('Recruiter@123', 10);
        const newRecruiter = await client.query(
          "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'industry') RETURNING id",
          ['TechNova Recruiting Team', 'recruiter@technova.com', hash]
        );
        posterId = newRecruiter.rows[0].id;
      }

      await client.query(`
        INSERT INTO jobs (id, title, company, location, description, required_skills, posted_by)
        VALUES
        (1, 'Frontend Developer', 'NovaTech Innovations', 'Remote / Bengaluru', 'Build responsive, high-performance UI systems with React.', ARRAY['JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Docker'], $1),
        (2, 'Full Stack Engineer', 'CloudScale Systems', 'Hyderabad', 'Backend API development and frontend integration across scalable cloud services.', ARRAY['Python', 'SQL', 'React', 'Node.js', 'MongoDB', 'Docker'], $1),
        (3, 'Data Platform Engineer', 'Alpha Insights', 'Pune', 'Design robust ETL pipelines and analytical dashboards.', ARRAY['Python', 'SQL', 'PostgreSQL', 'Docker', 'Git', 'AWS'], $1)
        ON CONFLICT (id) DO NOTHING;
      `, [posterId]);

      await client.query(`
        INSERT INTO internships (id, title, company, location, stipend, duration, description, required_skills, posted_by)
        VALUES
        (1, 'Software Developer Intern', 'TechNova Solutions', 'Remote / Bangalore', '₹35,000 / month', '6 Months', 'Work directly with senior engineers to build next-generation web applications.', ARRAY['React', 'JavaScript', 'SQL', 'Python'], $1),
        (2, 'Data Analyst Research Associate', 'Indo-Global Research Council', 'Hybrid (New Delhi)', '₹28,000 / month', '4 Months', 'Collaborate on large-scale academic and industry demographic datasets.', ARRAY['Python', 'SQL', 'Data Structures'], $1)
        ON CONFLICT (id) DO NOTHING;
      `, [posterId]);
    }

    await client.query('COMMIT');
    console.log('✅ SkillSphere Safe Database Migration completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  runMigration()
    .then(() => pool.end())
    .catch(() => pool.end());
}

module.exports = { runMigration };
