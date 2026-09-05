const express = require('express');
const router = express.Router();
const futureController = require('../controllers/futureController');
const { verifyToken } = require('../middleware/authMiddleware');

// Prepared Modular Endpoints for SkillSphere Expansion
router.get('/credentials', verifyToken, futureController.credentials);
router.get('/notifications', verifyToken, futureController.notifications);

module.exports = router;
