/**
 * Standardized API Response Utilities
 */

const success = (res, { statusCode = 200, message = 'Success', data = null, pagination = null }) => {
  const payload = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(pagination !== null && { pagination })
  };
  return res.status(statusCode).json(payload);
};

const error = (res, { statusCode = 500, message = 'An error occurred', errors = null }) => {
  const payload = {
    success: false,
    message,
    ...(errors !== null && { errors })
  };
  return res.status(statusCode).json(payload);
};

module.exports = {
  success,
  error
};

