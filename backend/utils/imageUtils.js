const sharp = require('sharp');
const cloudinary = require('../config/cloudinaryConfig');

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        format: 'webp',
        quality: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

const processImage = async (buffer) => {
  return sharp(buffer)
    .webp({ quality: 80 })
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer();
};

module.exports = {
  uploadToCloudinary,
  processImage,
};
