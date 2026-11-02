const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Protected User Routes (Require valid JWT)
router.get('/me', verifyToken, userController.getMyProfile);
router.put('/profile', verifyToken, userController.updateMyProfile);

// Student portfolio skill management
router.get('/skills', verifyToken, userController.getMySkills);
router.post('/skills', verifyToken, userController.createMySkill);
router.put('/skills/:id', verifyToken, userController.updateMySkill);
router.delete('/skills/:id', verifyToken, userController.deleteMySkill);

// Student portfolio project management
router.get('/projects', verifyToken, userController.getMyProjects);
router.post('/projects', verifyToken, userController.createMyProject);
router.put('/projects/:id', verifyToken, userController.updateMyProject);
router.delete('/projects/:id', verifyToken, userController.deleteMyProject);

// Student portfolio certification management
router.get('/certifications', verifyToken, userController.getMyCertifications);
router.post('/certifications', verifyToken, userController.createMyCertification);
router.put('/certifications/:id', verifyToken, userController.updateMyCertification);
router.delete('/certifications/:id', verifyToken, userController.deleteMyCertification);
router.patch('/certifications/:id/verify', verifyToken, requireRole('platform_admin', 'institution_admin', 'academician'), userController.verifyCertification);

// Example of Role-Restricted Admin Route
router.get(
  '/admin/overview',
  verifyToken,
  requireRole('platform_admin', 'institution_admin'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Access granted to admin portal overview',
      user: req.user,
    });
  }
);

module.exports = router;
