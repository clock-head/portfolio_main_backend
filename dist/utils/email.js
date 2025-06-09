"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});
async function sendVerificationEmail(email, token) {
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
