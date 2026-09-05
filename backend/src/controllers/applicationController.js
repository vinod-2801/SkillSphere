const applicationModel = require('../models/applicationModel');
const jobModel = require('../models/jobModel');
const internshipModel = require('../models/internshipModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * POST /api/applications
 * Allows a student to apply for a job OR an internship
 */
const apply = async (req, res, next) => {
  try {
    const { job_id, internship_id } = req.body;

    // 1. Validation: Must provide either job_id OR internship_id, but not both and not neither
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

    // 2. applicant_id comes strictly from JWT payload (req.user.id)
    const applicantId = req.user.id;

    // 3. Verify target position exists in database
    if (jobId) {
      const job = await jobModel.getJobById(jobId);
      if (!job) {
        return sendError(res, 404, 'Job not found');
      }
    } else if (internshipId) {
      const internship = await internshipModel.getInternshipById(internshipId);
      if (!internship) {
        return sendError(res, 404, 'Internship not found');
      }
    }

    // 4. Prevent duplicate application
    const existingApplication = await applicationModel.findApplication(applicantId, {
      jobId,
      internshipId,
    });

    if (existingApplication) {
      return sendError(res, 409, 'Application Error: You have already applied for this position');
    }

    // 5. Store application in PostgreSQL
    const newApplication = await applicationModel.createApplication({
      applicantId,
      jobId,
      internshipId,
    });

    return sendSuccess(res, 201, 'Application submitted successfully', newApplication);
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
