// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Agent = require('../models/Agent');

exports.protect = async (req, res, next) => {
  let token;
  // Check for token in headers
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {

    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, "sequrtyCode");

    // Attach user or agent to request
    if (decoded.role === 'superadmin' || decoded.role === 'user') {
      req.user = await User.findById(decoded.id).select('-password');
    } else if (decoded.role === 'agent') {
      req.agent = await Agent.findById(decoded.id).select('-password');
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware to check roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    let userRole;
    if (req.user) {
      userRole = req.user.role;
    } else if (req.agent) {
      userRole = req.agent.role;
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: `User role '${userRole}' is not authorized to access this route` });
    }

    next();
  }
};
