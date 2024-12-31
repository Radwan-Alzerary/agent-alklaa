// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Example route accessible only by superadmins
router.get('/superadmin-data', protect, authorize('superadmin'), (req, res) => {
  res.json({ message: 'This data is only accessible to superadmins.' });
});

// Example route accessible by users and superadmins
router.get('/user-data', protect, authorize('user', 'superadmin'), (req, res) => {
  res.json({ message: 'This data is accessible to users and superadmins.' });
});

module.exports = router;
