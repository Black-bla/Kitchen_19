## App Overview
A student-first institutional management platform that revolutionizes the traditional boring academic systems. The app uses AI as its backbone to create an intelligent, intuitive experience. Students onboard in seconds via OAuth and simply upload their admission letter - AI extracts all profile data automatically.
Core Party Structure: Students, Lecturers, Class Admins (elected reps, course coordinators, timetable makers), and Main Admin. Students are auto-placed into nested groups (Institution → Faculty → School → Department → Course → Year), creating organized communication channels.
Key Features: The elected class admin adds courses and uploads syllabi/documents, which AI processes to structure the academic calendar. Timetables are created via drag-and-drop with assigned lecturers. When students advance years, all previous materials persist - they simply adjust the timetable. Each subject has its own AI chatbot trained on uploaded materials. Lecturers mark attendance via QR codes or location-based links. The app includes integrated online classes (Zoom-like), assignment/CAT/exam management with notifications, an in-app browser for institutional websites, a social feed where students across institutions connect and share events, and a marketplace for student commerce.
Tech Stack: React Native (Expo), Node.js/Express backend, MongoDB, Socket.io for real-time features, deployed on Vercel.

## Backend File Structure
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── ai.config.js          // OpenRouter/OpenAI switch config
│   │   └── socket.config.js
│   │
│   ├── models/
│   │   ├── User.js               // Base user schema
│   │   ├── Student.js
│   │   ├── Lecturer.js
│   │   ├── Admin.js
│   │   ├── Institution.js
│   │   ├── Group.js              // Institution/Faculty/School/Dept/Course/Year hierarchy
│   │   ├── Course.js
│   │   ├── Subject.js
│   │   ├── Timetable.js
│   │   ├── Document.js
│   │   ├── Assignment.js
│   │   ├── Attendance.js
│   │   ├── Notification.js
│   │   ├── Post.js               // Social feed
│   │   ├── Marketplace.js
│   │   ├── OnlineClass.js
│   │   └── Report.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── institution.controller.js
│   │   ├── group.controller.js
│   │   ├── course.controller.js
│   │   ├── timetable.controller.js
│   │   ├── document.controller.js
│   │   ├── assignment.controller.js
│   │   ├── attendance.controller.js
│   │   ├── notification.controller.js
│   │   ├── ai.controller.js      // AI chat, document processing, admission letter parsing
│   │   ├── onlineClass.controller.js
│   │   ├── social.controller.js
│   │   ├── marketplace.controller.js
│   │   └── admin.controller.js   // Main admin approval, AI model switching
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── institution.routes.js
│   │   ├── group.routes.js
│   │   ├── course.routes.js
│   │   ├── timetable.routes.js
│   │   ├── document.routes.js
│   │   ├── assignment.routes.js
│   │   ├── attendance.routes.js
│   │   ├── notification.routes.js
│   │   ├── ai.routes.js
│   │   ├── onlineClass.routes.js
│   │   ├── social.routes.js
│   │   ├── marketplace.routes.js
│   │   └── admin.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js    // JWT verification
│   │   ├── role.middleware.js    // Student/Lecturer/Admin permissions
│   │   ├── premium.middleware.js // Check premium status for AI/storage
│   │   ├── upload.middleware.js  // File upload handling
│   │   └── error.middleware.js
│   │
│   ├── services/
│   │   ├── ai.service.js         // OpenRouter/OpenAI integration
│   │   ├── ocr.service.js        // Admission letter parsing
│   │   ├── notification.service.js
│   │   ├── email.service.js
│   │   ├── storage.service.js    // Document storage (S3/Cloudinary)
│   │   ├── geolocation.service.js
│   │   └── payment.service.js    // Premium subscriptions
│   │
│   ├── socket/
│   │   ├── socket.js             // Socket.io setup
│   │   ├── onlineClass.socket.js // Real-time class events
│   │   ├── chat.socket.js        // Real-time messaging
│   │   └── notification.socket.js
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   └── app.js                    // Express app setup
│
├── .env
├── .gitignore
├── package.json
└── server.js                     // Entry point

Quick Notes:

Groups model handles the nested hierarchy (Institution → Year)
AI service switches between free/premium models based on user subscription
Socket folder manages real-time features (classes, notifications, chat)
Storage service handles document uploads with quota checks (free vs premium)
OCR service processes admission letters for auto-profile completion

## MongoDB Schemas
// models/User.js
const userSchema = new Schema({
  authProvider: { type: String, enum: ['google', 'facebook', 'apple'], required: true },
  authId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'lecturer', 'admin', 'main_admin'], required: true },
  profileComplete: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  premiumExpiresAt: Date,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

// models/Student.js
const studentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  admissionLetter: String, // URL to uploaded letter
  studentId: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
  faculty: String,
  school: String,
  department: String,
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  yearOfStudy: Number,
  enrollmentDate: Date,
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }], // All groups student belongs to
  storageUsed: { type: Number, default: 0 }, // In MB
  storageLimit: { type: Number, default: 500 } // Free tier limit
});

// models/Lecturer.js
const lectureSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: String,
  lastName: String,
  employeeId: String,
  phoneNumber: String,
  institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
  department: String,
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  specialization: String
});

// models/Admin.js
const adminSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adminType: { 
    type: String, 
    enum: ['class_rep', 'course_coordinator', 'timetable_maker', 'faculty_admin', 'main_admin'],
    required: true 
  },
  institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
  group: { type: Schema.Types.ObjectId, ref: 'Group' }, // Specific group they manage
  permissions: [{
    type: String,
    enum: [
      'manage_courses', 'manage_timetable', 'manage_documents', 
      'manage_students', 'approve_users', 'send_notifications',
      'manage_elections', 'view_reports'
    ]
  }],
  electedAt: Date, // For class reps
  termEndsAt: Date // For elected positions
});

// models/Institution.js
const institutionSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true }, // e.g., "UON"
  logo: String,
  website: String,
  country: String,
  approved: { type: Boolean, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  approvedAt: Date,
  academicCalendar: [{
    year: Number,
    semester: Number,
    startDate: Date,
    endDate: Date,
    examStartDate: Date,
    examEndDate: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

// models/Group.js
const groupSchema = new Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['institution', 'faculty', 'school', 'department', 'course', 'year'],
    required: true 
  },
  institution: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  parentGroup: { type: Schema.Types.ObjectId, ref: 'Group' }, // Hierarchical structure
  faculty: String,
  school: String,
  department: String,
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  yearOfStudy: Number,
  members: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['student', 'lecturer', 'admin'] },
    joinedAt: { type: Date, default: Date.now }
  }],
  admins: [{ type: Schema.Types.ObjectId, ref: 'Admin' }],
  createdAt: { type: Date, default: Date.now }
});

