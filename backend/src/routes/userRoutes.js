const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Protected User Routes (Require valid JWT)
router.get('/me', verifyToken, userController.getMyProfile);
router.put('/profile', verifyToken, userController.updateMyProfile);

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
