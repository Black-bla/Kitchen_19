const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let firebaseInitialized = false;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    firebaseInitialized = true;
  }
} catch (error) {
  console.warn('Firebase not initialized:', error.message);
}

module.exports = {
  // Send push notification to a device
  send: async (notification) => {
    const { token, title, body, data = {} } = notification;

    if (!token) {
      console.warn('No device token provided for notification');
      return { success: false, error: 'No device token' };
    }

    if (!firebaseInitialized) {
      console.warn('Firebase not initialized, notification not sent');
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const message = {
        token,
        notification: {
          title,
          body
        },
        data: {
          ...data,
          timestamp: Date.now().toString()
        }
      };

      const response = await admin.messaging().send(message);
      console.log('Notification sent:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Notification send failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Send notification to multiple devices
  sendToMultiple: async (tokens, notification) => {
    if (!firebaseInitialized) {
      console.warn('Firebase not initialized');
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const message = {
        tokens,
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data || {}
      };

      const response = await admin.messaging().sendMulticast(message);
      console.log('Multicast notification sent:', response);
      return { success: true, response };
    } catch (error) {
      console.error('Multicast notification failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Send assignment notification
  sendAssignmentNotification: async (studentTokens, assignment) => {
    return module.exports.sendToMultiple(studentTokens, {
      title: 'New Assignment',
      body: `New assignment: ${assignment.title}`,
      data: {
        type: 'assignment',
        assignmentId: assignment._id.toString(),
        courseId: assignment.course.toString()
      }
    });
  },

  // Send grade notification
  sendGradeNotification: async (studentToken, grade) => {
    return module.exports.send(studentToken, {
      title: 'Grade Posted',
      body: `Your grade for ${grade.subject} is now available`,
      data: {
        type: 'grade',
        gradeId: grade._id.toString(),
        subject: grade.subject
      }
    });
  },

  // Send attendance notification
  sendAttendanceNotification: async (studentToken, attendance) => {
    const status = attendance.present ? 'present' : 'absent';
    return module.exports.send(studentToken, {
      title: 'Attendance Marked',
      body: `You have been marked ${status} for ${attendance.subject}`,
      data: {
        type: 'attendance',
        attendanceId: attendance._id.toString(),
        status: status
      }
    });
  }
};
