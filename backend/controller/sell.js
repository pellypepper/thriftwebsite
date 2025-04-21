const { uploadToCloudinary, processImage } = require('../utils/imageUtils');
const pool = require('../database/db');
const upload = require('../middleware/uploadMiddleware');

const createProduct = async (req, res) => {
  try {
  
    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({ 
          error: 'File upload error',
          details: err.message 
        });
      }
      

      
      const { title, price, description, condition, location, category, main_category, clerk_id } = req.body;

      if (!clerk_id) {
        return res.status(400).json({ error: 'You need to Sign In to post a product' });
      }

      if (!title || !price || !description || !condition || !location || !category || !main_category) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }

      try {
        const processedImage = await processImage(req.file.buffer);
        const cloudinaryResponse = await uploadToCloudinary(processedImage);

        const query = `
          INSERT INTO items (
            title, price, description, condition,
            location, category, main_category,
            image_url, clerk_id, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
          RETURNING *;
        `;

        const values = [
          title, price, description, condition,
          location, category, main_category,
          cloudinaryResponse.secure_url, clerk_id,
        ];

        const dbResponse = await pool.query(query, values);

        res.status(201).json({
          message: 'Item created successfully',
          item: dbResponse.rows[0],
        });
      } catch (error) {
      
        res.status(500).json({
          error: 'Failed to process upload',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
      }
    });
  } catch (outerError) {
    console.error('Outer error:', outerError);
    res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? outerError.message : undefined,
    });
  }
};

module.exports = { createProduct };