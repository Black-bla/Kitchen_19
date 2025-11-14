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
    // In test mode, return mock data instead of uploading to Cloudinary
    if (process.env.NODE_ENV === 'test') {
      return {
        secure_url: `https://cloudinary.test/${folder}/${Date.now()}-${file.originalname || 'test-file'}`,
        public_id: `test/${Date.now()}`,
        bytes: file.buffer ? file.buffer.length : 100,
        resource_type: 'raw'
      };
    }

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
  },

  deleteFile: async (urlOrPublicId) => {
    // In test mode, skip deletion
    if (process.env.NODE_ENV === 'test') {
      return { result: 'ok' };
    }

    try {
      // If it's a full URL, extract the public_id
      let publicId = urlOrPublicId;
      if (urlOrPublicId.includes('cloudinary.com')) {
        // Extract public_id from Cloudinary URL
        const urlParts = urlOrPublicId.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
          // Remove file extension to get public_id
          const filename = urlParts[urlParts.length - 1];
          publicId = filename.split('.')[0];
          // Include folder if present
          if (uploadIndex < urlParts.length - 2) {
            const folder = urlParts.slice(uploadIndex + 1, -1).join('/');
            publicId = `${folder}/${publicId}`;
          }
        }
      }

      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (err) {
      throw err;
    }
  }
};
