import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

config();

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  } as SMTPTransport.Options);

  try {
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_NAME} <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent to %s with id: %s', to, info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
}
