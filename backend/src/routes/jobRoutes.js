const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const skillMatchController = require('../controllers/skillMatchController');

// Protected Jobs Endpoints

// 1. Create a Job - Only 'industry' role allowed
router.post('/', verifyToken, requireRole('industry'), jobController.createJob);

// 2. Get All Jobs - Any authenticated user
router.get('/', verifyToken, jobController.getAllJobs);

// 3. Get Job Skill Match Breakdown - Only 'student' role allowed
router.get('/:id/match', verifyToken, requireRole('student'), skillMatchController.getJobSkillMatch);

// 4. Get Single Job by ID - Any authenticated user
router.get('/:id', verifyToken, jobController.getJobById);

module.exports = router;
