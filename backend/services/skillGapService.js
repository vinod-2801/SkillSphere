/**
 * SkillGapService
 * Feature 4: Deterministic skill gap analysis comparing normalized student skills
 * against normalized job requirements. Calculates exact match metrics without random numbers.
 */

const skillNormalizer = require('./skillNormalizationService');

class SkillGapService {
  /**
   * Analyzes gaps between student skills and job required skills.
   * 
   * @param {string[]} studentSkills - Array of student's skills
   * @param {string[]} jobSkills - Array of job's required skills
   * @returns {{
   *   matchedSkills: string[],
   *   missingSkills: string[],
   *   totalRequired: number,
   *   matchedCount: number,
   *   missingCount: number,
   *   matchPercentage: number
   * }}
   */
  analyzeGap(studentSkills = [], jobSkills = []) {
    if (!Array.isArray(jobSkills) || jobSkills.length === 0) {
      return {
        matchedSkills: [],
        missingSkills: [],
        totalRequired: 0,
        matchedCount: 0,
        missingCount: 0,
        matchPercentage: 0
      };
    }

    // 1. Normalize both skill sets using the centralized taxonomy
    const normalizedStudent = skillNormalizer.normalizeSkills(studentSkills || []);
    const normalizedJob = skillNormalizer.normalizeSkills(jobSkills);

    // 2. Build case-insensitive lookup set of student's skills
    const studentSkillMap = new Map();
    for (const s of normalizedStudent) {
      studentSkillMap.set(s.toLowerCase(), s);
    }

    const matchedSkills = [];
    const missingSkills = [];

    // 3. Partition job requirements into Matched and Missing
    for (const jobSkill of normalizedJob) {
      const lowerKey = jobSkill.toLowerCase();
      if (studentSkillMap.has(lowerKey)) {
        matchedSkills.push(jobSkill);
      } else {
        missingSkills.push(jobSkill);
      }
    }

    const totalRequired = normalizedJob.length;
    const matchedCount = matchedSkills.length;
    const missingCount = missingSkills.length;
    const matchPercentage = totalRequired > 0
      ? Math.round((matchedCount / totalRequired) * 100)
      : 0;

    return {
      matchedSkills,
      missingSkills,
      totalRequired,
      matchedCount,
      missingCount,
      matchPercentage
    };
  }
}

module.exports = new SkillGapService();