// models/Course.js
const courseSchema = new Schema({
  name: { type: String, required: true },
  code: String,
  institution: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  department: String,
  duration: Number, // In years
  description: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

// models/Subject.js
const subjectSchema = new Schema({
  name: { type: String, required: true },
  code: String,
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  yearOfStudy: Number,
  semester: Number,
  lecturer: { type: Schema.Types.ObjectId, ref: 'Lecturer' },
  syllabus: String, // AI-processed syllabus
  courseOutline: String,
  documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
  aiChatEnabled: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

// models/Document.js
const documentSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'doc', 'video', 'image', 'link'], required: true },
  url: String,
  fileSize: Number, // In bytes
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  aiProcessed: { type: Boolean, default: false },
  aiEmbeddings: [Number], // Vector embeddings for AI chat
  description: String,
  uploadedAt: { type: Date, default: Date.now }
});

// models/Timetable.js
const timetableSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  yearOfStudy: Number,
  semester: Number,
  academicYear: Number,
  schedule: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    lecturer: { type: Schema.Types.ObjectId, ref: 'Lecturer' },
    startTime: String, // "08:00"
    endTime: String,   // "10:00"
    location: String,
    isOnline: { type: Boolean, default: false }
  }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// models/Assignment.js
const assignmentSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['assignment', 'CAT', 'exam'], required: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group' },
  dueDate: { type: Date, required: true },
  totalMarks: Number,
  attachments: [String], // URLs
  submissions: [{
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    submittedAt: Date,
    fileUrl: String,
    marks: Number,
    feedback: String
  }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// models/Attendance.js
const attendanceSchema = new Schema({
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  lecturer: { type: Schema.Types.ObjectId, ref: 'Lecturer', required: true },
  date: { type: Date, required: true },
  classType: { type: String, enum: ['physical', 'online'], required: true },
  location: {
    lat: Number,
    lng: Number,
    radius: { type: Number, default: 100 } // meters
  },
  qrCode: String, // Generated QR code for scanning
  qrExpiry: Date,
  records: [{
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    status: { type: String, enum: ['present', 'absent', 'late', 'excused'], default: 'absent' },
    markedAt: Date,
    markedBy: { type: String, enum: ['student', 'lecturer'], default: 'student' },
    excuseReason: String,
    location: {
      lat: Number,
      lng: Number
    }
  }],
  autoMarkTime: Date, // Time after which all unmarked are absent
  createdAt: { type: Date, default: Date.now }
});

// models/OnlineClass.js
const onlineClassSchema = new Schema({
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  lecturer: { type: Schema.Types.ObjectId, ref: 'Lecturer', required: true },
  title: String,
  scheduledAt: Date,
  startedAt: Date,
  endedAt: Date,
  status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
  roomId: { type: String, unique: true }, // For WebRTC/Socket.io room
  participants: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    joinedAt: Date,
    leftAt: Date
  }],
  recording: String, // URL if recorded
  attendance: { type: Schema.Types.ObjectId, ref: 'Attendance' }
});

