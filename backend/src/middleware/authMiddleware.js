const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Unauthorized: Access token missing or invalid format');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'skillsphere_default_secret_key';

    const decoded = jwt.verify(token, secret);

    // Attach authenticated identity from JWT payload ONLY
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Unauthorized: Token has expired. Please log in again.');
    }
    return sendError(res, 401, 'Unauthorized: Invalid authentication token');
  }
};

module.exports = {
  verifyToken,
};
