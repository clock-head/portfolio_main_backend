"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// const { User, Session } = require('../models');
const models_1 = require("../models");
const zod_1 = require("zod");
const emailService_1 = require("../services/emailService");
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 1 day in ms
const MAX_INVALID_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(12),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
});
module.exports = {
    signup: async (req, res) => {
        const validation = signupSchema.safeParse(req.body);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.format() });
        }
        const { email, password, firstName, lastName } = validation.data;
        try {
            const existing = await models_1.User.findOne({ where: { email } });
            if (existing)
                return res.status(409).json({ message: 'Email already in use.' });
            const passwordHash = await bcrypt.hash(password, 12);
            const payload = {
                email: email.toLowerCase(),
                passwordHash: passwordHash,
                firstName: firstName,
                lastName: lastName,
                isAdmin: false,
                emailVerified: false,
                emailVerificationToken: verificationToken,
                emailVerificationExpiresAt: expiresAt,
            };
            const newUser = await models_1.User.create(payload);
            return res.status(201).json({ message: 'User created successfully.' });
        }
        catch (err) {
            console.log(models_1.User);
            return res.status(500).json({ error: `Internal server error: ${err}` });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await models_1.User.findOne({ where: { email } });
            if (!user)
                return res.status(404).json({ message: 'User not found.' });
            if (!user.emailVerified)
                return res.status(403).json({ message: 'Email not verified.' });
            const match = await bcrypt.compare(password, user.passwordHash);
            if (!match)
                return res.status(401).json({ message: 'Incorrect password.' });
            const token = crypto.randomBytes(64).toString('hex');
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            const expiresAt = new Date(Date.now() + SESSION_DURATION);
            await models_1.Session.create({ user_id: user.user_id, tokenHash, expiresAt });
            res.cookie('session_token', token, {
                httpOnly: true,
                maxAge: SESSION_DURATION,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                secure: process.env.NODE_ENV === 'production',
            });
            return res.status(200).json({ message: 'Login successful.', user: user });
        }
        catch (err) {
            console.error('Login error:', err);
            return res
                .status(500)
                .json({ error: err.message || 'Internal server error.' });
        }
    },
    logout: async (req, res) => {
        const rawToken = req.cookies?.session_token;
        if (!rawToken)
            return res.status(200).json({ message: 'Already logged out.' });
        const tokenHash = crypto
            .createHash('sha256')
            .update(rawToken)
            .digest('hex');
        await models_1.Session.destroy({ where: { tokenHash } });
        res.clearCookie('session_token');
        return res.status(200).json({ message: 'Logged out successfully.' });
    },
    getCurrentUser: async (req, res) => {
        try {
            const rawToken = req.cookies?.session_token;
            if (!rawToken)
                return res.status(401).json({ message: 'No session token found.' });
            const tokenHash = crypto
                .createHash('sha256')
                .update(rawToken)
                .digest('hex');
            const session = await models_1.Session.findOne({ where: { tokenHash } });
            if (!session || new Date() > session.expiresAt) {
                return res.status(401).json({ message: 'Session expired or invalid.' });
            }
            const user = await models_1.User.findByPk(session.user_id, {
                attributes: ['user_id', 'email', 'username', 'createdAt'],
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            return res.status(200).json({ user });
        }
        catch (err) {
            return res.status(500).json({ error: `Internal server error ${err}.` });
        }
    },
    sendVerificationEmail: async (req, res) => {
        const { email } = req.body;
        const token = await (0, emailService_1.generateVerificationToken)(email); // You define this
        if (token.length === 0) {
            res.status(404).json({ message: 'user not found.' });
        }
        await (0, emailService_1.sendVerificationEmail)(email, token);
        res.status(200).json({ message: 'Verification email sent.' });
    },
};
