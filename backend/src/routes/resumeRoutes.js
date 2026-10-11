const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected Resume Routes
router.post('/analyze', verifyToken, resumeController.analyzeResumeText);
router.get('/my-resume', verifyToken, resumeController.getMyResume);

module.exports = router;
