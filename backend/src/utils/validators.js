const Joi = require('joi');
const mongoose = require('mongoose');

// Custom validators - accept either 24-hex string or Mongoose ObjectId
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectId = Joi.any().custom((value, helpers) => {
  if (typeof value === 'string' && objectIdRegex.test(value)) return value;
  if (value && mongoose && mongoose.Types && mongoose.Types.ObjectId && value instanceof mongoose.Types.ObjectId) {
    return value.toString();
  }
  if (value && value.toString && typeof value.toString === 'function' && objectIdRegex.test(value.toString())) {
    return value.toString();
  }
  return helpers.error('any.invalid');
}, 'ObjectId validation');

// Reusable validation patterns
const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .message('Password must be at least 8 characters with uppercase, lowercase, and number');

const email = Joi.string()
  .email()
  .lowercase()
  .trim();

const phoneNumber = Joi.string()
  .pattern(/^[\+]?[1-9][\d]{0,15}$/)
  .message('Invalid phone number format');

// User and Authentication Schemas
const authSchemas = {
  oauth: Joi.object({
    authProvider: Joi.string().valid('google', 'facebook', 'apple').required(),
    authId: Joi.string().required().trim(),
    email: email.required(),
    role: Joi.string().valid('student', 'lecturer', 'admin', 'main_admin').default('student')
  }),

  clerkLogin: Joi.object({
    clerkToken: Joi.string().required()
  }),

  updateProfile: Joi.object({
    email: email,
    avatar: Joi.string().uri(),
    isPremium: Joi.boolean()
  }).min(1) // At least one field must be provided
};

// Institution Schemas
const institutionSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(200).required().trim(),
    code: Joi.string().min(2).max(20).uppercase().trim(),
    website: Joi.string().uri(),
    country: Joi.string().min(2).max(100).trim(),
    logo: Joi.string().uri(),
    academicCalendar: Joi.array().items(Joi.object({
      year: Joi.number().integer().min(2020).max(2030).required(),
      semester: Joi.number().integer().min(1).max(3).required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      examStartDate: Joi.date(),
      examEndDate: Joi.date()
    }))
  }),

  list: Joi.object({
    approved: Joi.boolean(),
    country: Joi.string().trim(),
    limit: Joi.number().integer().min(1).max(100).default(50),
    page: Joi.number().integer().min(1).default(1)
  })
};

// Group Schemas
const groupSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(200).required().trim(),
    type: Joi.string().valid('institution', 'faculty', 'school', 'department', 'course', 'year').required(),
    institution: objectId.required(),
    parentGroup: objectId,
    faculty: Joi.string().trim(),
    school: Joi.string().trim(),
    department: Joi.string().trim(),
    course: objectId,
    yearOfStudy: Joi.number().integer().min(1).max(7)
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(200).trim(),
    faculty: Joi.string().trim(),
    school: Joi.string().trim(),
    department: Joi.string().trim()
  }).min(1)
};

// Course Schemas
const courseSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(200).required().trim(),
    code: Joi.string().min(2).max(20).uppercase().trim(),
    institution: objectId.required(),
    department: Joi.string().trim(),
    duration: Joi.number().integer().min(1).max(7).default(4),
    description: Joi.string().max(1000).trim()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(200).trim(),
    code: Joi.string().min(2).max(20).uppercase().trim(),
    department: Joi.string().trim(),
    duration: Joi.number().integer().min(1).max(7),
    description: Joi.string().max(1000).trim()
  }).min(1),

  list: Joi.object({
    institution: objectId,
    department: Joi.string().trim(),
    limit: Joi.number().integer().min(1).max(100).default(50)
  })
};

// Timetable Schemas
const timetableSchemas = {
  create: Joi.object({
    group: objectId.required(),
    yearOfStudy: Joi.number().integer().min(1).max(7),
    semester: Joi.number().integer().min(1).max(3),
    academicYear: Joi.number().integer().min(2020).max(2030).required(),
    schedule: Joi.array().items(Joi.object({
      day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
      subject: objectId.required(),
      lecturer: objectId.required(),
      startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      location: Joi.string().trim(),
      isOnline: Joi.boolean().default(false)
    })).min(1).required()
  }),

  update: Joi.object({
    schedule: Joi.array().items(Joi.object({
      day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
      subject: objectId,
      lecturer: objectId,
      startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      location: Joi.string().trim(),
      isOnline: Joi.boolean()
    })).min(1)
  }).min(1)
};

// Document Schemas
const documentSchemas = {
  upload: Joi.object({
    title: Joi.string().min(1).max(200).trim(),
    type: Joi.string().valid('pdf', 'doc', 'docx', 'video', 'image', 'link'),
    description: Joi.string().max(1000).trim(),
    subject: objectId,
    tags: Joi.array().items(Joi.string().trim())
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(200).trim(),
    description: Joi.string().max(1000).trim(),
    subject: objectId,
    tags: Joi.array().items(Joi.string().trim())
  }).min(1)
};

// Assignment Schemas (for future implementation)
const assignmentSchemas = {
  create: Joi.object({
    title: Joi.string().min(1).max(200).required().trim(),
    description: Joi.string().max(5000).trim(),
    type: Joi.string().valid('assignment', 'CAT', 'exam').required(),
    subject: objectId.required(),
    group: objectId,
    dueDate: Joi.date().greater('now').required(),
    totalMarks: Joi.number().min(0).max(1000),
    attachments: Joi.array().items(Joi.string().uri())
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(200).trim(),
    description: Joi.string().max(5000).trim(),
    dueDate: Joi.date().greater('now'),
    totalMarks: Joi.number().min(0).max(1000),
    attachments: Joi.array().items(Joi.string().uri())
  }).min(1),

  submit: Joi.object({
    comment: Joi.string().max(1000).trim()
  }),

  grade: Joi.object({
    marks: Joi.number().min(0).required(),
    feedback: Joi.string().max(2000).trim(),
    gradedBy: objectId
  })
};

// Attendance Schemas (for future implementation)
const attendanceSchemas = {
  createSession: Joi.object({
    group: objectId.required(),
    subject: objectId.required(),
    lecturer: objectId,
    classType: Joi.string().valid('physical', 'online').default('physical'),
    date: Joi.date().default(() => new Date()),
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      radius: Joi.number().min(10).max(1000).default(100) // meters
    }),
    startTime: Joi.date().default(() => new Date()),
    duration: Joi.number().integer().min(30).max(480).default(90) // minutes
  }),

  markAttendance: Joi.object({
    attendanceId: objectId.required(),
    lat: Joi.number().min(-90).max(90),
    lon: Joi.number().min(-180).max(180)
  }),

  update: Joi.object({
    status: Joi.string().valid('present', 'late', 'absent'),
    notes: Joi.string().max(500).trim()
  }).min(1),

  updateRecord: Joi.object({
    status: Joi.string().valid('present', 'late', 'absent'),
    notes: Joi.string().max(500).trim()
  }).min(1)
};

// Pagination and Query Schemas
const paginationSchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().trim(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  idParam: Joi.object({
    id: objectId.required()
  })
};

module.exports = {
  // Validation helpers
  objectId,
  password,
  email,
  phoneNumber,

  // Schema collections
  authSchemas,
  institutionSchemas,
  groupSchemas,
  courseSchemas,
  timetableSchemas,
  documentSchemas,
  assignmentSchemas,
  attendanceSchemas,
  paginationSchemas
};
