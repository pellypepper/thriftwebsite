const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER || 'ppeliance@gmail.com',
    pass: process.env.EMAIL_PASS || 'libhibkewsitguxy',
  },
});

const sendEmail = async ({ to, subject, text }) => {
  if (!to) {
    console.error("❌ Email recipient is missing.");
    return "No email recipient provided.";
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} (Message ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.message);
    return `Error sending email: ${error.message}`;
  }
};

module.exports = { sendEmail };
