const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

router.post('/:customerId/debts', customerController.addDebtToCustomer);
router.post('/:customerId/debts/:debtId/repay', customerController.repayDebt);
router.get("/:customerId/payments", async (req, res) => {
    try {
      const payments = await Payment.find({ customerId: req.params.customerId }); // Fetch payments
      res.status(200).json(payments);
    } catch (error) {
      console.error(`Error fetching payments for customer ${req.params.customerId}:`, error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });
  router.get("/:customerId/balance", async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.customerId); // Fetch customer by ID
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.status(200).json(customer.balance); // Return balance
    } catch (error) {
      console.error(`Error fetching balance for customer ${req.params.customerId}:`, error);
      res.status(500).json({ error: "Failed to fetch customer balance" });
    }
  });
        
module.exports = router;
