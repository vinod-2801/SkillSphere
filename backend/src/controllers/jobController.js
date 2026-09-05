const jobModel = require('../models/jobModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * POST /api/jobs
 * Creates a new job posting (Industry role only)
 */
const createJob = async (req, res, next) => {
  try {
    const { title, company, location, description, required_skills } = req.body;

    // 1. Validation for required fields
    if (!title || typeof title !== 'string' || !title.trim()) {
      return sendError(res, 400, 'Validation Error: Job title is required');
    }
    if (!company || typeof company !== 'string' || !company.trim()) {
      return sendError(res, 400, 'Validation Error: Company name is required');
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
      return sendError(res, 400, 'Validation Error: Job description is required');
    }

    // Process required_skills array if provided
    let skillsArray = [];
    if (Array.isArray(required_skills)) {
      skillsArray = required_skills.filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim());
    }

    // 2. Extract posted_by ALWAYS from JWT payload (req.user.id), never from req.body
    const postedBy = req.user.id;

    // 3. Store job in PostgreSQL
    const newJob = await jobModel.createJob({
      title: title.trim(),
      company: company.trim(),
      location: location && typeof location === 'string' ? location.trim() : null,
      description: description.trim(),
      required_skills: skillsArray,
      posted_by: postedBy,
    });

    return sendSuccess(res, 201, 'Job posted successfully', newJob);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs
 * Retrieves all jobs from PostgreSQL for authenticated users
 */
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await jobModel.getAllJobs();
    return sendSuccess(res, 200, 'Jobs retrieved successfully', jobs);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/:id
 * Retrieves a single job by ID
 */
const getJobById = async (req, res, next) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
      return sendError(res, 400, 'Validation Error: Invalid job ID');
    }

    const job = await jobModel.getJobById(jobId);
    if (!job) {
      return sendError(res, 404, 'Job not found');
    }

    return sendSuccess(res, 200, 'Job retrieved successfully', job);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
};
