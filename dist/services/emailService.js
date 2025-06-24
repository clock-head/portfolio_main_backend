"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationToken = exports.sendVerificationEmail = void 0;
exports.sendEmail = sendEmail;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const models_1 = require("../models");
const SibApiV3Sdk = require('@sendinblue/client');
const brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
brevoClient.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
async function sendEmail({ to, subject, htmlContent, senderName = 'Operator', senderEmail = 'operator@clockhead.dev', }) {
    try {
        const response = await brevoClient.sendTransacEmail({
            sender: { name: senderName, email: senderEmail },
            to: [{ email: to }],
            subject,
            htmlContent,
        });
        console.log('Email sent:', response.messageId || response);
        return response;
    }
    catch (error) {
        console.error('Error sending email:', error.response?.body || error.message);
        throw error;
    }
}
const sendVerificationEmail = async (to, token, senderName = 'Operator', senderEmail = 'operator@clockhead.dev') => {
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
exports.sendVerificationEmail = sendVerificationEmail;
const generateVerificationToken = async (email) => {
    try {
        const user = await models_1.User.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new Error('user not found.');
        }
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = verificationToken;
        await user.save();
        return verificationToken;
    }
    catch (error) {
        return '';
    }
};
exports.generateVerificationToken = generateVerificationToken;
