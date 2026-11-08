const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { error } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return error(res, {
      statusCode: 401,
      message: 'Authentication required. No token provided.'
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return error(res, {
        statusCode: 401,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, {
        statusCode: 401,
        message: 'Token expired. Please log in again.'
      });
    }
    return error(res, {
      statusCode: 401,
      message: 'Invalid authorization token.'
    });
  }
};

module.exports = {
  protect
};

