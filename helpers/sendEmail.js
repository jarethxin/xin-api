require("dotenv").config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: '"App de Operadores" <noreply@xpressinternacional.com>',
    to,
    subject,
    html
  });
}

module.exports = sendEmail;
