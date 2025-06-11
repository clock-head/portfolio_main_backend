const bcrypt = require('bcrypt');
const crypto = require('crypto');
// const { User, Session } = require('../models');
import { User, Session } from '../models';
import { UserPayload, SignupBody } from '../types/User';
import { CreationAttributes } from 'sequelize';
import { Request, Response } from 'express';
import { z } from 'zod';
import { sendVerificationEmail } from '../utils/email';
import { Op } from 'sequelize';

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 1 day in ms

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
  firstName: z.string(),
  lastName: z.string(),
});

module.exports = {
  signup: async (req: Request<{}, {}, SignupBody>, res: Response) => {
    const validation = signupSchema.safeParse(req.body);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { email, password, firstName, lastName } = validation.data;

    try {
      const existing = await User.findOne({ where: { email } });
      if (existing)
        return res.status(409).json({ message: 'Email already in use.' });

      const passwordHash = await bcrypt.hash(password, 12);

      const payload: CreationAttributes<User> = {
        email: email.toLowerCase(),
        passwordHash: passwordHash,
        firstName: firstName,
        lastName: lastName,
        isAdmin: false,
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpiresAt: expiresAt,
      };

      const newUser = await User.create(payload);

      return res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
      console.log(User);
      return res.status(500).json({ error: `Internal server error: ${err}` });
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: 'User not found.' });
      if (!user.emailVerified)
        return res.status(403).json({ message: 'Email not verified.' });

      const match = await bcrypt.compare(password, user.passwordHash);
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
    } catch (err: any) {
      console.error('Login error:', err);
      return res
        .status(500)
        .json({ error: err.message || 'Internal server error.' });
    }
  },

  logout: async (req: Request, res: Response) => {
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

  getCurrentUser: async (req: Request, res: Response) => {
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
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  verifyEmail: async (req: Request, res: Response) => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing token.' });
    }

    try {
      const user = await User.findOne({
        where: {
          emailVerificationToken: token,
          emailVerificationExpiresAt: {
            [Op.gt]: new Date(), // Check if the token is still valid
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'Invalid or expired token.' });
      }

      user.emailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationExpiresAt = null;
      await user.save();

      return res.status(200).json({ message: 'Email verified successfully.' });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
