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
const fs = require("fs");
const { default: mongoose } = require('mongoose');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const allowedOrigins = ['http://localhost:3000', 'https://agent1.niuraiq.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);



app.get("/exportdata", async (req, res) => {
  try {
    const modelNames = mongoose.modelNames();

    // Ensure the data directory exists
    const dataDirectory = "../backup";
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory);
    }

    const exportPromises = modelNames.map(async (modelName) => {
      const Model = mongoose.model(modelName);
      const data = await Model.find({});
      const dataPath = `./backup/${modelName}.json`;

      // Write the data to the file
      fs.writeFileSync(dataPath, JSON.stringify(data));

      console.log(`Exported ${modelName} to ${dataPath}`);
    });

    await Promise.all(exportPromises);

    res.status(200).json({ message: "All models exported successfully" });
  } catch (error) {
    console.error("Error exporting models", error);
    res.status(500).json({ error: "Error exporting models", details: error });
  }
});
app.get("/importdata", async (req, res) => {
  try {
    // Specify the models you want to import data for
    const allowedModels = ["Agent", "Customer", "Product","User"];

    for (const modelName of allowedModels) {
      const dataPath = `./backup/${modelName}.json`;

      try {
        // Read the JSON data from the file
        const rawData = fs.readFileSync(dataPath, "utf8");
        const data = JSON.parse(rawData);

        // Get the model
        const Model = mongoose.model(modelName);

        // Clear existing data in the model (optional, depending on your needs)
        await Model.deleteMany({});

        // Insert the data into the model
        await Model.insertMany(data);

        console.log(`Imported data for ${modelName}`);
      } catch (error) {
        console.error(`Error importing data for ${modelName}`, error);
      }
    }

    res.status(200).json({ message: "Data imported successfully for selected models" });
  } catch (error) {
    console.error("Error importing data", error);
    res.status(500).json({ error: "Error importing data", details: error });
  }
});

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
