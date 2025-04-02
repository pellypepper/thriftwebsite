const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const pool = require('../../database/db');
const multer = require('multer');
const { Buffer } = require('buffer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image_url');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        format: 'webp',
        quality: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

// Wrap multer upload in a promise to handle errors better
const handleUpload = (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

router.post('/form', async (req, res) => {
  try {
    // Handle the file upload first
    await handleUpload(req, res);

    const { title, price, description, condition, location, category, main_category, clerk_id } = req.body;
    if(!clerk_id) {
      return res.status(400).json({ error: 'You need to Sign In to post a product' });
    }
    if (!title || !price || !description || !condition || !location || !category || !main_category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Process image with Sharp
    const processedImageBuffer = await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    // Upload to Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(processedImageBuffer);

    // Save to PostgreSQL
    const query = `
    INSERT INTO items (
      title,
      price,
      description,
      condition,
      location,
      category,
      main_category,
      image_url,
      clerk_id,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) 
    RETURNING *
  `;
  
  const values = [
    title,
    price,
    description,
    condition,
    location,
    category,
    main_category,
    cloudinaryResponse.secure_url,
    clerk_id
  ];
  

    const dbResponse = await pool.query(query, values);

    res.status(201).json({
      message: 'Item created successfully',
      item: dbResponse.rows[0]
    });

  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        error: 'File upload error',
        details: error.message
      });
    }
    console.error('Error processing upload:', error);
    res.status(500).json({
      error: 'Failed to process upload',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});



module.exports = router;