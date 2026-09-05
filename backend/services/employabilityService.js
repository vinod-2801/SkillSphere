/**
 * EmployabilityService
 * Feature 5: Deterministic 0-100 Employability Score engine calculated from
 * real student profile metrics across 5 transparent pillars.
 */

const skillNormalizer = require('./skillNormalizationService');

class EmployabilityService {
  /**
   * Calculates the deterministic employability score.
   * Total possible = 100 points.
   * 
   * Pillars:
   * - Skills: max 30 points
   * - Projects: max 20 points
   * - Certifications: max 15 points
   * - Experience: max 20 points
   * - Profile Completeness: max 15 points
   * 
   * @param {Object} studentData
   * @param {string} [studentData.name]
   * @param {string} [studentData.email]
   * @param {string[]} [studentData.education]
   * @param {string[]} [studentData.skills]
   * @param {string[]} [studentData.projects]
   * @param {string[]} [studentData.certifications]
   * @param {string[]} [studentData.experience]
   * @returns {{ score: number, breakdown: { skills: number, projects: number, certifications: number, experience: number, profileCompleteness: number } }}
   */
  calculateScore(studentData = {}) {
    const rawSkills = Array.isArray(studentData.skills) ? studentData.skills : [];
    const normalizedSkills = skillNormalizer.normalizeSkills(rawSkills);
    const projects = Array.isArray(studentData.projects) ? studentData.projects : [];
    const certs = Array.isArray(studentData.certifications) ? studentData.certifications : [];
    const experience = Array.isArray(studentData.experience) ? studentData.experience : [];
    const education = Array.isArray(studentData.education) ? studentData.education : [];
    const name = studentData.name && studentData.name.trim().length > 0;
    const email = studentData.email && studentData.email.trim().length > 0;

    // 1. Skills Scoring (max 30 points)
    // 1 skill = 8 pts, 2 = 14 pts, 3 = 20 pts, 4 = 24 pts, 5 = 27 pts, 6+ = 30 pts
    const skillCount = normalizedSkills.length;
    let skillsScore = 0;
    if (skillCount === 1) skillsScore = 8;
    else if (skillCount === 2) skillsScore = 14;
    else if (skillCount === 3) skillsScore = 20;
    else if (skillCount === 4) skillsScore = 24;
    else if (skillCount === 5) skillsScore = 27;
    else if (skillCount >= 6) skillsScore = 30;

    // 2. Projects Scoring (max 20 points)
    // 1 project = 10 pts, 2 = 16 pts, 3+ = 20 pts
    const projectCount = projects.length;
    let projectsScore = 0;
    if (projectCount === 1) projectsScore = 10;
    else if (projectCount === 2) projectsScore = 16;
    else if (projectCount >= 3) projectsScore = 20;

    // 3. Certifications Scoring (max 15 points)
    // 1 certification = 8 pts, 2+ = 15 pts
    const certCount = certs.length;
    let certsScore = 0;
    if (certCount === 1) certsScore = 8;
    else if (certCount >= 2) certsScore = 15;

    // 4. Experience / Internships (max 20 points)
    // 1 internship/role = 12 pts, 2+ = 20 pts
    const expCount = experience.length;
    let expScore = 0;
    if (expCount === 1) expScore = 12;
    else if (expCount >= 2) expScore = 20;

    // 5. Profile Completeness (max 15 points)
    let completenessScore = 0;
    if (name) completenessScore += 3;
    if (education.length > 0) completenessScore += 4;
    if (email) completenessScore += 4;
    else completenessScore += 2; // Partial credit if basic profile exists
    if (skillCount > 0) completenessScore += 4;

    const totalScore = Math.min(100, Math.max(0, skillsScore + projectsScore + certsScore + expScore + completenessScore));

    return {
      score: totalScore,
      breakdown: {
        skills: skillsScore,
        projects: projectsScore,
        certifications: certsScore,
        experience: expScore,
        profileCompleteness: completenessScore
      }
    };
  }
}

module.exports = new EmployabilityService();
