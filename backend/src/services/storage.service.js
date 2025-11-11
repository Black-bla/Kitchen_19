const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function uploadBufferToCloudinary(buffer, filename, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = {
  uploadFile: async (file, folder = '') => {
    // file: may be { buffer, originalname, mimetype } or { path }
    if (!file) throw new Error('No file provided to upload');
    const options = { folder: folder || 'uploads' };

    // If a filepath is provided, upload directly from disk (stream/file path)
    if (file.path) {
      try {
        const result = await cloudinary.uploader.upload(file.path, options);
        // Attempt to remove temp file if it exists
        try { fs.unlinkSync(file.path); } catch (e) {}
        return {
          url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes,
          resource_type: result.resource_type
        };
      } catch (err) {
        throw err;
      }
    }

    // Fallback: buffer-based upload
    const filename = file.originalname || `upload-${Date.now()}`;
    const result = await uploadBufferToCloudinary(file.buffer, filename, options);
    return {
      url: result.secure_url,
      public_id: result.public_id,
      bytes: result.bytes,
      resource_type: result.resource_type
    };
  }
};
