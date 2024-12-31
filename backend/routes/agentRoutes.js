const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', agentController.getAgents);
router.get('/:id', agentController.getAgent);
router.post('/', agentController.createAgent);
router.put('/:id', agentController.updateAgent);
router.delete('/:id', agentController.deleteAgent);

router.get('/agent-sales', protect, authorize("مدير المبيعات", "مندوب مبيعات"), (req, res) => {
    res.json({ message: 'Sales data for agents.' });
  });
  
  // Example route accessible by all agents
  router.get('/agent-profile', protect, authorize("مدير المبيعات", "مندوب مبيعات", "مدير حسابات العملاء"), (req, res) => {
    res.json({ message: 'Agent profile information.' });
  });
  
module.exports = router;
