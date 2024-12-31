const Customer = require('../models/Customer');
const Agent = require('../models/Agent');

// GET all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate('assignedAgent');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single customer
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('assignedAgent');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new customer
exports.createCustomer = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    if (newCustomer.assignedAgent) {
      await Agent.findByIdAndUpdate(newCustomer.assignedAgent, {
        $inc: { assignedCustomers: 1 },
      });
    }
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE customer
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedAgent');
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE customer
exports.deleteCustomer = async (req, res) => {
  try {
    console.log(req.params.id)
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    if (customer.assignedAgent) {
      await Agent.findByIdAndUpdate(customer.assignedAgent, {
        $inc: { assignedCustomers: -1 },
      });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/customers/:customerId/debts
exports.addDebtToCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { amount, recipient, remainingAmount, dueDate } = req.body;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    customer.debts.push({ amount, recipient, remainingAmount, dueDate });
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/customers/:customerId/debts/:debtId/repay
exports.repayDebt = async (req, res) => {
  try {
    const { customerId, debtId } = req.params;
    const { amount } = req.body;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const debtIndex = customer.debts.findIndex((d) => d._id.toString() === debtId);
    if (debtIndex === -1) {
      return res.status(404).json({ message: 'Debt not found' });
    }
    let debt = customer.debts[debtIndex];
    const newRemaining = debt.remainingAmount - amount;
    debt.remainingAmount = newRemaining > 0 ? newRemaining : 0;
    if (debt.remainingAmount <= 0) {
      customer.debts.splice(debtIndex, 1);
    } else {
      customer.debts[debtIndex] = debt;
    }
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
