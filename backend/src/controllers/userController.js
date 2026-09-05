const userModel = require('../models/userModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * GET /api/users/me
 * Returns profile of authenticated user from JWT
 */
const getMyProfile = async (req, res, next) => {
  try {
    // User ID ALWAYS comes from req.user (populated by authMiddleware from JWT)
    const userId = req.user.id;

    const user = await userModel.findUserById(userId);
    if (!user) {
      return sendError(res, 404, 'User profile not found');
    }

    return sendSuccess(res, 200, 'User profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile
 * Updates profile of authenticated user
 */
const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return sendError(res, 400, 'Validation Error: Name is required for profile update');
    }

    const updatedUser = await userModel.updateUserProfile(userId, { name: name.trim() });
    if (!updatedUser) {
      return sendError(res, 404, 'User profile not found');
    }

    return sendSuccess(res, 200, 'Profile updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
