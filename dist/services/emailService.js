"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationToken = exports.sendVerificationEmail = void 0;
const email_1 = require("../utils/email");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const models_1 = require("../models");
const sendVerificationEmail = async (to, token) => {
    const verifyUrl = `https://clockhead.dev/verify?token=${token}`;
    await email_1.transporter.sendMail({
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
