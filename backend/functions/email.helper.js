const nodemailer = require("nodemailer");

const nodemailer = require('nodemailer');

// Configure the transporter with your SMTP provider details
const transporter = nodemailer.createTransport({
    host: `smtp.gmail.com`,
    port: `465`,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: `crm.company.in@gmail.com`, // SMTP username
        pass: `ncleywbpnfoipryi`, // SMTP password
    },
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: `"Your Name" <${process.env.SMTP_USER}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


const send = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await transporter.sendMail(info);
  console.log("Message sent: %s", result.messageId);
  console.log("Full result:", result);
  resolve(result);
    } catch (error) {
      console.log('error sending mail:',error)
     console.error('TLS error:', error.message)
      console.log(error);
    }
  });
};

const emailProcessor = ({ email, pin, type, verificationLink = "https://mean-crm-frontend.vercel.app/resetpassword" }) => {
  console.log('Email:', email, pin, type, verificationLink)
  let info = "";
  switch (type) {
    case "request-new-password":
      info = {
        from: '"CMR Company" <crm.company.in@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Password reset Pin", // Subject line
        text: "Here is your password reset pin " + pin + " This pin will expire in 1 day", // plain text body
        html: `<b>Hello </b>
      Here is your pin 
      <b>${pin}</b>
      This pin will expire in 1 day
      <p href="${verificationLink}">Reset Password</P>
      <p></p>`, // html body
      };

      send(info);
      break;

    case "update-password-success":
      info = {
        from: '"CMR Company" <crm.company.in@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Password updated", // Subject line
        text: "Your new password has been updated", // plain text body
        html: `<b>Hello </b>
        <p>Your new password has been updated</p>`, // html body
      };
      send(info);
      break;
    default:
      break;
  }
};

module.exports =  emailProcessor ;
