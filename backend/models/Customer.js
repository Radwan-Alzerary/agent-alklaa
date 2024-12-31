const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  recipient: { type: String, required: true },
  remainingAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
});

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tradName:{type:String},
  email: { type: String },
  phone: { type: String },
  category: { type: String },
  accountNumber:{type:String},
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
  },
  address: { type: String },
  nearestPlace: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  registrationDate: { type: Date },
  lastPurchaseDate: { type: Date },
  totalPurchases: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  debts: [DebtSchema],
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model('Customer', CustomerSchema);
