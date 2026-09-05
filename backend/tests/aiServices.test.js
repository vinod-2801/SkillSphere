/**
 * SkillSphere AI Services Automated Test Suite
 * Validates the 6 Core Features against SIH 2026 test specifications.
 */

const assert = require('assert');
const skillNormalizer = require('../services/skillNormalizationService');
const skillExtractor = require('../services/skillExtractionService');
const skillGapService = require('../services/skillGapService');
const employabilityService = require('../services/employabilityService');
const explainableMatchService = require('../services/explainableMatchService');
const resumeParserService = require('../services/resumeParserService');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`  PASS: ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Details:`, err.message);
  }
}

console.log('====================================================');
console.log('🧪 RUNNING SKILLSPHERE AI INTELLIGENCE TEST SUITE');
console.log('====================================================\n');

// -------------------------------------------------------------
// TEST 1 — NORMALIZATION
// -------------------------------------------------------------
runTest('TEST 1 — Normalization: JS, ReactJS, Postgres, Python', () => {
  const input = ['JS', 'ReactJS', 'Postgres', 'Python'];
  const expected = ['JavaScript', 'React', 'PostgreSQL', 'Python'];

  const actual = skillNormalizer.normalizeSkills(input);
  assert.deepStrictEqual(actual, expected, `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
});

// Additional Normalization Checks (e.g. Node.js, Mongo, Case-insensitivity)
runTest('TEST 1.1 — Normalization: NodeJS, Mongo, Postgre SQL, react.js', () => {
  const input = ['NodeJS', 'Mongo', 'Postgre SQL', 'react.js'];
  const expected = ['Node.js', 'MongoDB', 'PostgreSQL', 'React'];

  const actual = skillNormalizer.normalizeSkills(input);
  assert.deepStrictEqual(actual, expected);
});

// -------------------------------------------------------------
// TEST 2 — SKILL GAP ANALYSIS
// -------------------------------------------------------------
runTest('TEST 2 — Skill Gap: Matched & Missing Skills Partitioning', () => {
  const student = ['Python', 'SQL', 'React'];
  const job = ['Python', 'SQL', 'React', 'Node.js', 'MongoDB', 'Docker'];

  const gap = skillGapService.analyzeGap(student, job);

  assert.deepStrictEqual(gap.matchedSkills, ['Python', 'SQL', 'React'], 'Matched skills mismatch');
  assert.deepStrictEqual(gap.missingSkills, ['Node.js', 'MongoDB', 'Docker'], 'Missing skills mismatch');
});

// -------------------------------------------------------------
// TEST 3 — MATCH SCORE CALCULATION
// -------------------------------------------------------------
runTest('TEST 3 — Match Score: 6 required, 3 matched = 50%', () => {
  const student = ['Python', 'SQL', 'React'];
  const job = ['Python', 'SQL', 'React', 'Node.js', 'MongoDB', 'Docker'];

  const gap = skillGapService.analyzeGap(student, job);

  assert.strictEqual(gap.totalRequired, 6, 'Total required should be 6');
  assert.strictEqual(gap.matchedCount, 3, 'Matched count should be 3');
  assert.strictEqual(gap.missingCount, 3, 'Missing count should be 3');
  assert.strictEqual(gap.matchPercentage, 50, 'Match percentage should be 50%');
});

// Skill Gap matching with non-normalized student input (e.g. JS vs JavaScript)
runTest('TEST 3.1 — Skill Gap: Normalized equivalence (JS vs JavaScript)', () => {
  const student = ['JS', 'py'];
  const job = ['JavaScript', 'Python', 'Docker'];

  const gap = skillGapService.analyzeGap(student, job);
  assert.strictEqual(gap.matchPercentage, 67, '2 out of 3 should be 67%');
  assert.deepStrictEqual(gap.matchedSkills, ['JavaScript', 'Python']);
  assert.deepStrictEqual(gap.missingSkills, ['Docker']);
});

// -------------------------------------------------------------
// TEST 4 — EXPLAINABLE MATCH
// -------------------------------------------------------------
runTest('TEST 4 — Explainable Match: Mentions matched & missing skills and recommendations', () => {
  const student = ['Python', 'SQL', 'React'];
  const job = ['Python', 'SQL', 'React', 'Node.js', 'MongoDB', 'Docker'];

  const result = explainableMatchService.generateExplainableMatch(student, job, 'Full Stack Engineer');

  assert.strictEqual(result.matchScore, 50);
  assert.deepStrictEqual(result.matchedSkills, ['Python', 'SQL', 'React']);
  assert.deepStrictEqual(result.missingSkills, ['Node.js', 'MongoDB', 'Docker']);

  // Verify explanation mentions the required skills
  const exp = result.explanation;
  assert(exp.includes('Python'), 'Explanation must mention Python');
  assert(exp.includes('SQL'), 'Explanation must mention SQL');
  assert(exp.includes('React'), 'Explanation must mention React');
  assert(exp.includes('Node.js'), 'Explanation must mention Node.js');
  assert(exp.includes('MongoDB'), 'Explanation must mention MongoDB');
  assert(exp.includes('Docker'), 'Explanation must mention Docker');

  // Verify recommendations
  assert(result.recommendations.includes('Learn Node.js'));
  assert(result.recommendations.includes('Learn MongoDB'));
  assert(result.recommendations.includes('Learn Docker'));
});

// -------------------------------------------------------------
// TEST 5 — EMPLOYABILITY SCORE
// -------------------------------------------------------------
runTest('TEST 5 — Employability Score: Deterministic multi-factor calculation', () => {
  const sampleStudent = {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@innovx.edu',
    education: ['B.Tech Computer Science'],
    skills: ['Python', 'SQL', 'React', 'JavaScript', 'HTML', 'Git'], // 6 skills = 30 pts
    projects: ['E-Commerce Website', 'Portfolio Portal'], // 2 projects = 16 pts
    certifications: ['Python Certification'], // 1 cert = 8 pts
    experience: ['Web Development Intern'], // 1 exp = 12 pts
  };

  const firstCalc = employabilityService.calculateScore(sampleStudent);
  const secondCalc = employabilityService.calculateScore(sampleStudent);

  // Determinism check
  assert.strictEqual(firstCalc.score, secondCalc.score, 'Scoring must be 100% deterministic');
  assert.deepStrictEqual(firstCalc.breakdown, secondCalc.breakdown, 'Breakdown must match identically');
  assert(firstCalc.score > 0 && firstCalc.score <= 100, 'Score must be between 0 and 100');

  // Total breakdown sum equals total score
  const sum = Object.values(firstCalc.breakdown).reduce((a, b) => a + b, 0);
  assert.strictEqual(firstCalc.score, sum, 'Score must match the sum of its category breakdown');
});

// -------------------------------------------------------------
// TEST 6 — SKILL EXTRACTION FROM TEXT
// -------------------------------------------------------------
runTest('TEST 6 — Skill Extraction from raw project description', () => {
  const text = 'Developed web applications using Python, JavaScript, React, SQL, HTML and CSS. Used Git for version control.';
  const extracted = skillExtractor.extractSkills(text);

  const expectedSubset = ['Python', 'JavaScript', 'React', 'SQL', 'HTML', 'CSS', 'Git'];
  for (const skill of expectedSubset) {
    assert(extracted.skills.includes(skill), `Extracted skills must include ${skill}`);
  }
});

// -------------------------------------------------------------
// TEST 7 — RESUME PARSER STRUCTURE & ERROR HANDLING
// -------------------------------------------------------------
runTest('TEST 7 — Resume Parser: Validates non-PDF and structure', () => {
  // Test invalid buffer (not starting with %PDF-)
  const fakeBuffer = Buffer.from('Hello world this is not a pdf file');
  assert.throws(() => {
    resumeParserService.validatePdfBuffer(fakeBuffer);
  }, /Please upload a valid PDF file/);

  // Test text extraction logic
  const mockResumeText = `
Rahul Kumar
rahul@example.com

Education
B.Tech Computer Science - ABC Institute

Skills
Python, Java, React, SQL

Projects
E-Commerce Website - Built complete online store

Certifications
Python Certification

Experience
Web Development Intern - XYZ Tech
  `;

  const structured = resumeParserService.parseText(mockResumeText);
  assert.strictEqual(structured.name, 'Rahul Kumar');
  assert(structured.education.length > 0);
  assert(structured.skills.includes('Python'));
  assert(structured.skills.includes('React'));
  assert(structured.projects.length > 0);
  assert(structured.certifications.length > 0);
  assert(structured.experience.length > 0);
});

console.log(`\n====================================================`);
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} PASSED`);
console.log(`====================================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
