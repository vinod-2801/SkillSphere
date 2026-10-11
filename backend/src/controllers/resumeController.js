const { extractSkillsAndScore } = require('../utils/skillExtractor');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const skillMatchModel = require('../models/skillMatchModel');
const resumeModel = require('../models/resumeModel');
const employabilityModel = require('../models/employabilityModel');

/**
 * POST /api/resumes/analyze
 * Analyzes raw resume text to extract skills, persists resume & skills in PostgreSQL,
 * and calculates/persists an explainable employability score.
 */
const analyzeResumeText = async (req, res, next) => {
  try {
    const { text, fileName } = req.body;

    // 1. Validation
    if (!text || typeof text !== 'string' || !text.trim()) {
      return sendError(res, 400, 'Validation Error: Resume text field ("text") is required');
    }

    // 2. User ID strictly from JWT payload (req.user.id)
    const userId = req.user.id;

    // 3. Keyword-based NLP extraction & dynamic score calculation
    const { extractedSkills, skillCount, employabilityScore, explanation } = extractSkillsAndScore(text);

    // 4. Persist extracted skills to user_skills table in PostgreSQL
    await skillMatchModel.saveUserSkills(userId, extractedSkills);

    // 5. Persist resume document metadata and raw text in resumes table
    const savedResume = await resumeModel.saveResume({
      userId,
      fileName: fileName || 'Uploaded_Resume.pdf',
      rawText: text,
      parsedSkills: extractedSkills,
      employabilityScore,
    });

    // 6. Persist employability score in employability_scores table
    await employabilityModel.saveScore({
      userId,
      score: employabilityScore,
      breakdown: {
        skillsCount: skillCount,
        extractedSkills,
        baseScore: 40,
        explanation,
      },
      targetRole: req.body.targetRole || null,
    });

    // 7. Return complete persisted result
    return sendSuccess(res, 200, 'Resume text analyzed and permanently persisted successfully', {
      user_id: userId,
      resume_id: savedResume.id,
      file_name: savedResume.file_name,
      extracted_skills: extractedSkills,
      skill_count: skillCount,
      employability_score: employabilityScore,
      explanation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resumes/my-resume
 * Retrieves the authenticated student's latest persisted resume, extracted skills, and score
 */
const getMyResume = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const resume = await resumeModel.getLatestResumeByUserId(userId);
    const skills = await skillMatchModel.getUserSkills(userId);
    const scoreRecord = await employabilityModel.getLatestScore(userId);

    if (!resume && (!skills || skills.length === 0)) {
      return sendSuccess(res, 200, 'No resume uploaded yet', {
        hasResume: false,
        resume: null,
        skills: [],
        employabilityScore: null,
      });
    }

    return sendSuccess(res, 200, 'Saved resume and verified skills retrieved successfully', {
      hasResume: Boolean(resume),
      resume: resume
        ? {
            id: resume.id,
            fileName: resume.file_name,
            filePath: resume.file_path,
            rawText: resume.raw_text,
            parsedSkills: resume.parsed_skills || [],
            employabilityScore: scoreRecord ? scoreRecord.score : resume.employability_score,
            uploadedAt: resume.uploaded_at,
          }
        : null,
      skills: skills || [],
      employabilityScore: scoreRecord ? scoreRecord.score : (resume ? resume.employability_score : null),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeResumeText,
  getMyResume,
};
