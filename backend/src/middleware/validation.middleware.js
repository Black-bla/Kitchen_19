const Joi = require('joi');

// Centralized validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Replace req.body with validated/sanitized data
    req.body = value;
    next();
  };
};

// File upload validation middleware
const validateFile = (options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    required = true
  } = options;

  return (req, res, next) => {
    const file = req.file;

    if (required && !file) {
      return res.status(400).json({
        success: false,
        error: 'File is required'
      });
    }

    if (file) {
      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          error: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`
        });
      }

      // Check file type
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
        });
      }
    }

    next();
  };
};

// MongoDB ObjectId validation
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

module.exports = {
  validate,
  validateFile,
  objectId
};