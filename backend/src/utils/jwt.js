const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey_12345_dev', {
    expiresIn
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_12345_dev');
};

module.exports = {
  generateToken,
  verifyToken
};

