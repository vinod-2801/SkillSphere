const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Protected Internships Endpoints

// 1. Create an Internship - Only 'industry' role allowed
router.post('/', verifyToken, requireRole('industry'), internshipController.createInternship);

// 2. Get All Internships - Any authenticated user
router.get('/', verifyToken, internshipController.getAllInternships);

// 3. Get Single Internship by ID - Any authenticated user
router.get('/:id', verifyToken, internshipController.getInternshipById);

module.exports = router;
