// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  registerAgent, 
  loginAgent 
} = require('../controllers/authController');

// User (Super Admin) Registration and Login
router.post('/register/user', registerUser);
router.post('/login/user', loginUser);

// Agent Registration and Login
router.post('/register/agent', registerAgent);
router.post('/login/agent', loginAgent);

module.exports = router;
