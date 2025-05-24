"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, Session } = require('../models');
const zod_1 = require("zod");
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 1 day in ms
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(12),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
});
module.exports = {
    signup: async (req, res) => {
        const validation = signupSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.format() });
        }
        const { email, password, firstName, lastName } = validation.data;
        try {
            const existing = await User.findOne({ where: { email } });
            if (existing)
                return res.status(409).json({ message: 'Email already in use.' });
            const passwordHash = await bcrypt.hash(password, 12);
            const payload = {
                email: email.toLowerCase(),
                passwordHash: passwordHash,
                firstName: firstName,
                lastName: lastName,
                isAdmin: false,
            };
            const newUser = await User.create(payload);
            return res.status(201).json({ message: 'User created successfully.' });
        }
        catch (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if (!user)
                return res.status(404).json({ message: 'User not found.' });
            const match = await bcrypt.compare(password, user.password_hash);
            if (!match)
                return res.status(401).json({ message: 'Incorrect password.' });
            const token = crypto.randomBytes(64).toString('hex');
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            const expiresAt = new Date(Date.now() + SESSION_DURATION);
            await Session.create({ user_id: user.user_id, tokenHash, expiresAt });
            res.cookie('session_token', token, {
                httpOnly: true,
                maxAge: SESSION_DURATION,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
            });
            return res.status(200).json({ message: 'Login successful.' });
        }
        catch (err) {
            return res.status(500).json({ error: 'Internal server error.' });
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
        await Session.destroy({ where: { tokenHash } });
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
            const session = await Session.findOne({ where: { tokenHash } });
            if (!session || new Date() > session.expiresAt) {
                return res.status(401).json({ message: 'Session expired or invalid.' });
            }
            const user = await User.findByPk(session.user_id, {
                attributes: ['user_id', 'email', 'username', 'createdAt'],
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            return res.status(200).json({ user });
        }
        catch (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },
};
