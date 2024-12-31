require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");
const multer = require('multer');

const agentRoutes = require('./routes/agentRoutes');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoute = require('./routes/upload');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { protect, authorize } = require('./middleware/authMiddleware');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware
// app.use(cors());
const corsOptions = {
  origin: [
    /^(http:\/\/.+:8080)$/,
    /^(http:\/\/.+:8085)$/,
    /^(http:\/\/.+:80)$/,
    /^(http:\/\/.+:3000)$/,
    /^(http:\/\/.+:5000)$/,
    /^(http:\/\/.+:3001)$/,
    /^(http:\/\/.+:3100)$/,
  ],
  credentials: true,
  "Access-Control-Allow-Credentials": true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/customers',protect, customerRoutes);
app.use('/api/products',protect, productRoutes);
app.use('/api/categories',protect, categoryRoutes);
app.use('/api/invoices',protect, invoiceRoutes);
app.use('/api/payments',protect, paymentRoutes);
app.use('/api/upload',protect, uploadRoute);
app.use('/api/auth', authRoutes);
app.use('/api/users',protect, userRoutes);

// Serve static files from the 'uploads' directory

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

module.exports = app;
