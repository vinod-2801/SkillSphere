const applicationModel = require('../models/applicationModel');
const jobModel = require('../models/jobModel');
const internshipModel = require('../models/internshipModel');
const skillMatchModel = require('../models/skillMatchModel');
const resumeModel = require('../models/resumeModel');
const skillNormalizer = require('../../services/skillNormalizationService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * POST /api/applications
 * Allows a student to apply for a job OR an internship using their saved verified resume.
 * Server-side enforcement of:
 * - Role authentication (Student only)
 * - Resume ownership (verified against authenticated applicant)
 * - Resume verification (valid parsed resume with extracted skills)
 * - Eligibility (verified student skills matching target requirements)
 */
const apply = async (req, res, next) => {
  try {
    const { job_id, internship_id, resume_id } = req.body;

    // 1. Role enforcement: Only students are eligible to apply
    if (req.user.role !== 'student') {
      return sendError(
        res,
        403,
        'Forbidden: Only student accounts are eligible to submit candidate applications.'
      );
    }

    const applicantId = req.user.id;

    // 2. Validation: Must provide either job_id OR internship_id, but not both and not neither
    if ((!job_id && !internship_id) || (job_id && internship_id)) {
      return sendError(
        res,
        400,
        'Validation Error: Application must specify either job_id OR internship_id (not both, not neither)'
      );
    }

    const jobId = job_id ? parseInt(job_id, 10) : null;
    const internshipId = internship_id ? parseInt(internship_id, 10) : null;

    if (job_id && isNaN(jobId)) {
      return sendError(res, 400, 'Validation Error: Invalid job_id');
    }
    if (internship_id && isNaN(internshipId)) {
      return sendError(res, 400, 'Validation Error: Invalid internship_id');
    }

    // 3. Resume Ownership & Verification Check:
    // If resume_id passed, verify the student strictly owns it.
    // If not passed, reuse the student's saved verified resume automatically.
    let studentResume = null;
    if (resume_id) {
      studentResume = await resumeModel.getResumeById(resume_id, applicantId);
      if (!studentResume) {
        return sendError(
          res,
          403,
          'Unauthorized: The specified resume does not exist or does not belong to your account.'
        );
      }
    } else {
      studentResume = await resumeModel.getLatestResumeByUserId(applicantId);
    }

    if (!studentResume) {
      return sendError(
        res,
        400,
        'Eligibility Error: Please upload and verify your resume before applying.'
      );
    }

    // 4. Verification Check: Student must have actual verified skills for eligibility checks.
    const userSkillRecords = await skillMatchModel.getUserSkillRecords(applicantId);
    const verifiedUserSkills = (userSkillRecords || [])
      .filter((skill) => (skill.verification_status || 'Unverified') === 'Verified')
      .map((skill) => skill.skill_name);

    if (!userSkillRecords || userSkillRecords.length === 0) {
      return sendError(
        res,
        400,
        'Eligibility Error: Please complete resume analysis before applying.'
      );
    }

    if (verifiedUserSkills.length === 0) {
      return sendError(
        res,
        400,
        'Eligibility Error: No verified skills are available yet. Resume-extracted skills are suggestions, not proof of proficiency.'
      );
    }

    // 5. Verify target position exists and check eligibility
    let targetListing = null;
    if (jobId) {
      targetListing = await jobModel.getJobById(jobId);
      if (!targetListing) {
        return sendError(res, 404, 'Job posting not found');
      }
    } else if (internshipId) {
      targetListing = await internshipModel.getInternshipById(internshipId);
      if (!targetListing) {
        return sendError(res, 404, 'Internship posting not found');
      }
    }

    // Eligibility check against required skills
    if (targetListing && Array.isArray(targetListing.required_skills) && targetListing.required_skills.length > 0) {
      const normalizedUserSkills = skillNormalizer.normalizeSkills(verifiedUserSkills);
      const normalizedRequired = skillNormalizer.normalizeSkills(targetListing.required_skills);

      const matched = normalizedRequired.filter((reqSkill) =>
        normalizedUserSkills.includes(reqSkill)
      );

      // If position has required skills, student must possess at least 1 verified match
      if (matched.length === 0 && normalizedRequired.length > 0) {
        return sendError(
          res,
          400,
          `Eligibility Notice: Your verified skills do not meet the core prerequisites for ${targetListing.title}. Required skills include: ${targetListing.required_skills.slice(0, 3).join(', ')}.`
        );
      }
    }

    // 6. Prevent duplicate application
    const existingApplication = await applicationModel.findApplication(applicantId, {
      jobId,
      internshipId,
    });

    if (existingApplication) {
      return sendError(res, 409, 'Application Error: You have already applied for this position');
    }

    // 7. Store application in PostgreSQL with attached verified resume
    const newApplication = await applicationModel.createApplication({
      applicantId,
      jobId,
      internshipId,
      resumeId: studentResume.id,
    });

    return sendSuccess(res, 201, 'Application submitted successfully with verified resume', {
      ...newApplication,
      attached_resume: {
        id: studentResume.id,
        file_name: studentResume.file_name,
        employability_score: studentResume.employability_score,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications/me
 * Retrieves all applications submitted by the logged-in student
 */
const getMyApplications = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const applications = await applicationModel.getApplicationsByStudent(studentId);
    return sendSuccess(res, 200, 'Submitted applications retrieved successfully', applications);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications/received
 * Retrieves applications submitted for listings posted by the logged-in industry recruiter
 */
const getReceivedApplications = async (req, res, next) => {
  try {
    const posterId = req.user.id;
    const applications = await applicationModel.getApplicationsForPoster(posterId);
    return sendSuccess(res, 200, 'Received applications retrieved successfully', applications);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  apply,
  getMyApplications,
  getReceivedApplications,
};
