const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected Resume Analysis Route
router.post('/analyze', verifyToken, resumeController.analyzeResumeText);

module.exports = router;
