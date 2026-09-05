const { extractSkillsAndScore } = require('../utils/skillExtractor');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * POST /api/resumes/analyze
 * Analyzes raw resume text to extract skills and calculate an explainable employability score
 */
const analyzeResumeText = async (req, res, next) => {
  try {
    const { text } = req.body;

    // 1. Validation
    if (!text || typeof text !== 'string' || !text.trim()) {
      return sendError(res, 400, 'Validation Error: Resume text field ("text") is required');
    }

    // 2. User ID strictly from JWT payload (req.user.id)
    const userId = req.user.id;

    // 3. Keyword-based NLP extraction & dynamic score calculation
    const { extractedSkills, skillCount, employabilityScore, explanation } = extractSkillsAndScore(text);

    // 4. Persist extracted skills to user_skills table in PostgreSQL
    const skillMatchModel = require('../models/skillMatchModel');
    await skillMatchModel.saveUserSkills(userId, extractedSkills);

    // 4. Return result
    return sendSuccess(res, 200, 'Resume text analyzed successfully', {
      user_id: userId,
      extracted_skills: extractedSkills,
      skill_count: skillCount,
      employability_score: employabilityScore,
      explanation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeResumeText,
};
