const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Protected Applications Endpoints

// 1. Submit Application - Only 'student' role allowed
router.post('/', verifyToken, requireRole('student'), applicationController.apply);

// 2. Get My Submitted Applications - Only 'student' role allowed
router.get('/me', verifyToken, requireRole('student'), applicationController.getMyApplications);

// 3. Get Applications Received for My Job/Internship Listings - Only 'industry' role allowed
router.get('/received', verifyToken, requireRole('industry'), applicationController.getReceivedApplications);

module.exports = router;
