// controllers/productController.js
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// GET all products with optional pagination
exports.getProducts = async (req, res) => {
  try {
    // const { page = 1, limit = 10 } = req.query;

    const products = await Product.find()
      // .limit(parseInt(limit))
      // .skip((parseInt(page) - 1) * parseInt(limit));

    // const total = await Product.countDocuments();

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, status, image, barcode } = req.body;

    // Basic validation (optional but recommended)
    if (!name || !category || !price || !stock || !status || !barcode) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      stock,
      status,
      image, // Can be URL from upload or empty
      barcode,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE product
exports.updateProduct = async (req, res) => {
  try {
    const { name, category, price, stock, status, image, barcode } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // If a new image is provided and the product already has an image, delete the old image file
    if (image && product.image && product.image !== image) {
      const oldImagePath = path.join(
        __dirname,
        '../uploads',
        path.basename(product.image)
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Error deleting old image:', err);
      });
    }

    // Update product fields
    product.name = name;
    product.category = category;
    product.price = price;
    product.stock = stock;
    product.status = status;
    product.image = image;
    product.barcode = barcode;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // If the product has an image, delete the image file
    if (product.image) {
      const imagePath = path.join(
        __dirname,
        '../uploads',
        path.basename(product.image)
      );
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
