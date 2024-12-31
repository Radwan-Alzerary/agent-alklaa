const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', paymentController.getPayments);
// Optional: get payments by customer
router.get('/customer/:customerId', paymentController.getCustomerPayments);

router.post('/',protect, paymentController.createPayment);

module.exports = router;
