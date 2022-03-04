import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  static createTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  static async sendMail(token, email) {
    const transporter = this.createTransporter();
    const url = `${process.env.BASE_URL}/api/users/verify/${token}`;
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Account confirmation',
      text: 'Please confirm your account by clicking the link:',
      html: `<a href="${url}" target="_blank">Verify email</a>`,
    });

    return `Message sent to: ${email}`;
  }
}

export default EmailService;
