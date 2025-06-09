import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Portfolio Site" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email',
    html: `
      <p>Thank you for signing up!</p>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}
