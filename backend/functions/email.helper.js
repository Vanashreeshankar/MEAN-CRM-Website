const nodemailer = require("nodemailer");

// Configure the transporter using environment variables
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Use 587 for TLS
  secure: false, // Use TLS
  auth: {
    user: process.env.GMAIL_USER, // Gmail address from env
    pass: process.env.GMAIL_PASS, // App password from env
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: true, // Enable detailed logging
});

// Verify SMTP configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error verifying SMTP transporter:', error);
  } else {
    console.log('SMTP transporter is ready to send messages');
  }
});

// Function to send email
const send = async (info) => {
  try {
    let result = await transporter.sendMail(info);
    console.log("Message sent: %s", result.messageId);
    console.log('SendMail result:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email processor function
const emailProcessor = async ({ email, pin, type, verificationLink = "https://mean-crm-frontend.vercel.app/resetpassword" }) => {
  console.log('Email:', email, pin, type, verificationLink);
  let info = {};

  switch (type) {
    case "request-new-password":
      info = {
        from: `"CMR Company" <${process.env.GMAIL_USER}>`, // Sender address
        to: email, // Receiver's email
        subject: "Password Reset Pin", // Subject
        text: `Here is your password reset pin ${pin}. This pin will expire in 1 day.`, // Plain text body
        html: `<b>Hello</b>,<br>
               <p>Here is your pin:</p>
               <b>${pin}</b>
               <p>This pin will expire in 1 day.</p>
               <p><a href="${verificationLink}">Reset Password</a></p>`, // HTML body
      };
      break;

    case "update-password-success":
      info = {
        from: `"CMR Company" <${process.env.GMAIL_USER}>`, // Sender address
        to: email, // Receiver's email
        subject: "Password Updated", // Subject
        text: "Your new password has been updated.", // Plain text body
        html: `<b>Hello</b>,<br>
               <p>Your new password has been updated.</p>`, // HTML body
      };
      break;

    default:
      console.warn('Unknown email type:', type);
      return;
  }

  try {
    const result = await send(info);
    console.log('Email sent successfully:', result.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

module.exports = emailProcessor;
