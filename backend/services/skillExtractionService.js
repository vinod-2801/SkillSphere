/**
 * SkillExtractionService
 * Feature 2: Detects technical skills, programming languages, frameworks,
 * databases, and developer tools from raw text or resume sections.
 */

const skillNormalizer = require('./skillNormalizationService');

// Comprehensive taxonomy categorized for extraction
const TECHNICAL_TAXONOMY = {
  languages: [
    { name: 'JavaScript', regex: /\b(?:javascript|js|ecmascript)\b/i },
    { name: 'TypeScript', regex: /\b(?:typescript|ts)\b/i },
    { name: 'Python', regex: /\b(?:python|py)\b/i },
    { name: 'Java', regex: /\b(?:java)\b(?!\s*script)/i },
    { name: 'C++', regex: /(?:\bc\+\+|\bc\s*plus\s*plus\b)/i },
    { name: 'C#', regex: /(?:\bc#|\bc\s*sharp\b)/i },
    { name: 'C', regex: /(?:\b(?<![a-zA-Z0-9_])c(?![a-zA-Z0-9_+])(?:\s+programming|\s+language)?)/i },
    { name: 'Go', regex: /\b(?:golang|go\s*lang)\b|\b(?:go)\s+(?:developer|programming|backend|microservices)\b/i },
    { name: 'Rust', regex: /\b(?:rust|rustlang)\b/i },
    { name: 'Ruby', regex: /\b(?:ruby|ruby\s*on\s*rails)\b/i },
    { name: 'PHP', regex: /\b(?:php)\b/i },
    { name: 'Kotlin', regex: /\b(?:kotlin)\b/i },
    { name: 'Swift', regex: /\b(?:swift)\b/i },
    { name: 'Dart', regex: /\b(?:dart)\b/i },
    { name: 'R', regex: /\b(?:r\s*programming|r\s*language)\b/i },
    { name: 'HTML', regex: /\b(?:html|html5)\b/i },
    { name: 'CSS', regex: /\b(?:css|css3)\b/i }
  ],
  frameworks: [
    { name: 'React', regex: /\b(?:react|reactjs|react\.js)\b/i },
    { name: 'Node.js', regex: /\b(?:node|nodejs|node\.js)\b/i },
    { name: 'Express.js', regex: /\b(?:express|expressjs|express\.js)\b/i },
    { name: 'Vue.js', regex: /\b(?:vue|vuejs|vue\.js)\b/i },
    { name: 'Angular', regex: /\b(?:angular|angularjs|angular\.js)\b/i },
    { name: 'Next.js', regex: /\b(?:nextjs|next\.js)\b/i },
    { name: 'Tailwind CSS', regex: /\b(?:tailwind|tailwindcss|tailwind\s*css)\b/i },
    { name: 'Bootstrap', regex: /\b(?:bootstrap)\b/i },
    { name: 'Django', regex: /\b(?:django)\b/i },
    { name: 'Flask', regex: /\b(?:flask)\b/i },
    { name: 'FastAPI', regex: /\b(?:fastapi|fast\s*api)\b/i },
    { name: 'Spring Boot', regex: /\b(?:spring\s*boot|springboot|spring\s*framework)\b/i }
  ],
  databases: [
    { name: 'SQL', regex: /\b(?:sql)\b/i },
    { name: 'PostgreSQL', regex: /\b(?:postgresql|postgres|postgre\s*sql|psql)\b/i },
    { name: 'MongoDB', regex: /\b(?:mongodb|mongo|mongo\s*db)\b/i },
    { name: 'MySQL', regex: /\b(?:mysql|my\s*sql)\b/i },
    { name: 'Redis', regex: /\b(?:redis)\b/i },
    { name: 'SQLite', regex: /\b(?:sqlite|sqlite3)\b/i },
    { name: 'Cassandra', regex: /\b(?:cassandra)\b/i },
    { name: 'Oracle', regex: /\b(?:oracle|oracle\s*db)\b/i }
  ],
  tools: [
    { name: 'Git', regex: /\b(?:git|github|gitlab)\b/i },
    { name: 'Docker', regex: /\b(?:docker|containerization)\b/i },
    { name: 'Kubernetes', regex: /\b(?:kubernetes|k8s)\b/i },
    { name: 'AWS', regex: /\b(?:aws|amazon\s*web\s*services)\b/i },
    { name: 'Azure', regex: /\b(?:azure|microsoft\s*azure)\b/i },
    { name: 'GCP', regex: /\b(?:gcp|google\s*cloud)\b/i },
    { name: 'Linux', regex: /\b(?:linux|ubuntu|centos)\b/i },
    { name: 'Postman', regex: /\b(?:postman)\b/i },
    { name: 'Jenkins', regex: /\b(?:jenkins)\b/i },
    { name: 'Jira', regex: /\b(?:jira)\b/i }
  ]
};

class SkillExtractionService {
  /**
   * Extracts technical skills from plain text or delimited skill lists.
   * Returns structured skill data with deduplication.
   * 
   * @param {string} text - Raw input text
   * @returns {{ skills: string[], categories: Object }}
   */
  extractSkills(text) {
    if (!text || typeof text !== 'string') {
      return { skills: [], categories: { languages: [], frameworks: [], databases: [], tools: [] } };
    }

    const detected = [];
    const categories = {
      languages: [],
      frameworks: [],
      databases: [],
      tools: []
    };

    // Scan across all categorized patterns
    for (const [category, items] of Object.entries(TECHNICAL_TAXONOMY)) {
      for (const item of items) {
        if (item.regex.test(text)) {
          const canonical = skillNormalizer.normalizeSkill(item.name);
          detected.push(canonical);
          if (!categories[category].includes(canonical)) {
            categories[category].push(canonical);
          }
        }
      }
    }

    // Also support comma/bullet delimited skill lists in section text
    const lines = text.split(/[\n,;•\-\|\/]+/);
    for (const token of lines) {
      const trimmed = token.trim();
      if (trimmed.length > 1 && trimmed.length < 35) {
        // If the token matches an entry in our dictionary
        const norm = skillNormalizer.normalizeSkill(trimmed);
        if (norm && norm.toLowerCase() !== trimmed.toLowerCase()) {
          detected.push(norm);
        }
      }
    }

    // Deduplicate and normalize
    const normalizedList = skillNormalizer.normalizeSkills(detected);

    return {
      skills: normalizedList,
      categories
    };
  }
}

module.exports = new SkillExtractionService();
