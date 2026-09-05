const SKILL_KEYWORDS = [
  { name: 'JavaScript', regex: /\b(javascript|js)\b/i },
  { name: 'React', regex: /\b(react|reactjs)\b/i },
  { name: 'Node.js', regex: /\b(node\.?js|nodejs)\b/i },
  { name: 'Python', regex: /\bpython\b/i },
  { name: 'Java', regex: /\bjava\b(?!script)/i },
  { name: 'C++', regex: /\bc\+\+\b/i },
  { name: 'C', regex: /\bC\b|\bC-language\b/ },
  { name: 'SQL', regex: /\bsql\b/i },
  { name: 'PostgreSQL', regex: /\b(postgres|postgresql)\b/i },
  { name: 'MongoDB', regex: /\b(mongo|mongodb)\b/i },
  { name: 'HTML', regex: /\b(html|html5)\b/i },
  { name: 'CSS', regex: /\b(css|css3)\b/i },
  { name: 'Git', regex: /\b(git|github|gitlab)\b/i },
  { name: 'Docker', regex: /\bdocker\b/i },
  { name: 'AWS', regex: /\b(aws|amazon web services)\b/i },
  { name: 'Machine Learning', regex: /\b(machine learning|ml)\b/i },
  { name: 'NLP', regex: /\b(nlp|natural language processing)\b/i },
  { name: 'Data Structures', regex: /\b(data structures|dsa|algorithms)\b/i },
];

/**
 * Keyword-based NLP skill extraction and dynamic employability score calculation
 * @param {string} text - Raw resume text input
 */
const extractSkillsAndScore = (text) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      extractedSkills: [],
      skillCount: 0,
      employabilityScore: 30,
      explanation: 'Base profile score of 30/100. No text provided for skill analysis.',
    };
  }

  const detectedSkills = [];
  SKILL_KEYWORDS.forEach((skill) => {
    if (skill.regex.test(text)) {
      detectedSkills.push(skill.name);
    }
  });

  const skillCount = detectedSkills.length;
  let employabilityScore = 30;
  let explanation = '';

  if (skillCount === 0) {
    employabilityScore = 30;
    explanation = 'Base profile score of 30/100. No target technical skills were detected in the provided resume text.';
  } else {
    // Dynamic Score Formula: Base score 40 + 10 points per detected skill, capped at 100
    employabilityScore = Math.min(100, 40 + skillCount * 10);
    explanation = `Base score of 40 + 10 points for each of the ${skillCount} detected skill(s) (${detectedSkills.join(', ')}). Score total capped at 100.`;
  }

  return {
    extractedSkills: detectedSkills,
    skillCount,
    employabilityScore,
    explanation,
  };
};

module.exports = {
  extractSkillsAndScore,
};
