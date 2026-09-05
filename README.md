# SkillSphere – Academia–Industry Collaboration Portal
**Team**: INNOVEX  
**Event**: Smart India Hackathon (SIH 2026)  
**Module**: AI Career Intelligence Core  

---

## 🌟 Overview
SkillSphere bridges academic training and industry demands by providing an explainable, deterministic AI intelligence pipeline. Students can upload their PDF resume, review extracted profile sections, inspect their multi-factor employability score, and evaluate exact skill matches and gaps against live industry job postings.

---

## 🚀 Tech Stack
- **Frontend**: React (v18), Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js (v20 LTS), Express
- **Database**: PostgreSQL (with schema and automatic in-memory fallback for local demo)
- **AI/NLP**: Modular extraction, rule-based taxonomy normalization, deterministic gap analysis & explainability

---

## 🧠 The 6 AI Intelligence Features

```
            Resume PDF
                ↓
          Resume Parser
                ↓
         Skill Extraction
                ↓
        Skill Normalization
                ↓
         Student Skills
                ↓
         ┌───────────────┐
         │   Job Skills  │
         └───────┬───────┘
                 ↓
          Skill Gap Analysis
                 ↓
      ┌──────────┴──────────┐
      ↓                     ↓
Matched Skills        Missing Skills
      ↓                     ↓
      └──────────┬──────────┘
                 ↓
         Explainable Match
                 ↓
        Learning Suggestions
                 ↓
        Employability Score
```

### 1. Resume Parser (`/api/ai/resume/parse`)
- Validates PDF format (magic header `%PDF-`).
- Extracts text via `pdf-parse`.
- Detects sections: Name, Education, Skills, Projects, Certifications, Experience.
- Outputs structured JSON without hallucinating data.
- Allows students to review and edit data before saving.

### 2. Skill Extraction (`/api/ai/skills/extract`)
- Extracts technical skills, programming languages, frameworks, databases, and developer tools.
- Boundary-safe regex patterns and token analyzers.
- Deduplicates and standardizes skills.

### 3. Skill Normalization (`/api/ai/skills/normalize`)
- Centralized taxonomy mapping aliases to canonical names (e.g., `JS` -> `JavaScript`, `ReactJS` -> `React`, `Postgres` -> `PostgreSQL`, `NodeJS` -> `Node.js`, `Mongo` -> `MongoDB`).
- Case-insensitive matching.
- Preserves unrecognized skills rather than discarding them.

### 4. Skill Gap Analysis (`/api/ai/skill-gap`)
- Deterministically compares student skills with job requirements using normalized tokens.
- Computes `matchedSkills` (✓), `missingSkills` (✗), total required, counts, and exact match percentage.

### 5. Employability Score (`/api/ai/employability-score`)
- 0–100 deterministic score across 5 transparent pillars:
  - Technical Skills (max 30 pts)
  - Projects Portfolio (max 20 pts)
  - Industry Certifications (max 15 pts)
  - Work Experience / Internships (max 20 pts)
  - Profile Completeness (max 15 pts)
- No random numbers or arbitrary score generation.

### 6. Explainable AI Matching (`/api/ai/match`)
- Synthesizes clear, factual natural language explanations detailing which skills matched and which are missing.
- Generates actionable learning recommendations (e.g., "Learn Node.js", "Learn Docker").

---

## 🧪 Testing

Run the automated test suite verifying all 5 SIH benchmark scenarios:
```powershell
node backend/tests/aiServices.test.js
node backend/tests/apiEndpoints.test.js
```

### Benchmark Test Scenarios
1. **TEST 1 — Normalization**: `JS`, `ReactJS`, `Postgres`, `Python` ➔ `JavaScript`, `React`, `PostgreSQL`, `Python`.
2. **TEST 2 — Skill Gap**: Student (`Python`, `SQL`, `React`) vs Job (`Python`, `SQL`, `React`, `Node.js`, `MongoDB`, `Docker`) ➔ Matched: `['Python', 'SQL', 'React']`, Missing: `['Node.js', 'MongoDB', 'Docker']`.
3. **TEST 3 — Match Score**: 6 required, 3 matched ➔ `50%` match.
4. **TEST 4 — Explainable Match**: Transparent verdict mentioning matched & missing skills + recommendations.
5. **TEST 5 — Employability Score**: Deterministic multi-factor scoring matching exact profile credentials.

---

## 💻 How to Run

### Option 1: One-Click Startup (PowerShell)
```powershell
cd C:\Users\Admin\.gemini\antigravity\scratch\skillsphere
.\start.ps1
```

### Option 2: Run Backend & Frontend Separately

**Terminal 1 (Backend)**:
```powershell
cd C:\Users\Admin\.gemini\antigravity\scratch\skillsphere\backend
node server.js
```
*Backend runs on http://localhost:5000*

**Terminal 2 (Frontend)**:
```powershell
cd C:\Users\Admin\.gemini\antigravity\scratch\skillsphere\frontend
npm run dev
```
*Frontend runs on http://localhost:5173*

---

## 🗄️ Database Setup (PostgreSQL)

If using local PostgreSQL:
1. Create the database: `CREATE DATABASE skillsphere;`
2. Run schema: `psql -U postgres -d skillsphere -f schema.sql`
3. Set `DATABASE_URL` in `backend/.env`.
*(Note: If PostgreSQL is not installed or running, the server automatically uses the built-in in-memory prototype database with seed data).*