// models/Notification.js
const notificationSchema = new Schema({
  type: { 
    type: String, 
    enum: ['class_reminder', 'assignment', 'timetable_change', 'announcement', 'exam', 'general'],
    required: true 
  },
  title: { type: String, required: true },
  message: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  target: {
    type: { type: String, enum: ['individual', 'group'], required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    group: { type: Schema.Types.ObjectId, ref: 'Group' }
  },
  scheduleRule: {
    type: { type: String, enum: ['immediate', 'before_class', 'before_due', 'scheduled'] },
    minutesBefore: Number, // e.g., 60 for 1hr before
    scheduledAt: Date
  },
  relatedTo: {
    model: { type: String, enum: ['Assignment', 'OnlineClass', 'Timetable', 'Subject'] },
    id: Schema.Types.ObjectId
  },
  read: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: Date
  }],
  sentAt: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// models/Post.js
const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  media: [{
    type: { type: String, enum: ['image', 'video'] },
    url: String
  }],
  isEvent: { type: Boolean, default: false },
  eventDetails: {
    title: String,
    date: Date,
    location: String,
    institution: { type: Schema.Types.ObjectId, ref: 'Institution' }
  },
  visibility: { 
    type: String, 
    enum: ['public', 'institution', 'group'], 
    default: 'public' 
  },
  group: { type: Schema.Types.ObjectId, ref: 'Group' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// models/Marketplace.js
const marketplaceSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true },
  description: String,
  category: { 
    type: String, 
    enum: ['books', 'electronics', 'clothing', 'services', 'other'] 
  },
  price: { type: Number, required: true },
  currency: { type: String, default: 'KES' },
  images: [String],
  condition: { type: String, enum: ['new', 'used', 'refurbished'] },
  status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
  institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
  location: String,
  contactInfo: {
    phone: String,
    email: String,
    preferredContact: { type: String, enum: ['phone', 'email', 'inapp'] }
  },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// models/Report.js
const reportSchema = new Schema({
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reportType: { 
    type: String, 
    enum: ['admin_abuse', 'inappropriate_content', 'harassment', 'spam', 'other'],
    required: true 
  },
  targetType: { 
    type: String, 
    enum: ['user', 'post', 'marketplace_item', 'admin'],
    required: true 
  },
  targetId: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  evidence: [String], // URLs to screenshots/files
  status: { 
    type: String, 
    enum: ['pending', 'under_review', 'resolved', 'dismissed'],
    default: 'pending' 
  },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  resolution: String,
  resolvedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// models/AIChat.js
const aiChatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' }, // Subject-specific chat
  model: { type: String, enum: ['free', 'premium'], default: 'free' },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  tokensUsed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: Date
});

## API Endpoints
// routes/auth.routes.js
POST   /api/auth/oauth                    // OAuth login (Google/Facebook/Apple)
POST   /api/auth/upload-admission         // Upload admission letter for profile completion
GET    /api/auth/me                       // Get current user
POST   /api/auth/logout                   // Logout
POST   /api/auth/refresh-token            // Refresh JWT token

// routes/user.routes.js
GET    /api/users/profile                 // Get user profile
PUT    /api/users/profile                 // Update profile
GET    /api/users/:id                     // Get user by ID
DELETE /api/users/account                 // Delete account

// routes/institution.routes.js
POST   /api/institutions                  // Create institution (requires approval)
GET    /api/institutions                  // Get all approved institutions
GET    /api/institutions/:id              // Get institution details
PUT    /api/institutions/:id              // Update institution (admin only)
GET    /api/institutions/:id/calendar     // Get academic calendar
PUT    /api/institutions/:id/calendar     // Update academic calendar

// routes/admin.routes.js (Main Admin)
GET    /api/admin/pending-institutions    // Get institutions awaiting approval
PUT    /api/admin/institutions/:id/approve // Approve institution
GET    /api/admin/ai-config               // Get AI model config (OpenRouter/OpenAI)
PUT    /api/admin/ai-config               // Switch AI provider
GET    /api/admin/reports                 // Get all reports
PUT    /api/admin/reports/:id/resolve     // Resolve report
GET    /api/admin/analytics               // Platform-wide analytics

// routes/group.routes.js
POST   /api/groups                        // Create group (admin)
GET    /api/groups/my-groups              // Get user's groups
GET    /api/groups/:id                    // Get group details
GET    /api/groups/:id/members            // Get group members
POST   /api/groups/:id/members            // Add members (admin)
DELETE /api/groups/:id/members/:userId    // Remove member (admin)
POST   /api/groups/:id/elections          // Start class rep election
POST   /api/groups/:id/vote               // Vote for class rep
GET    /api/groups/:id/election-results   // Get election results

// routes/course.routes.js
POST   /api/courses                       // Create course (admin)
GET    /api/courses                       // Get all courses (filter by institution)
GET    /api/courses/:id                   // Get course details
PUT    /api/courses/:id                   // Update course (admin)
DELETE /api/courses/:id                   // Delete course (admin)
GET    /api/courses/:id/years/:year       // Get course structure for specific year

// routes/subject.routes.js
POST   /api/subjects                      // Create subject (admin)
GET    /api/subjects                      // Get subjects (filter by course/year)
GET    /api/subjects/:id                  // Get subject details
PUT    /api/subjects/:id                  // Update subject (admin)
DELETE /api/subjects/:id                  // Delete subject (admin)
POST   /api/subjects/:id/syllabus         // Upload syllabus (AI processes)
GET    /api/subjects/:id/documents        // Get subject documents
POST   /api/subjects/:id/lecturer         // Assign lecturer (admin)

// routes/document.routes.js
POST   /api/documents                     // Upload document (admin/lecturer)
GET    /api/documents/:id                 // Get document
PUT    /api/documents/:id                 // Update document
DELETE /api/documents/:id                 // Delete document
POST   /api/documents/bulk-upload         // Bulk upload documents
GET    /api/documents/subject/:subjectId  // Get all subject documents

// routes/timetable.routes.js
POST   /api/timetables                    // Create timetable (drag-drop data)
GET    /api/timetables/group/:groupId     // Get group timetable
GET    /api/timetables/my-timetable       // Get student's timetable
PUT    /api/timetables/:id                // Update timetable (admin)
DELETE /api/timetables/:id/slot/:slotId   // Delete timetable slot
POST   /api/timetables/:id/clone          // Clone timetable for new year

// routes/assignment.routes.js
POST   /api/assignments                   // Create assignment/CAT/exam (lecturer)
GET    /api/assignments                   // Get assignments (filter by subject/group)
GET    /api/assignments/:id               // Get assignment details
PUT    /api/assignments/:id               // Update assignment (lecturer)
DELETE /api/assignments/:id               // Delete assignment (lecturer)
POST   /api/assignments/:id/submit        // Submit assignment (student)
GET    /api/assignments/:id/submissions   // Get all submissions (lecturer)
PUT    /api/assignments/:id/submissions/:submissionId/grade // Grade submission
GET    /api/assignments/my-submissions    // Get student's submissions

// routes/attendance.routes.js
POST   /api/attendance/create             // Create attendance session (lecturer)
GET    /api/attendance/subject/:subjectId // Get subject attendance records
GET    /api/attendance/:id                // Get attendance session
POST   /api/attendance/:id/generate-qr    // Generate QR code for attendance
POST   /api/attendance/:id/mark           // Mark attendance (student/lecturer)
PUT    /api/attendance/:id/excuse         // Submit excuse for absence
PUT    /api/attendance/:id/approve-excuse // Approve excuse (lecturer)
GET    /api/attendance/:id/report         // Get attendance report
GET    /api/attendance/student/:studentId // Get student attendance stats

// routes/onlineClass.routes.js
POST   /api/online-classes                // Schedule online class (lecturer)
GET    /api/online-classes                // Get scheduled classes
GET    /api/online-classes/:id            // Get class details
PUT    /api/online-classes/:id/start      // Start class (lecturer)
PUT    /api/online-classes/:id/end        // End class (lecturer)
POST   /api/online-classes/:id/join       // Join class (student/lecturer)
POST   /api/online-classes/:id/leave      // Leave class
GET    /api/online-classes/:id/participants // Get current participants

// routes/notification.routes.js
POST   /api/notifications                 // Create notification (admin/lecturer)
GET    /api/notifications/my-notifications // Get user notifications
PUT    /api/notifications/:id/read        // Mark as read
DELETE /api/notifications/:id             // Delete notification
PUT    /api/notifications/read-all        // Mark all as read
GET    /api/notifications/group/:groupId  // Get group notifications

// routes/ai.routes.js
POST   /api/ai/chat                       // AI chat (subject-specific or general)
GET    /api/ai/chat/:subjectId/history    // Get chat history for subject
POST   /api/ai/process-admission          // AI process admission letter
POST   /api/ai/process-syllabus           // AI process syllabus
POST   /api/ai/process-document           // AI process document for embeddings
POST   /api/ai/ask-document               // Ask questions about documents
GET    /api/ai/usage                      // Get user AI usage stats

// routes/social.routes.js
POST   /api/social/posts                  // Create post/event
GET    /api/social/posts                  // Get feed (filter by visibility)
GET    /api/social/posts/:id              // Get post details
PUT    /api/social/posts/:id              // Update post
DELETE /api/social/posts/:id              // Delete post
POST   /api/social/posts/:id/like         // Like post
DELETE /api/social/posts/:id/like         // Unlike post
POST   /api/social/posts/:id/comment      // Comment on post
DELETE /api/social/posts/:id/comment/:commentId // Delete comment
GET    /api/social/events                 // Get upcoming events
GET    /api/social/posts/institution/:id  // Get institution-specific posts

// routes/marketplace.routes.js
POST   /api/marketplace/items             // Create listing
GET    /api/marketplace/items             // Get all listings (filter by category/institution)
GET    /api/marketplace/items/:id         // Get item details
PUT    /api/marketplace/items/:id         // Update listing
DELETE /api/marketplace/items/:id         // Delete listing
PUT    /api/marketplace/items/:id/status  // Update status (sold/reserved)
POST   /api/marketplace/items/:id/view    // Increment view count
GET    /api/marketplace/my-listings       // Get user's listings

// routes/report.routes.js
POST   /api/reports                       // Submit report
GET    /api/reports/my-reports            // Get user's submitted reports
GET    /api/reports/:id                   // Get report details
PUT    /api/reports/:id                   // Update report status (admin)

// routes/payment.routes.js
POST   /api/payments/subscribe            // Subscribe to premium
POST   /api/payments/webhook              // Payment provider webhook
GET    /api/payments/subscription         // Get subscription status
POST   /api/payments/cancel               // Cancel subscription

// routes/storage.routes.js
GET    /api/storage/usage                 // Get storage usage
POST   /api/storage/upload                // Upload file
DELETE /api/storage/files/:id             // Delete file

## WebSocket Events (Socket.io)
// Namespaces and Events

// /online-class namespace
connection
  - join-class { classId, userId }
  - leave-class { classId, userId }
  - participant-joined { user }
  - participant-left { user }
  - class-started { classId }
  - class-ended { classId }
  - raise-hand { userId }
  - lower-hand { userId }

// /notifications namespace
connection
  - subscribe-notifications { userId }
  - new-notification { notification }
  - notification-read { notificationId }

// /chat namespace (for AI chats, group chats)
connection
  - join-room { roomId }
  - send-message { roomId, message }
  - receive-message { message }
  - typing { userId, roomId }
  - stop-typing { userId, roomId }

// /attendance namespace
connection
  - attendance-session-created { sessionId, groupId }
  - qr-code-generated { sessionId, qrCode, expiry }
  - attendance-marked { studentId, status }

  ## Middleware Implementations

```javascript
// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-__v');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-__v');
    }

    next();
  } catch (error) {
    next();
  }
};
```

```javascript
// middleware/role.middleware.js
const Student = require('../models/Student');
const Lecturer = require('../models/Lecturer');
const Admin = require('../models/Admin');

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Access denied. Students only' });
    }

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    req.student = student;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.isLecturer = async (req, res, next) => {
  try {
    if (req.user.role !== 'lecturer') {
      return res.status(403).json({ success: false, message: 'Access denied. Lecturers only' });
    }

    const lecturer = await Lecturer.findOne({ userId: req.user._id });
    if (!lecturer) {
      return res.status(404).json({ success: false, message: 'Lecturer profile not found' });
    }

    req.lecturer = lecturer;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (!['admin', 'main_admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied. Admins only' });
    }

    const admin = await Admin.findOne({ userId: req.user._id });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin profile not found' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.isMainAdmin = (req, res, next) => {
  if (req.user.role !== 'main_admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Main admin only' });
  }
  next();
};

exports.hasPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === 'main_admin') {
        return next();
      }

      const admin = await Admin.findOne({ userId: req.user._id });
      
      if (!admin || !admin.permissions.includes(permission)) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Requires permission: ${permission}` 
        });
      }

      req.admin = admin;
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
};

