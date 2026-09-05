-- SkillSphere Database Schema
-- Team INNOVEX - SIH 2026

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    education TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    raw_text TEXT,
    parsed_data JSONB NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_skills (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    normalized_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Technical',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, normalized_name)
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(100),
    description TEXT,
    required_skills TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_matches (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    match_percentage NUMERIC(5, 2) NOT NULL,
    matched_skills TEXT[] NOT NULL,
    missing_skills TEXT[] NOT NULL,
    recommendations TEXT[] NOT NULL,
    explanation TEXT NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employability_scores (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    breakdown JSONB NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Benchmark Job Postings
INSERT INTO jobs (title, company, department, location, description, required_skills)
VALUES 
(
    'Frontend Developer',
    'NovaTech Innovations',
    'Engineering',
    'Remote / Bengaluru',
    'Looking for an enthusiastic Frontend Developer experienced in building responsive, high-performance UI systems.',
    ARRAY['JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Docker']
),
(
    'Full Stack Engineer',
    'CloudScale Systems',
    'Product Engineering',
    'Hyderabad',
    'Seeking Full Stack talent with strong backend API expertise, database architecture, and frontend integration.',
    ARRAY['Python', 'SQL', 'React', 'Node.js', 'MongoDB', 'Docker']
),
(
    'Data Platform Engineer',
    'Alpha Insights',
    'Data Science',
    'Pune',
    'Design and maintain scalable data pipelines and analytical dashboards.',
    ARRAY['Python', 'SQL', 'PostgreSQL', 'Docker', 'Git', 'AWS']
)
ON CONFLICT DO NOTHING;
