const express = require("express");
const router = express.Router();
const ProductCategory = require("../models/ProductCategory"); // Adjust path
const Payment = require("../models/Payment"); // Adjust path
const Customer = require("../models/Customer"); // Adjust path
router.get("/product-categories", async (req, res) => {
    try {
      const categories = await ProductCategory.find(); // Fetch all categories
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching product categories:", error);
      res.status(500).json({ error: "Failed to fetch product categories" });
    }
  });
  router.get("/product-categories/:id", async (req, res) => {
    try {
      const category = await ProductCategory.findById(req.params.id); // Fetch by ID
      if (!category) {
        return res.status(404).json({ error: "Product category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      console.error(`Error fetching product category with id ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch product category" });
    }
  });
