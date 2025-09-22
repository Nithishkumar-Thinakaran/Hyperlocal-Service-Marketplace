const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send an email to the user.
 * @param {string} to - Recipient's email.
 * @param {string} subject - Email subject.
 * @param {string} text - Email body text.
 */
const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `<${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
    });

    console.log(`📧 Email sent to ${to} - Message ID: ${info.messageId}`);
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
    throw err; 
  }
};

module.exports = sendEmail;
