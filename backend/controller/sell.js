const { uploadToCloudinary, processImage } = require('../utils/imageUtils');
const pool = require('../../database/db');
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


const updateProduct = async (req, res) => {
  try {
    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({
          error: 'File upload error',
          details: err.message
        });
      }

   
      const { id, title, price, description } = req.body;
  
      
      const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).send('No product found');
      }
      
      let imageUrl = result.rows[0].image_url;
      
      if (req.file) {
        try {
          const processedImage = await processImage(req.file.buffer);
          const cloudinaryResponse = await uploadToCloudinary(processedImage);
          imageUrl = cloudinaryResponse.secure_url;
        } catch (fileError) {
          return res.status(400).json({
            error: 'Image processing or upload failed',
            details: fileError.message,
          });
        }
      }
      
      const updateQuery = `
        UPDATE items 
        SET title = $1, price = $2, description = $3, image_url = $4 
        WHERE id = $5
        RETURNING *;
      `;
      const updateValues = [title, price, description, imageUrl, id];

      const updateResult = await pool.query(updateQuery, updateValues);

      
      if (updateResult.rowCount === 0) {
        return res.status(400).send('Unable to update product');
      }

    
      res.status(200).json({
        message: 'Item updated successfully',
        item: updateResult.rows[0], 
      });
    });
    

  } catch (error) {
   
    res.status(500).send(error.message);
  }
};


module.exports = { createProduct , updateProduct};

