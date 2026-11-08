const { validationResult } = require('express-validator');
const { error } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    return error(res, {
      statusCode: 422,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  next();
};

module.exports = validate;

