import { transporter } from '../utils/email';
const bcrypt = require('bcrypt');
const crypto = require('crypto');
import { User, Session } from '../models';
const SibApiV3Sdk = require('@sendinblue/client');

const brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
brevoClient.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKeys,
  process.env.BREVO_API_KEY
);

interface emailInterface {
  to: string;
  subject: string;
  htmlContent: string;
  senderName: string;
  senderEmail: string;
}

export async function sendEmail({
  to,
  subject,
  htmlContent,
  senderName = 'Operator',
  senderEmail = 'operator@clockhead.dev',
}: emailInterface) {
  try {
    const response = await brevoClient.sendTransacEmail({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent,
    });

    console.log('Email sent:', response.messageId || response);
    return response;
  } catch (error: any) {
    console.error(
      'Error sending email:',
      error.response?.body || error.message
    );

    throw error;
  }
}

export const sendVerificationEmail = async (
  to: string,
  token: string,
  senderName: string = 'Operator',
  senderEmail: string = 'operator@clockhead.dev'
) => {
  const verifyUrl = `https://clockhead.dev/verify?token=${token}`;
  await sendEmail({
    to,
    subject: 'Verify your email address',
    htmlContent: `
      <p>Hello,</p>
      <p>Click below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
    senderName: senderName,
    senderEmail: senderEmail,
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
