const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
 
  service:'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
   pass: process.env.EMAIL_PASS
 },
 
 tls: {
    rejectUnauthorized: false
  }, 
port: 465,
secure: false
});

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
