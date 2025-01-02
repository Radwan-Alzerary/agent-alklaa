const Payment = require('../models/Payment');
const Customer = require('../models/Customer');

// GET all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('customerId').populate('agentId');
    console.log(payments)
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET payments for a specific customer
exports.getCustomerPayments = async (req, res) => {
  try {
    const { customerId } = req.params;
    const payments = await Payment.find({ customerId }).populate('agentId');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE payment
exports.createPayment = async (req, res) => {
  try {
    const data = req.body
    data.agentId = req.user.id
    const newPayment = await Payment.create(req.body);
    // Update customer balance
    await Customer.findByIdAndUpdate(req.body.customerId, {
      $inc: { balance: req.body.amount },
    });
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
