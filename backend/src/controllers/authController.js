const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/apiResponse');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, {
        statusCode: 400,
        message: 'A user with this email address already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken({ id: user._id, email: user.email });

    return success(res, {
      statusCode: 201,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return error(res, {
        statusCode: 401,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return error(res, {
        statusCode: 401,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken({ id: user._id, email: user.email });

    return success(res, {
      statusCode: 200,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    return success(res, {
      statusCode: 200,
      message: 'Current user profile fetched successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update current user profile / password
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return error(res, {
        statusCode: 404,
        message: 'User not found'
      });
    }

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      if (!currentPassword) {
        return error(res, {
          statusCode: 400,
          message: 'Current password is required to set a new password'
        });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return error(res, {
          statusCode: 400,
          message: 'Incorrect current password'
        });
      }

      user.password = newPassword;
    }

    await user.save();

    return success(res, {
      statusCode: 200,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};

