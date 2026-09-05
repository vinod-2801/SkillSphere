const internshipModel = require('../models/internshipModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * POST /api/internships
 * Creates a new internship posting (Industry role only)
 */
const createInternship = async (req, res, next) => {
  try {
    const { title, company, location, stipend, duration, description, required_skills } = req.body;

    // 1. Input Validation for required fields
    if (!title || typeof title !== 'string' || !title.trim()) {
      return sendError(res, 400, 'Validation Error: Internship title is required');
    }
    if (!company || typeof company !== 'string' || !company.trim()) {
      return sendError(res, 400, 'Validation Error: Company name is required');
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
      return sendError(res, 400, 'Validation Error: Internship description is required');
    }

    // Process required_skills array if provided
    let skillsArray = [];
    if (Array.isArray(required_skills)) {
      skillsArray = required_skills.filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim());
    }

    // 2. Extract posted_by ALWAYS from JWT payload (req.user.id), never from req.body
    const postedBy = req.user.id;

    // 3. Store internship in PostgreSQL
    const newInternship = await internshipModel.createInternship({
      title: title.trim(),
      company: company.trim(),
      location: location && typeof location === 'string' ? location.trim() : null,
      stipend: stipend && typeof stipend === 'string' ? stipend.trim() : null,
      duration: duration && typeof duration === 'string' ? duration.trim() : null,
      description: description.trim(),
      required_skills: skillsArray,
      posted_by: postedBy,
    });

    return sendSuccess(res, 201, 'Internship posted successfully', newInternship);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/internships
 * Retrieves all internships from PostgreSQL for authenticated users
 */
const getAllInternships = async (req, res, next) => {
  try {
    const internships = await internshipModel.getAllInternships();
    return sendSuccess(res, 200, 'Internships retrieved successfully', internships);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/internships/:id
 * Retrieves a single internship by ID
 */
const getInternshipById = async (req, res, next) => {
  try {
    const internshipId = parseInt(req.params.id, 10);
    if (isNaN(internshipId)) {
      return sendError(res, 400, 'Validation Error: Invalid internship ID');
    }

    const internship = await internshipModel.getInternshipById(internshipId);
    if (!internship) {
      return sendError(res, 404, 'Internship not found');
    }

    return sendSuccess(res, 200, 'Internship retrieved successfully', internship);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInternship,
  getAllInternships,
  getInternshipById,
};
