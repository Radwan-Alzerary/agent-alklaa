const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const xlsx = require('xlsx');
const fs = require('fs');
const Agent = require('../models/Agent');

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

router.get('/data/import', async (req,res)=>{
  try {
    const filePath = 'data.xlsx'; // Replace with the path to your Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const agentFind = await Agent.findOne({name:"عائد سليمان"})
    console.log(sheetData)


    // // Prepare and insert data into MongoDB
    const trades = sheetData.map((row) => ({
      name:row.tradeName,
      phone :row.phoneNumber,
      accountNumber :row.num,
      assignedAgent : agentFind.id,
      address :row.address
      }));

    await Customer.insertMany(trades);

    res.status(200).json({ message: 'Data imported successfully',  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to import data', error });
  }

});




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
