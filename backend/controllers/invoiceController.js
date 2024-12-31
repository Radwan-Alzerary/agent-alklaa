const Invoice = require('../models/Invoice');

// GET all invoices
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customerId')
      .populate('agentId')
      .populate('items.productId');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single invoice
exports.getInvoice = async (req, res) => {
  try {
    console.log(req.params)
    const invoice = await Invoice.findById(req.params.id)
      .populate('items.productId', 'name') // Populate product details
      .populate('customerId', 'name') // Populate customer details
      .populate('agentId', 'name'); // Populate agent details
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
};

// CREATE invoice
exports.createInvoice = async (req, res) => {
  try {
    const data = req.body
    console.log(req.user)
    data.agentId = req.user.id
    console.log(data)
    console.log(data)
    const newInvoice = await Invoice.create(data);
    
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE invoice
exports.updateInvoice = async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
