const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const ALLOWED_ROLES = ['student', 'industry', 'academician', 'institution_admin', 'platform_admin'];

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Input Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return sendError(res, 400, 'Validation Error: Full name is required');
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return sendError(res, 400, 'Validation Error: A valid email address is required');
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return sendError(res, 400, 'Validation Error: Password must be at least 6 characters long');
    }
    if (!role || !ALLOWED_ROLES.includes(role)) {
      return sendError(
        res,
        400,
        `Validation Error: Role must be one of: ${ALLOWED_ROLES.join(', ')}`
      );
    }

    // 2. Check duplicate email
    const existingUser = await userModel.findUserByEmail(email.trim());
    if (existingUser) {
      return sendError(res, 409, 'Registration Error: An account with this email already exists');
    }

    // 3. Password Hashing
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Create User in PostgreSQL
    const newUser = await userModel.createUser({
      name: name.trim(),
      email: email.trim(),
      passwordHash,
      role,
    });

    // 5. Return Safe User Info (password_hash is excluded by model)
    return sendSuccess(res, 201, 'User registered successfully', newUser);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Input Validation
    if (!email || !password) {
      return sendError(res, 400, 'Validation Error: Email and password are required');
    }

    // 2. Find User by Email
    const user = await userModel.findUserByEmail(email.trim());
    if (!user) {
      return sendError(res, 401, 'Authentication Error: Invalid email or password');
    }

    // 3. Verify Password Hash using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Authentication Error: Invalid email or password');
    }

    // 4. Generate JWT
    const secret = process.env.JWT_SECRET || 'skillsphere_default_secret_key';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      secret,
      { expiresIn }
    );

    // 5. Exclude password_hash before returning safe user object
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Stateless JWT logout: returns confirmation to client so frontend can clear local storage / authorization headers.
 */
const logout = async (req, res) => {
  return sendSuccess(
    res,
    200,
    'Logout successful. Client should remove stored JWT authorization token.'
  );
};

module.exports = {
  register,
  login,
  logout,
};
