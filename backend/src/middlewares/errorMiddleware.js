const { error } = require('../utils/apiResponse');

// 404 Route Not Found handler
const notFound = (req, res, next) => {
  return error(res, {
    statusCode: 404,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

// Centralized Global Error Handler
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format for: ${err.path}`;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for '${field}'. Please use another value.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message
    }));
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please authenticate.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  }

  // Log server errors in development/production
  if (statusCode === 500) {
    console.error('[Unhandled Error]:', err);
  }

  return error(res, {
    statusCode,
    message,
    errors: errors || (process.env.NODE_ENV === 'development' ? err.stack : null)
  });
};

module.exports = {
  notFound,
  errorHandler
};

