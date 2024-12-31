const mongoose = require('mongoose');
const app = require('./app');
const morgan = require("morgan");

app.use(morgan("dev"));

const PORT = process.env.PORT || 4000;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/sales-management';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
