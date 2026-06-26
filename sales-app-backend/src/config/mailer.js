console.log('SMTP_HOST=', process.env.SMTP_HOST, 'USER=', process.env.SMTP_USER, 'PORT=', process.env.SMTP_PORT);


const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

transporter.verify()
  .then(() => console.log("SMTP OK"))
  .catch(err => console.error("SMTP VERIFY ERROR:", err));

module.exports = transporter;