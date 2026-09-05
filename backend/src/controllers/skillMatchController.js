const jobModel = require('../models/jobModel');
const skillMatchModel = require('../models/skillMatchModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * GET /api/jobs/:id/match
 * Calculates dynamic skill match score between authenticated student and a job posting
 */
const getJobSkillMatch = async (req, res, next) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
      return sendError(res, 400, 'Validation Error: Invalid job ID');
    }

    // 1. Retrieve target job from PostgreSQL
    const job = await jobModel.getJobById(jobId);
    if (!job) {
      return sendError(res, 404, 'Job not found');
    }

    // 2. Extract job's required_skills
    const requiredSkills = Array.isArray(job.required_skills) ? job.required_skills : [];

    // 3. Get student skills from PostgreSQL user_skills table (or optional ?skills query parameter fallback)
    const userId = req.user.id;
    let studentSkills = await skillMatchModel.getUserSkills(userId);

    // Fallback: If query parameter ?skills=Python,React is passed in URL
    if (req.query.skills && typeof req.query.skills === 'string') {
      const querySkills = req.query.skills.split(',').map((s) => s.trim()).filter(Boolean);
      studentSkills = Array.from(new Set([...studentSkills, ...querySkills]));
    }

    // 4. Perform case-insensitive set-based matching
    const studentSkillsLower = new Set(studentSkills.map((s) => s.toLowerCase()));

    const matchedSkills = [];
    const missingSkills = [];

    for (const reqSkill of requiredSkills) {
      if (studentSkillsLower.has(reqSkill.toLowerCase())) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    }

    // 5. Calculate match percentage and explanation
    let matchPercentage = 0;
    let explanation = '';

    if (requiredSkills.length === 0) {
      matchPercentage = 100;
      explanation = 'No required skills specified for this job listing. 100% initial compatibility.';
    } else {
      matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);
      const matchedText = matchedSkills.length > 0 ? ` (${matchedSkills.join(', ')})` : '';
      const missingText = missingSkills.length > 0 ? `: ${missingSkills.join(', ')}` : '.';

      explanation = `Matched ${matchedSkills.length} of ${requiredSkills.length} required skill(s)${matchedText}. Missing ${missingSkills.length} skill(s)${missingText}`;
    }

    // 6. Return response
    return sendSuccess(res, 200, 'Skill match calculated successfully', {
      job_id: jobId,
      match_percentage: matchPercentage,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      explanation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobSkillMatch,
};
