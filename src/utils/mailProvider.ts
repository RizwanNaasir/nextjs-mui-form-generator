import nodemailer from 'nodemailer';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

// Replace with your SMTP credentials
const smtpOptions = {
  host: process.env.NEXT_PUBLIC_SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT || '2525'),
  secure: false,
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USER || 'user',
    pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD || 'password'
  }
};

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions
  });

  return await transporter.sendMail({
    from: process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL,
    ...data
  });
};