exports.canManageGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId || req.body.groupId;
    
    if (req.user.role === 'main_admin') {
      return next();
    }

    const admin = await Admin.findOne({ userId: req.user._id });
    
    if (!admin) {
      return res.status(403).json({ success: false, message: 'Not an admin' });
    }

    if (admin.group.toString() !== groupId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only manage your assigned group' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
```

```javascript
// middleware/premium.middleware.js
const User = require('../models/User');

exports.requirePremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.isPremium) {
      return res.status(403).json({ 
        success: false, 
        message: 'Premium subscription required',
        upgradeUrl: '/api/payments/subscribe'
      });
    }

    if (user.premiumExpiresAt && new Date(user.premiumExpiresAt) < new Date()) {
      user.isPremium = false;
      await user.save();
      
      return res.status(403).json({ 
        success: false, 
        message: 'Premium subscription expired',
        upgradeUrl: '/api/payments/subscribe'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkPremiumFeature = (feature) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      const premiumFeatures = {
        'premium_ai': !user.isPremium,
        'extra_storage': !user.isPremium,
        'advanced_analytics': !user.isPremium
      };

      if (premiumFeatures[feature]) {
        return res.status(403).json({ 
          success: false, 
          message: `${feature.replace('_', ' ')} is a premium feature`,
          feature,
          upgradeUrl: '/api/payments/subscribe'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
};
```

```javascript
// middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');
const Student = require('../models/Student');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|mp4|mov/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: images, PDFs, documents, videos'));
  }
};

exports.upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter
});

exports.checkStorageLimit = async (req, res, next) => {
  try {
    if (!req.file && !req.files) {
      return next();
    }

    const student = await Student.findOne({ userId: req.user._id });
    
    if (!student) {
      return next();
    }

    const fileSize = req.file ? req.file.size : 
                     req.files ? req.files.reduce((acc, f) => acc + f.size, 0) : 0;
    
    const fileSizeMB = fileSize / (1024 * 1024);
    const newUsage = student.storageUsed + fileSizeMB;

    if (newUsage > student.storageLimit) {
      return res.status(403).json({ 
        success: false, 
        message: 'Storage limit exceeded',
        currentUsage: student.storageUsed,
        limit: student.storageLimit,
        requiredSpace: fileSizeMB,
        upgradeUrl: '/api/payments/subscribe'
      });
    }

    req.fileSize = fileSizeMB;
    req.student = student;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
```

```javascript
// middleware/error.middleware.js
exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      success: false, 
      message: 'Validation error',
      errors: messages 
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid ID format' 
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ 
      success: false, 
      message: `${field} already exists` 
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      success: false, 
      message: 'Token expired' 
    });
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File size too large. Max 100MB' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

exports.notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};
```

```javascript
// middleware/validation.middleware.js
const { body, param, query, validationResult } = require('express-validator');

exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  };
};

// Common validation rules
exports.rules = {
  email: body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  password: body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  objectId: (field) => param(field).isMongoId().withMessage('Invalid ID'),
  objectIdBody: (field) => body(field).isMongoId().withMessage('Invalid ID'),
  required: (field) => body(field).notEmpty().withMessage(`${field} is required`),
  optionalEmail: body('email').optional().isEmail().normalizeEmail(),
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100')
  ]
};
```

```javascript
// middleware/rateLimiter.middleware.js
const rateLimit = require('express-rate-limit');

exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' }
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts, please try again later' }
});

exports.aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Free tier limit
  message: { 
    success: false, 
    message: 'AI usage limit reached. Upgrade to premium for unlimited access',
    upgradeUrl: '/api/payments/subscribe'
  },
  skip: (req) => req.user && req.user.isPremium // Skip for premium users
});

