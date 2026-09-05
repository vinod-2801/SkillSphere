const { sendError } = require('../utils/responseHandler');

/**
 * Reusable middleware to restrict route access by role(s)
 * @param {...string} allowedRoles - List of permitted roles
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendError(res, 401, 'Unauthorized: User identity not found');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access Forbidden: Your role ('${req.user.role}') is not authorized to perform this action`
      );
    }

    next();
  };
};

module.exports = {
  requireRole,
};
