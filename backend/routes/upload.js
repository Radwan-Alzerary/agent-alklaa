// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
console.log(imageUrl)
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Server error during image upload' });
  }
});

module.exports = router;
