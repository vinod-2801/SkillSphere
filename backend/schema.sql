-- SkillSphere Database Schema (SIH 2026)

-- 1. Create Database (Run separately if connecting to postgres maintenance db)
-- CREATE DATABASE skillsphere_db;

-- Connect to skillsphere_db before executing the rest:
-- \c skillsphere_db;

-- 2. Drop existing table if recreating (optional for clean setup)
-- DROP TABLE IF EXISTS users CASCADE;

-- 3. Create Users Table with role validation and timestamps
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (
        role IN ('student', 'industry', 'academician', 'institution_admin', 'platform_admin')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Function & Trigger for automatic updated_at timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 5. Create Student Profiles Table
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
    profile_visibility VARCHAR(30) NOT NULL DEFAULT 'private' CHECK (
        profile_visibility IN ('private', 'public', 'institution_only')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Student Projects Table
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

-- 7. Create Student Certifications Table
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

-- 8. Create Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    description TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    posted_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Trigger for automatic updated_at timestamp updates on jobs table
DROP TRIGGER IF EXISTS set_jobs_updated_at ON jobs;
CREATE TRIGGER set_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 7. Create Internships Table
CREATE TABLE IF NOT EXISTS internships (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    stipend VARCHAR(100),
    duration VARCHAR(100),
    description TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    posted_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Trigger for automatic updated_at timestamp updates on internships table
DROP TRIGGER IF EXISTS set_internships_updated_at ON internships;
CREATE TRIGGER set_internships_updated_at
BEFORE UPDATE ON internships
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 9. Create Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    internship_id INTEGER REFERENCES internships(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_application_target CHECK (
        (job_id IS NOT NULL AND internship_id IS NULL) OR
        (job_id IS NULL AND internship_id IS NOT NULL)
    ),
    CONSTRAINT unique_applicant_job UNIQUE (applicant_id, job_id),
    CONSTRAINT unique_applicant_internship UNIQUE (applicant_id, internship_id)
);

-- 10. Trigger for automatic updated_at timestamp updates on applications table
DROP TRIGGER IF EXISTS set_applications_updated_at ON applications;
CREATE TRIGGER set_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 11. Create User Skills Table (Extracted skills from resume analysis)
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



