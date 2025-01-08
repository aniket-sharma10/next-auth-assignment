import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOTPEmail(email: string, otp: string, type: 'login' | 'signup') {
  const subject = type === 'signup' ? 'Verify your email address' : 'Login OTP';
  const message = type === 'signup' 
    ? 'Thank you for signing up. Use this code to verify your email:'
    : 'Use this code to log in:';

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: `
      <h1>${subject}</h1>
      <p>${message}</p>
      <p style="font-size: 24px; font-weight: bold; color: #4F46E5;">${otp}</p>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `,
  });
}