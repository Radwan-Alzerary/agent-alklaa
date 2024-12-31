const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true,
  },
});

module.exports = mongoose.model('Payment', PaymentSchema);
