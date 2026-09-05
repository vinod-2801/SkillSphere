const { sendError } = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  // Log error internally for server-side debugging
  console.error('Centralized Error Handler:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.isOperational ? err.message : 'An internal server error occurred';

  return sendError(res, statusCode, message);
};

// 404 Route Not Found Middleware
const notFoundHandler = (req, res) => {
  return sendError(res, 404, `Route ${req.originalUrl} not found`);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
