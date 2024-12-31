// controllers/authController.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Agent = require('../models/Agent');

// Helper function to generate JWT
const generateToken = (user, role) => {
  return jwt.sign(
    { id: user._id, role },
    "sequrtyCode",
    { expiresIn: '365d' }
  );
};

// @desc    Register a new User (Super Admin)
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User({
      name,
      email,
      password,
      role, // Ensure role is validated in the model
    });

    await user.save();

    const token = generateToken(user, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Login User (Super Admin)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = generateToken(user, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Register a new Agent
exports.registerAgent = async (req, res) => {
  const { name, email, phone, role, password } = req.body;

  try {
    // Check if agent exists
    let agent = await Agent.findOne({ email });
    if (agent) {
      return res.status(400).json({ message: 'Agent already exists' });
    }

    // Create agent
    agent = new Agent({
      name,
      email,
      phone,
      role, // Ensure role is validated in the model
      password,
    });

    await agent.save();

    const token = generateToken(agent, 'agent'); // Assign a generic 'agent' role or specific role

    res.status(201).json({
      token,
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        role: agent.role,
        assignedCustomers: agent.assignedCustomers,
        totalSales: agent.totalSales,
        averageRating: agent.averageRating,
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Login Agent
exports.loginAgent = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for agent
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check password
    const isMatch = await agent.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = generateToken(agent, 'agent'); // Assign a generic 'agent' role or specific role

    res.json({
      token,
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        role: agent.role,
        assignedCustomers: agent.assignedCustomers,
        totalSales: agent.totalSales,
        averageRating: agent.averageRating,
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
