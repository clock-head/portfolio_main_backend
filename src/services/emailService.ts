import { transporter } from '../utils/email';
const bcrypt = require('bcrypt');
const crypto = require('crypto');
import { User, Session } from '../models';

export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyUrl = `https://clockhead.dev/verify?token=${token}`;
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Verify your email address',
    html: `
      <p>Hello,</p>
      <p>Click below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
  });
};

export const generateVerificationToken = async (email: string) => {
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error('user not found.');
    }

    const verificationToken: string = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    await user.save();
    return verificationToken;
  } catch (error) {
    return '';
  }
};
