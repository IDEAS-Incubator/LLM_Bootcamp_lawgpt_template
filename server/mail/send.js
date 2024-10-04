import nodemailer from 'nodemailer'
import dotnet from 'dotenv'


dotnet.config()

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_SECRET
    },
    host: process.env.SITE_URL,
    port: process.env.PORT
    
})

export default ({ to, subject, html }) => {
    var options = {
        from: `LawGPT <${process.env.MAIL_EMAIL}>`,
        cc : process.env.CC_EMAIL,
        to,
        subject:subject || "LawGPT :- Verify your email" ,
        html
    }

    transporter.sendMail(options, function (err, done) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ', done?.response);
        }
    });
}

const  sendErrorEmail = (error) => {
    const mailOptions = {
      from: process.env.MAIL_EMAIL,
      to: process.env.MONITOR_EMAIL,
      subject: "Error Occurred",
      text: error.toString(),
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent to monitor :", info.response);
      }
    });
  };

export {sendErrorEmail}