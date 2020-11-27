const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "noreply@node-react.com" };

export async function sendEmail(emailData){
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "oussemabenamor96@gmail.com",
      pass: "ezppblpsygwmznsu"
    }
  });
  try {
        const info = await transporter.sendMail(emailData);
        return console.log(`Message sent: ${info.response}`);
    }
    catch (err) {
        return console.log(`Problem sending email: ${err}`);
    }
};
