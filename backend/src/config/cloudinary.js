const cloudinary = require('cloudinary').v2;

// 1. Load env vars immediately to ensure they are available
require('dotenv').config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

// 2. check if keys are missing and throw an error to help debugging
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      console.error('⚠️  Cloudinary environment variables are missing!');
      throw new Error('Cloudinary config failed: Missing Environment Variables');
}

// 3. Configure Cloudinary
cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET
});

module.exports = cloudinary;