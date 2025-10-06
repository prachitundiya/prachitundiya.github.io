const nodemailer = require('nodemailer');

// Create transporter - FIXED: use createTransport instead of createTransporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP configuration error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to Canwas Public School Admission Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #172d75;">Welcome to Canwas Public School!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for registering with our admission portal. Your account has been created successfully.</p>
        <p>You can now start the admission process for your child by logging into your account.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <br>
        <p>Best regards,<br>Canwas Public School Team</p>
      </div>
    `
  }),

  admissionSubmitted: (name, applicationId) => ({
    subject: 'Admission Application Submitted Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #172d75;">Admission Application Submitted</h2>
        <p>Dear ${name},</p>
        <p>Your admission application has been submitted successfully.</p>
        <p><strong>Application ID:</strong> ${applicationId}</p>
        <p>We will review your application and contact you shortly with further instructions.</p>
        <p>You can check the status of your application by logging into your account.</p>
        <br>
        <p>Best regards,<br>Canwas Public School Team</p>
      </div>
    `
  }),

  paymentConfirmation: (name, transactionId, amount) => ({
    subject: 'Payment Confirmation - Canwas Public School',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #172d75;">Payment Received Successfully</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your payment. Your transaction has been processed successfully.</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p>Your admission process is now complete. We will contact you soon regarding the next steps.</p>
        <br>
        <p>Best regards,<br>Canwas Public School Team</p>
      </div>
    `
  }),

  visitScheduled: (name, date, time) => ({
    subject: 'School Visit Scheduled - Canwas Public School',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #172d75;">School Visit Scheduled</h2>
        <p>Dear ${name},</p>
        <p>Your school visit has been scheduled successfully.</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>Please arrive 15 minutes before your scheduled time and bring any required documents.</p>
        <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
        <br>
        <p>Best regards,<br>Canwas Public School Team</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, templateName, templateData) => {
  try {
    // If no SMTP config, just log and return success for demo
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`[EMAIL DEMO] Would send ${templateName} to: ${to}`);
      console.log(`[EMAIL DATA]`, templateData);
      return { success: true, demo: true };
    }

    if (!emailTemplates[templateName]) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const template = emailTemplates[templateName](...templateData);
    
    const mailOptions = {
      from: `"Canwas Public School" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: to,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    // For demo purposes, don't fail the request if email fails
    console.log(`[EMAIL FAILED] Template: ${templateName}, To: ${to}`);
    return { success: false, error: error.message, demo: true };
  }
};

module.exports = {
  sendEmail,
  emailTemplates
};