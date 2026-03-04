import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Pakai ini agar tidak perlu HOST dan PORT
    auth: {
      user: process.env.SMTP_USER, // Sesuai .env kamu
      pass: process.env.SMTP_PASS, // Sesuai .env kamu (16 digit)
    },
  });

  const mailOptions = {
    from: `"My App Support" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;