const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const InvoiceItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0, required: true },
});

const InvoiceSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true,
  },
  date: { type: Date, default: Date.now, required: true },
  dueDate: { type: Date },
  items: [InvoiceItemSchema],
  totalAmount: { type: Number },
  status: {
    type: String,
    // enum: ['مدفوعة', 'معلقة', 'متأخرة'],
    default: 'pending',
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  invoiceNumber: { type: Number }, // Auto-incremented field
});

// Add the auto-increment plugin
InvoiceSchema.plugin(AutoIncrement, { inc_field: 'invoiceNumber' });

module.exports = mongoose.model('Invoice', InvoiceSchema);
