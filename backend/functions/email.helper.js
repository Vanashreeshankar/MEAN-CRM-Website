const nodemailer = require("nodemailer");

// Configure the transporter with your SMTP provider details
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // SMTP username
        pass: process.env.EMAIL_PASS, // SMTP password
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true,  // Show SMTP traffic
    logger: true
});

// Verify the SMTP connection
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

// Email Processor Function
const emailProcessor = async ({ email, pin, type, verificationLink = "https://mean-crm-frontend.vercel.app/resetpassword" }) => {
    console.log('Email:', email, pin, type, verificationLink)
    let info = "";

    switch (type) {
        case "request-new-password":
            info = {
                from: '"CRM Company" <crm.company.in@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Password Reset Pin", // Subject line
                text: "Here is your password reset pin " + pin + ". This pin will expire in 1 day.", // plain text body
                html: `<b>Hello,</b><br>
                       Here is your password reset pin: <b>${pin}</b>.<br>
                       This pin will expire in 1 day.<br>
                       <a href="${verificationLink}">Reset Password</a>`, // html body
            };
            break;

        case "update-password-success":
            info = {
                from: '"CRM Company" <crm.company.in@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Password Updated", // Subject line
                text: "Your new password has been updated.", // plain text body
                html: `<b>Hello,</b><br>
                        <p>You can now log in with your new password <a href="https://mean-crm-frontend.vercel.app/login">here</a>.</p>`, // html body
            };
            break;

        default:
            throw new Error("Invalid email type provided to emailProcessor");
    }

    return send(info);
};

module.exports = emailProcessor;
