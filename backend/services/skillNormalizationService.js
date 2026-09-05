/**
 * SkillNormalizationService
 * Feature 3: Standardizes variations of skill names into unified industry-standard names.
 * Case-insensitive, deduplicating, easily extensible taxonomy.
 */

// Centralized Skill Mapping Dictionary (alias in lowercase -> standardized canonical name)
const SKILL_TAXONOMY_MAP = {
  // Programming Languages
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ecmascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'py': 'Python',
  'python': 'Python',
  'python3': 'Python',
  'java': 'Java',
  'core java': 'Java',
  'cpp': 'C++',
  'c++': 'C++',
  'c plus plus': 'C++',
  'c#': 'C#',
  'csharp': 'C#',
  'c sharp': 'C#',
  'c': 'C',
  'golang': 'Go',
  'go': 'Go',
  'go lang': 'Go',
  'rust': 'Rust',
  'ruby': 'Ruby',
  'php': 'PHP',
  'kotlin': 'Kotlin',
  'swift': 'Swift',
  'dart': 'Dart',
  'r': 'R',

  // Frontend & Markup
  'html': 'HTML',
  'html5': 'HTML',
  'css': 'CSS',
  'css3': 'CSS',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'tailwind css': 'Tailwind CSS',
  'bootstrap': 'Bootstrap',
  'sass': 'Sass',
  'scss': 'Sass',

  // Frameworks & Libraries
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'react js': 'React',
  'vue': 'Vue.js',
  'vuejs': 'Vue.js',
  'vue.js': 'Vue.js',
  'angular': 'Angular',
  'angularjs': 'Angular',
  'angular.js': 'Angular',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'next js': 'Next.js',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'node js': 'Node.js',
  'express': 'Express.js',
  'expressjs': 'Express.js',
  'express.js': 'Express.js',
  'django': 'Django',
  'flask': 'Flask',
  'spring': 'Spring Boot',
  'spring boot': 'Spring Boot',
  'springboot': 'Spring Boot',
  'fastapi': 'FastAPI',
  'fast api': 'FastAPI',

  // Databases & SQL
  'sql': 'SQL',
  'mysql': 'MySQL',
  'my sql': 'MySQL',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'postgre sql': 'PostgreSQL',
  'psql': 'PostgreSQL',
  'mongo': 'MongoDB',
  'mongodb': 'MongoDB',
  'mongo db': 'MongoDB',
  'redis': 'Redis',
  'sqlite': 'SQLite',
  'sqlite3': 'SQLite',
  'cassandra': 'Cassandra',
  'oracle db': 'Oracle DB',
  'oracle': 'Oracle',

  // DevOps, Cloud & Tools
  'git': 'Git',
  'github': 'Git',
  'gitlab': 'GitLab',
  'docker': 'Docker',
  'docker container': 'Docker',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'azure': 'Azure',
  'microsoft azure': 'Azure',
  'gcp': 'GCP',
  'google cloud': 'GCP',
  'google cloud platform': 'GCP',
  'linux': 'Linux',
  'postman': 'Postman',
  'jira': 'Jira',
  'jenkins': 'Jenkins'
};

class SkillNormalizationService {
  constructor() {
    this.map = new Map();
    for (const [alias, standard] of Object.entries(SKILL_TAXONOMY_MAP)) {
      this.map.set(alias.toLowerCase().trim(), standard);
    }
  }

  /**
   * Normalizes a single skill string.
   * If unknown, returns the original skill (trimmed) instead of dropping it.
   */
  normalizeSkill(skill) {
    if (!skill || typeof skill !== 'string') return '';
    const cleaned = skill.trim();
    if (!cleaned) return '';

    const lower = cleaned.toLowerCase();
    if (this.map.has(lower)) {
      return this.map.get(lower);
    }

    // Strip superfluous trailing punctuation or dots if not part of standard name
    const stripped = lower.replace(/[.,;]+$/, '').trim();
    if (this.map.has(stripped)) {
      return this.map.get(stripped);
    }

    // Preserve unknown skill name as-is
    return cleaned;
  }

  /**
   * Normalizes an array of skills, removes duplicates (case-insensitive deduplication),
   * and preserves canonical ordering.
   */
  normalizeSkills(skills = []) {
    if (!Array.isArray(skills)) return [];

    const seen = new Set();
    const result = [];

    for (const rawSkill of skills) {
      const normalized = this.normalizeSkill(rawSkill);
      if (normalized) {
        const lowerKey = normalized.toLowerCase();
        if (!seen.has(lowerKey)) {
          seen.add(lowerKey);
          result.push(normalized);
        }
      }
    }

    return result;
  }

  /**
   * Allows dynamically registering new custom aliases.
   */
  addMapping(alias, standardName) {
    if (alias && standardName) {
      this.map.set(alias.toLowerCase().trim(), standardName.trim());
    }
  }

  /**
   * Returns copy of the current normalization dictionary.
   */
  getDictionary() {
    return Object.fromEntries(this.map.entries());
  }
}

module.exports = new SkillNormalizationService();
