// controllers/agentController.js

const Agent = require('../models/Agent')
const bcrypt = require('bcryptjs')

// GET all agents
exports.getAgents = async (req, res) => {
  try {
    // Exclude password field from the returned data
    const agents = await Agent.find().select('-password')
    res.json(agents)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET single agent
exports.getAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password')
    if (!agent) return res.status(404).json({ message: 'Agent not found' })
    res.json(agent)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// CREATE new agent
exports.createAgent = async (req, res) => {
  try {
    const { name, email, phone, role, assignedCustomers, totalSales, averageRating, password } = req.body

    // Validate required fields
    if (!password) {
      return res.status(400).json({ error: 'Password is required' })
    }

    // Check if email already exists
    const existingAgent = await Agent.findOne({ email })
    if (existingAgent) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    const newAgent = new Agent({
      name,
      email,
      phone,
      role,
      assignedCustomers,
      totalSales,
      averageRating,
      password, // This will be hashed by the pre-save hook
    })

    await newAgent.save()
    // Exclude password from the response
    const agentResponse = newAgent.toObject()
    delete agentResponse.password
    res.status(201).json(agentResponse)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// UPDATE agent
exports.updateAgent = async (req, res) => {
  try {
    const { name, email, phone, role, assignedCustomers, totalSales, averageRating, password } = req.body

    const agent = await Agent.findById(req.params.id)
    if (!agent) return res.status(404).json({ message: 'Agent not found' })

    // Update fields
    agent.name = name || agent.name
    agent.email = email || agent.email
    agent.phone = phone || agent.phone
    agent.role = role || agent.role
    agent.assignedCustomers = assignedCustomers !== undefined ? assignedCustomers : agent.assignedCustomers
    agent.totalSales = totalSales !== undefined ? totalSales : agent.totalSales
    agent.averageRating = averageRating !== undefined ? averageRating : agent.averageRating

    // Update password if provided
    if (password) {
      agent.password = password // This will trigger the pre-save hook to hash the password
    }

    await agent.save()

    // Exclude password from the response
    const agentResponse = agent.toObject()
    delete agentResponse.password
    res.json(agentResponse)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// DELETE agent
exports.deleteAgent = async (req, res) => {
  try {
    
    const agent = await Agent.findByIdAndDelete(req.params.id)
    if (!agent) return res.status(404).json({ message: 'Agent not found' })
    res.json({ message: 'Agent deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