exports.uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Upload limit reached, please try again later' }
});
```

## Controller Implementations

```javascript
// controllers/auth.controller.js
const User = require('../models/User');
const Student = require('../models/Student');
const Lecturer = require('../models/Lecturer');
const jwt = require('jsonwebtoken');
const { verifyGoogleToken, verifyFacebookToken, verifyAppleToken } = require('../utils/oauth');
const aiService = require('../services/ai.service');
const storageService = require('../services/storage.service');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.oauthLogin = async (req, res, next) => {
  try {
    const { provider, token, role } = req.body;

    let profile;
    switch (provider) {
      case 'google':
        profile = await verifyGoogleToken(token);
        break;
      case 'facebook':
        profile = await verifyFacebookToken(token);
        break;
      case 'apple':
        profile = await verifyAppleToken(token);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid provider' });
    }

    let user = await User.findOne({ authId: profile.id, authProvider: provider });

    if (!user) {
      user = await User.create({
        authProvider: provider,
        authId: profile.id,
        email: profile.email,
        role: role || 'student',
        avatar: profile.picture,
        profileComplete: false
      });

      // Create role-specific profile
      if (role === 'student') {
        await Student.create({ userId: user._id });
      } else if (role === 'lecturer') {
        await Lecturer.create({ userId: user._id });
      }
    }

    const accessToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user,
        token: accessToken,
        profileComplete: user.profileComplete
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadAdmissionLetter = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload to storage
    const fileUrl = await storageService.uploadFile(req.file, 'admission-letters');

    // Process with AI to extract data
    const extractedData = await aiService.processAdmissionLetter(req.file.buffer);

    // Update student profile
    const student = await Student.findOne({ userId: req.user._id });
    
    student.admissionLetter = fileUrl;
    student.firstName = extractedData.firstName;
    student.lastName = extractedData.lastName;
    student.studentId = extractedData.studentId;
    student.institution = extractedData.institutionId;
    student.faculty = extractedData.faculty;
    student.school = extractedData.school;
    student.department = extractedData.department;
    student.course = extractedData.courseId;
    student.yearOfStudy = extractedData.yearOfStudy;
    student.enrollmentDate = extractedData.enrollmentDate;

    await student.save();

    // Update user profile completion
    const user = await User.findById(req.user._id);
    user.profileComplete = true;
    await user.save();

    // Auto-add to groups
    const groupService = require('../services/group.service');
    await groupService.autoAssignGroups(student);

    res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      data: { student, user }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    let profile;

    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id })
        .populate('institution course groups');
    } else if (user.role === 'lecturer') {
      profile = await Lecturer.findOne({ userId: user._id })
        .populate('institution subjects');
    } else if (user.role === 'admin' || user.role === 'main_admin') {
      profile = await Admin.findOne({ userId: user._id })
        .populate('institution group');
    }

    res.status(200).json({
      success: true,
      data: { user, profile }
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // In a real app, you might blacklist the token here
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const user = req.user;
    const newToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: { token: newToken }
    });
  } catch (error) {
    next(error);
  }
};
```

```javascript
// controllers/group.controller.js
const Group = require('../models/Group');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const notificationService = require('../services/notification.service');

exports.createGroup = async (req, res, next) => {
  try {
    const { name, type, institution, parentGroup, faculty, school, department, course, yearOfStudy } = req.body;

    const group = await Group.create({
      name,
      type,
      institution,
      parentGroup,
      faculty,
      school,
      department,
      course,
      yearOfStudy,
      admins: [req.admin._id]
    });

    res.status(201).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyGroups = async (req, res, next) => {
  try {
    let groups;

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      groups = await Group.find({ _id: { $in: student.groups } })
        .populate('institution course')
        .sort({ type: 1 });
    } else {
      groups = await Group.find({ 'members.user': req.user._id })
        .populate('institution course')
        .sort({ type: 1 });
    }

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    next(error);
  }
};

exports.getGroupDetails = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('institution course parentGroup admins')
      .populate({
        path: 'members.user',
        select: 'email avatar'
      });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

exports.getGroupMembers = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate({
        path: 'members.user',
        select: 'email avatar role'
      });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.status(200).json({
      success: true,
      count: group.members.length,
      data: group.members
    });
  } catch (error) {
    next(error);
  }
};

exports.addMembers = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const newMembers = userIds.map(userId => ({
      user: userId,
      role: 'student',
      joinedAt: new Date()
    }));

    group.members.push(...newMembers);
    await group.save();

    res.status(200).json({
      success: true,
      message: 'Members added successfully',
      data: group
    });
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    group.members = group.members.filter(m => m.user.toString() !== userId);
    await group.save();

    res.status(200).json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.startElection = async (req, res, next) => {
  try {
    const { candidates, endDate } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    group.election = {
      active: true,
      candidates: candidates.map(c => ({ student: c, votes: 0 })),
      endDate,
      voters: []
    };

    await group.save();

    // Send notification to group
    await notificationService.sendGroupNotification(group._id, {
      type: 'announcement',
      title: 'Class Rep Election Started',
      message: 'Vote for your class representative now!'
    });

    res.status(200).json({
      success: true,
      message: 'Election started',
      data: group.election
    });
  } catch (error) {
    next(error);
  }
};

