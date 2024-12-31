// routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');
const Product = require('../models/Product');
const fs = require("fs");

// Public Routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Protected Routes (Implement authentication middleware if needed)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get("/data/import", async (req, res) => {
    try {
        // Replace 'your-json-file.json' with the path to your JSON file
        const jsonFilePath = "data.json";
        console.log(process.cwd());

        // Read the JSON file
        const jsonData = fs.readFileSync(jsonFilePath, "utf8");
        console.log(jsonData)
        // Parse the JSON data
        const pharmaceuticalsArray = JSON.parse(jsonData);

        for (const item of pharmaceuticalsArray) {
            console.log(item)
            // Create a new Pharmaceutical document with the necessary fields
            const newPatients = new Product({
                name: item.name,
                category: "",
                serial:item.serial,
                price: item.price,
                stock: item.q,
                active : true,
                status: "متوفر",
                barcode: item.barcode,
            });
            try {
                // Save the pharmaceutical document to the database
                await newPatients.save();
                console.log(`Added: ${item.name}`);
            } catch (error) {
                console.error(`Error adding ${item.name}: ${error.message}`);
            }
        }
        res.status(200).json({ message: "Import completed." });
    } catch (error) {
        console.error(`Error reading JSON file: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
