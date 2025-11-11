const nodemailer = require('nodemailer');

// Create transporter (configure with your email provider)
const createTransporter = () => {
  // For development, you can use services like Gmail, SendGrid, etc.
  // For production, use environment variables
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

module.exports = {
  sendEmail: async ({ to, subject, html, text }) => {
    try {
      const transporter = createTransporter();

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@kitchen19.com',
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send failed:', error);
      // In development, just log the error. In production, you might want to throw or handle differently
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
      return { success: false, error: error.message };
    }
  },

  // Send welcome email
  sendWelcomeEmail: async (email, name) => {
    return module.exports.sendEmail({
      to: email,
      subject: 'Welcome to Kitchen19!',
      html: `
        <h1>Welcome to Kitchen19, ${name}!</h1>
        <p>Your student journey starts here. Upload your admission letter to get started.</p>
        <p>Best regards,<br>The Kitchen19 Team</p>
      `
    });
  },

  // Send password reset email
  sendPasswordResetEmail: async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    return module.exports.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
  }
};