exports.vote = async (req, res, next) => {
  try {
    const { candidateId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group || !group.election || !group.election.active) {
      return res.status(400).json({ success: false, message: 'No active election' });
    }

    if (new Date() > new Date(group.election.endDate)) {
      return res.status(400).json({ success: false, message: 'Election has ended' });
    }

    if (group.election.voters.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You have already voted' });
    }

    const candidate = group.election.candidates.find(c => c.student.toString() === candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    candidate.votes += 1;
    group.election.voters.push(req.user._id);
    await group.save();

    res.status(200).json({
      success: true,
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getElectionResults = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('election.candidates.student');

    if (!group || !group.election) {
      return res.status(404).json({ success: false, message: 'No election found' });
    }

    const results = {
      active: group.election.active,
      endDate: group.election.endDate,
      totalVotes: group.election.voters.length,
      candidates: group.election.candidates.sort((a, b) => b.votes - a.votes)
    };

    // If election ended, declare winner and create admin
    if (new Date() > new Date(group.election.endDate) && group.election.active) {
      const winner = results.candidates[0];
      
      await Admin.create({
        userId: winner.student.userId,
        adminType: 'class_rep',
        institution: group.institution,
        group: group._id,
        permissions: ['manage_courses', 'manage_timetable', 'manage_documents', 'send_notifications'],
        electedAt: new Date(),
        termEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year term
      });

      group.election.active = false;
      group.admins.push(winner.student.userId);
      await group.save();

      results.winner = winner;
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};
```

```javascript
// controllers/subject.controller.js
const Subject = require('../models/Subject');
const Document = require('../models/Document');
const aiService = require('../services/ai.service');
const storageService = require('../services/storage.service');

exports.createSubject = async (req, res, next) => {
  try {
    const { name, code, course, yearOfStudy, semester, lecturer } = req.body;

    const subject = await Subject.create({
      name,
      code,
      course,
      yearOfStudy,
      semester,
      lecturer,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubjects = async (req, res, next) => {
  try {
    const { course, yearOfStudy, semester } = req.query;
    
    const query = {};
    if (course) query.course = course;
    if (yearOfStudy) query.yearOfStudy = yearOfStudy;
    if (semester) query.semester = semester;

    const subjects = await Subject.find(query)
      .populate('course lecturer')
      .sort({ yearOfStudy: 1, semester: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubjectDetails = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('course lecturer documents');

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Delete associated documents
    await Document.deleteMany({ subject: subject._id });

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadSyllabus = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Upload file
    const fileUrl = await storageService.uploadFile(req.file, 'syllabi');

    // Process with AI to extract course outline
    const processedData = await aiService.processSyllabus(req.file.buffer);

    subject.syllabus = fileUrl;
    subject.courseOutline = processedData.outline;
    await subject.save();

    res.status(200).json({
      success: true,
      message: 'Syllabus uploaded and processed',
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubjectDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ subject: req.params.id })
      .populate('uploadedBy', 'email avatar')
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

exports.assignLecturer = async (req, res, next) => {
  try {
    const { lecturerId } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    subject.lecturer = lecturerId;
    await subject.save();

    res.status(200).json({
      success: true,
      message: 'Lecturer assigned successfully',
      data: subject
    });
  } catch (error) {
    next(error);
  }
};
```
```javascript
// controllers/timetable.controller.js
const Timetable = require('../models/Timetable');
const Subject = require('../models/Subject');
const Group = require('../models/Group');
const notificationService = require('../services/notification.service');

exports.createTimetable = async (req, res, next) => {
  try {
    const { group, yearOfStudy, semester, academicYear, schedule } = req.body;

    // Validate that subjects and lecturers exist
    for (const slot of schedule) {
      const subject = await Subject.findById(slot.subject);
      if (!subject) {
        return res.status(404).json({ 
          success: false, 
          message: `Subject ${slot.subject} not found` 
        });
      }
    }

    const timetable = await Timetable.create({
      group,
      yearOfStudy,
      semester,
      academicYear,
      schedule,
      createdBy: req.user._id
    });

    // Send notification to group
    await notificationService.sendGroupNotification(group, {
      type: 'timetable_change',
      title: 'New Timetable Created',
      message: 'A new timetable has been created for your class',
      relatedTo: { model: 'Timetable', id: timetable._id }
    });

    res.status(201).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

exports.getGroupTimetable = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { semester, academicYear } = req.query;

    const query = { group: groupId };
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;

    const timetable = await Timetable.findOne(query)
      .populate('schedule.subject schedule.lecturer')
      .sort({ createdAt: -1 });

    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Timetable not found' });
    }

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyTimetable = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Find the most specific group (year level)
    const yearGroup = await Group.findOne({
      type: 'year',
      course: student.course,
      yearOfStudy: student.yearOfStudy
    });

    if (!yearGroup) {
      return res.status(404).json({ success: false, message: 'Class group not found' });
    }

    const timetable = await Timetable.findOne({ group: yearGroup._id })
      .populate('schedule.subject schedule.lecturer')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTimetable = async (req, res, next) => {
  try {
    const { schedule } = req.body;

    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Timetable not found' });
    }

    timetable.schedule = schedule;
    timetable.updatedAt = new Date();
    await timetable.save();

    // Notify group about timetable change
    await notificationService.sendGroupNotification(timetable.group, {
      type: 'timetable_change',
      title: 'Timetable Updated',
      message: 'Your class timetable has been updated. Please check the changes.',
      relatedTo: { model: 'Timetable', id: timetable._id }
    });

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTimeSlot = async (req, res, next) => {
  try {
    const { id, slotId } = req.params;

    const timetable = await Timetable.findById(id);

    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Timetable not found' });
    }

    timetable.schedule = timetable.schedule.filter(slot => slot._id.toString() !== slotId);
    await timetable.save();

    res.status(200).json({
      success: true,
      message: 'Time slot deleted',
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

exports.cloneTimetable = async (req, res, next) => {
  try {
    const { newYear, newSemester, newAcademicYear } = req.body;

    const oldTimetable = await Timetable.findById(req.params.id);

    if (!oldTimetable) {
      return res.status(404).json({ success: false, message: 'Timetable not found' });
    }

    const newTimetable = await Timetable.create({
      group: oldTimetable.group,
      yearOfStudy: newYear || oldTimetable.yearOfStudy,
      semester: newSemester || oldTimetable.semester,
      academicYear: newAcademicYear || oldTimetable.academicYear,
      schedule: oldTimetable.schedule,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Timetable cloned successfully',
      data: newTimetable
    });
  } catch (error) {
    next(error);
  }
};
```

```javascript
// controllers/assignment.controller.js
const Assignment = require('../models/Assignment');
const Subject = require('../models/Subject');
const Group = require('../models/Group');
const notificationService = require('../services/notification.service');
const storageService = require('../services/storage.service');
const emailService = require('../services/email.service');

exports.createAssignment = async (req, res, next) => {
  try {
    const { title, description, type, subject, group, dueDate, totalMarks } = req.body;

    let attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await storageService.uploadFile(file, 'assignments');
        attachments.push(url);
      }
    }

    const assignment = await Assignment.create({
      title,
      description,
      type,
      subject,
      group,
      dueDate,
      totalMarks,
      attachments,
      createdBy: req.user._id
    });

    // Schedule notification based on due date
    const daysBefore = type === 'exam' ? 7 : type === 'CAT' ? 3 : 1;
    const notificationDate = new Date(dueDate);
    notificationDate.setDate(notificationDate.getDate() - daysBefore);

    await notificationService.scheduleGroupNotification(group, {
      type: 'assignment',
      title: `${type.toUpperCase()}: ${title}`,
      message: `${type} "${title}" is due in ${daysBefore} day(s)`,
      scheduledAt: notificationDate,
      relatedTo: { model: 'Assignment', id: assignment._id }
    });

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

exports.getAssignments = async (req, res, next) => {
  try {
    const { subject, group, type, status } = req.query;

    const query = {};
    if (subject) query.subject = subject;
    if (group) query.group = group;
    if (type) query.type = type;

    const assignments = await Assignment.find(query)
      .populate('subject group createdBy', 'name title email')
      .sort({ dueDate: 1 });

    // Filter by status if requested
    let filteredAssignments = assignments;
    if (status === 'pending') {
      filteredAssignments = assignments.filter(a => new Date(a.dueDate) > new Date());
    } else if (status === 'overdue') {
      filteredAssignments = assignments.filter(a => new Date(a.dueDate) < new Date());
    }

    res.status(200).json({
      success: true,
      count: filteredAssignments.length,
      data: filteredAssignments
    });
  } catch (error) {
    next(error);
  }
};

exports.getAssignmentDetails = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject group createdBy submissions.student');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Notify students of changes
    await notificationService.sendGroupNotification(assignment.group, {
      type: 'assignment',
      title: 'Assignment Updated',
      message: `The assignment "${assignment.title}" has been updated`,
      relatedTo: { model: 'Assignment', id: assignment._id }
    });

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.submitAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      s => s.student.toString() === req.student._id.toString()
    );

    if (existingSubmission) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already submitted this assignment' 
      });
    }

    // Upload file
    let fileUrl = null;
    if (req.file) {
      fileUrl = await storageService.uploadFile(req.file, 'submissions');
      
      // Update student storage usage
      req.student.storageUsed += req.fileSize;
      await req.student.save();
    }

    // Add submission
    assignment.submissions.push({
      student: req.student._id,
      submittedAt: new Date(),
      fileUrl
    });

    await assignment.save();

    // Send email to lecturer
    const lecturer = await Lecturer.findById(assignment.subject.lecturer)
      .populate('userId');
    
    if (lecturer) {
      await emailService.sendSubmissionNotification(
        lecturer.userId.email,
        assignment.title,
        req.user.email
      );
    }

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('submissions.student');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.status(200).json({
      success: true,
      count: assignment.submissions.length,
      data: assignment.submissions
    });
  } catch (error) {
    next(error);
  }
};

exports.gradeSubmission = async (req, res, next) => {
  try {
    const { marks, feedback } = req.body;
    const { id, submissionId } = req.params;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const submission = assignment.submissions.id(submissionId);

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.marks = marks;
    submission.feedback = feedback;
    await assignment.save();

    // Notify student
    await notificationService.sendNotification(submission.student, {
      type: 'assignment',
      title: 'Assignment Graded',
      message: `Your submission for "${assignment.title}" has been graded: ${marks}/${assignment.totalMarks}`,
      relatedTo: { model: 'Assignment', id: assignment._id }
    });

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

exports.getMySubmissions = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ 
      'submissions.student': req.student._id 
    })
      .populate('subject')
      .sort({ dueDate: -1 });

    const mySubmissions = assignments.map(assignment => {
      const submission = assignment.submissions.find(
        s => s.student.toString() === req.student._id.toString()
      );
      return {
        assignment: {
          _id: assignment._id,
          title: assignment.title,
          type: assignment.type,
          dueDate: assignment.dueDate,
          totalMarks: assignment.totalMarks,
          subject: assignment.subject
        },
        submission
      };
    });

    res.status(200).json({
      success: true,
      count: mySubmissions.length,
      data: mySubmissions
    });
  } catch (error) {
    next(error);
  }
};
```

```javascript
// controllers/attendance.controller.js
const Attendance = require('../models/Attendance');
const OnlineClass = require('../models/OnlineClass');
const QRCode = require('qrcode');
const crypto = require('crypto');
const geolib = require('geolib');

exports.createAttendanceSession = async (req, res, next) => {
  try {
    const { subject, group, classType, location, autoMarkTime } = req.body;

    const attendance = await Attendance.create({
      subject,
      group,
      lecturer: req.lecturer._id,
      date: new Date(),
      classType,
      location,
      autoMarkTime,
      records: []
    });

    // Get all students in group
    const groupData = await Group.findById(group).populate('members.user');
    const students = groupData.members.filter(m => m.role === 'student');

    // Initialize attendance records for all students
    attendance.records = students.map(s => ({
      student: s.user._id,
      status: 'absent'
    }));

    await attendance.save();

    // If physical class, generate QR code
    if (classType === 'physical') {
      const qrData = {
        attendanceId: attendance._id,
        token: crypto.randomBytes(32).toString('hex')
      };

      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));
      
      attendance.qrCode = qrCodeUrl;
      attendance.qrExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      await attendance.save();
    }

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubjectAttendance = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    const attendanceRecords = await Attendance.find({ subject: subjectId })
      .populate('lecturer', 'firstName lastName')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords
    });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceSession = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('subject lecturer group')
      .populate('records.student');

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance session not found' });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

exports.generateQRCode = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance session not found' });
    }

    const qrData = {
      attendanceId: attendance._id,
      token: crypto.randomBytes(32).toString('hex'),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    };

    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));
    
    attendance.qrCode = qrCodeUrl;
    attendance.qrExpiry = qrData.expiresAt;
    await attendance.save();

    res.status(200).json({
      success: true,
      data: { qrCode: qrCodeUrl, expiresAt: qrData.expiresAt }
    });
  } catch (error) {
    next(error);
  }
};

exports.markAttendance = async (req, res, next) => {
  try {
    const { location, qrToken } = req.body;
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance session not found' });
    }

    // Find student record
    const record = attendance.records.find(
      r => r.student.toString() === req.student._id.toString()
    );

    if (!record) {
      return res.status(404).json({ success: false, message: 'Student not found in this class' });
    }

    if (record.status === 'present' || record.status === 'late') {
      return res.status(400).json({ success: false, message: 'Attendance already marked' });
    }

    // Validate based on class type
    if (attendance.classType === 'physical') {
      // Check QR code expiry
      if (new Date() > attendance.qrExpiry) {
        return res.status(400).json({ success: false, message: 'QR code expired' });
      }

      // Verify location if provided
      if (attendance.location && location) {
        const distance = geolib.getDistance(
          { latitude: location.lat, longitude: location.lng },
          { latitude: attendance.location.lat, longitude: attendance.location.lng }
        );

        if (distance > attendance.location.radius) {
          return res.status(400).json({ 
            success: false, 
            message: 'You are not within the class location',
            distance,
            allowedRadius: attendance.location.radius
          });
        }
      }
    }

    // Mark attendance
    record.status = 'present';
    record.markedAt = new Date();
    record.markedBy = 'student';
    if (location) {
      record.location = location;
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

exports.submitExcuse = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance session not found' });
    }

    const record = attendance.records.find(
      r => r.student.toString() === req.student._id.toString()
    );

    if (!record) {
      return res.status(404).json({ success: false, message: 'Student not found in this class' });
    }

    record.excuseReason = reason;
    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Excuse submitted for review'
    });
  } catch (error) {
    next(error);
  }
};

exports.approveExcuse = async (req, res, next) => {
  try {
    const { studentId, approved } = req.body;
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance session not found' });
    }

    const record = attendance.records.find(
      r => r.student.toString() === studentId
    );

    if (!record) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    if (approved) {
      record.status = 'excused';
      record.markedBy = 'lecturer';
      record.markedAt = new Date();
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: approved ? 'Excuse approved' : 'Excuse rejected',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceReport = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('records.student subject');

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance session not found' });
    }

    const stats = {
      total: attendance.records.length,
      present: attendance.records.filter(r => r.status === 'present').length,
      absent: attendance.records.filter(r => r.status === 'absent').length,
      late: attendance.records.filter(r => r.status === 'late').length,
      excused: attendance.records.filter(r => r.status === 'excused').length
    };

    stats.attendanceRate = ((stats.present / stats.total) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        session: attendance,
        statistics: stats
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { subject } = req.query;

    const query = { 'records.student': studentId };
    if (subject) query.subject = subject;

    const attendanceRecords = await Attendance.find(query)
      .populate('subject')
      .sort({ date: -1 });

    const studentRecords = attendanceRecords.map(att => {
      const record = att.records.find(r => r.student.toString() === studentId);
      return {
        date: att.date,
        subject: att.subject,
        status: record.status,
        markedAt: record.markedAt
      };
    });

    const stats = {
      total: studentRecords.length,
      present: studentRecords.filter(r => r.status === 'present').length,
      absent: studentRecords.filter(r => r.status === 'absent').length,
      late: studentRecords.filter(r => r.status === 'late').length,
      excused: studentRecords.filter(r => r.status === 'excused').length
    };

    stats.attendanceRate = studentRecords.length > 0 
      ? ((stats.present / stats.total) * 100).toFixed(2) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        records: studentRecords,
        statistics: stats
      }
    });
  } catch (error) {
    next(error);
  }
};
```

Remaining Backend Controllers

onlineClass.controller.js - Schedule, start, end, join/leave online classes
notification.controller.js - Create, get, read, delete notifications
ai.controller.js - AI chat, process documents/admission letters/syllabus, usage tracking
social.controller.js - Create/get posts, like/comment, events feed
marketplace.controller.js - Create/get/update/delete listings, view tracking
report.controller.js - Submit and manage reports
payment.controller.js - Handle subscriptions, webhooks, cancellations
storage.controller.js - File upload/delete, usage tracking
document.controller.js - Upload, get, update, delete documents
institution.controller.js - Create, approve, get institutions, manage calendar
admin.controller.js - Main admin operations (approve institutions, AI config, reports, analytics)
user.controller.js - Get/update profile, delete account
course.controller.js - CRUD operations for courses

Also Need:

Services (ai.service.js, notification.service.js, email.service.js, storage.service.js, ocr.service.js, geolocation.service.js, payment.service.js, group.service.js)
Socket.io handlers (online class, notifications, chat events)
Config files (database.js, ai.config.js, socket.config.js)
Utils (validators.js, constants.js, helpers.js, oauth.js)
Main app.js and server.js setup

## Backend - What's Not Yet Discussed (Summary)

### **1. Remaining Controllers (13 total)**
- **onlineClass.controller.js** - Schedule, start, end, join/leave classes, participant management
- **notification.controller.js** - Create, fetch, read/unread, delete notifications
- **ai.controller.js** - Chat, process documents/admission/syllabus, usage tracking
- **social.controller.js** - CRUD posts, like/comment, events, feed algorithm
- **marketplace.controller.js** - CRUD listings, view tracking, search/filter
- **report.controller.js** - Submit/manage reports, resolution workflows
- **payment.controller.js** - Subscriptions, webhooks, cancellations
- **storage.controller.js** - Upload/delete files, usage tracking
- **document.controller.js** - CRUD documents, bulk operations
- **institution.controller.js** - CRUD institutions, approval workflow, calendar management
- **admin.controller.js** - Approvals, AI config, reports, analytics, platform management
- **user.controller.js** - Get/update profile, delete account
- **course.controller.js** - CRUD courses

---

### **2. Services (9 total)**
- **ai.service.js** - OpenRouter/OpenAI integration, model switching, embeddings, OCR
- **notification.service.js** - Send individual/group notifications, scheduling, templates
- **email.service.js** - Send emails (verification, notifications, reports)
- **storage.service.js** - File upload to cloud (S3/Cloudinary), delete, quota management
- **ocr.service.js** - Extract data from admission letters, process documents
- **geolocation.service.js** - Validate location for attendance, calculate distances
- **payment.service.js** - Stripe integration, subscription management, webhooks
- **group.service.js** - Auto-assign students to groups, hierarchy management
- **webrtc.service.js** - Video call setup, signaling for online classes (if custom implementation)

---

### **3. Socket.io Handlers (4 namespaces)**
- **socket.js** - Main Socket.io server setup and connection handling
- **onlineClass.socket.js** - Join/leave class, participant updates, class status events
- **notification.socket.js** - Real-time notification push, read receipts
- **chat.socket.js** - Real-time messaging, typing indicators
- **attendance.socket.js** - Real-time attendance marking updates

---

### **4. Config Files (3 files)**
- **database.js** - MongoDB connection setup, connection pooling, error handling
- **ai.config.js** - AI provider configuration, API keys management, model mappings
- **socket.config.js** - Socket.io configuration, CORS, authentication

---

### **5. Utils (4 files)**
- **validators.js** - Reusable validation functions (email, phone, file types, etc.)
- **constants.js** - App-wide constants (roles, statuses, limits, error codes)
- **helpers.js** - Utility functions (date formatting, string manipulation, etc.)
- **oauth.js** - OAuth token verification functions (Google, Facebook, Apple)

---

### **6. Main Application Setup (2 files)**
- **app.js** - Express app configuration, middleware mounting, route registration, error handling
- **server.js** - Server initialization, port binding, graceful shutdown

---

### **7. Additional Missing Pieces**
- **Rate limiting implementation** (beyond middleware definition)
- **Cron jobs** - Scheduled tasks (auto-mark absent students, send reminders, subscription renewals)
- **Email templates** - HTML email templates for various notifications
- **Testing setup** - Unit tests, integration tests (if needed)
- **Environment variables structure** - Complete .env.example file
- **Seed data scripts** - Initial data for development/testing
- **API documentation** - Swagger/OpenAPI spec (optional but recommended)
- **Deployment configuration** - Vercel config, environment setup

---

## Priority Order for Implementation:

**High Priority (Core Functionality):**
1. Complete remaining controllers (especially ai, notification, onlineClass, document)
2. Implement all services (ai, storage, notification, email are critical)
3. Socket.io handlers for real-time features
4. Config files (database, ai)
5. Main app setup (app.js, server.js)

**Medium Priority (Enhanced Features):**
6. Utils and helpers
7. Cron jobs for automation
8. Payment integration complete

**Lower Priority (Polish):**
9. Email templates
10. Testing
11. API documentation
