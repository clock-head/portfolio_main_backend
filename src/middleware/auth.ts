const crypto = require('crypto');
const { Session, User } = require('../models');
import { Request, Response, NextFunction } from 'express';

// Middleware to protect routes
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const rawToken = req.cookies?.session_token;

  if (!rawToken) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const session = await Session.findOne({
      where: { tokenHash },
      include: [{ model: User }],
    });

    if (!session || new Date() > session.expiresAt) {
      if (session) await session.destroy(); // Cleanup expired sessions
      return res.status(401).json({ message: 'Session expired or invalid.' });
    }

    // Attach user object to request
    req.user = session.User;
    req.session = session;
    console.log('auth middle level user', req.user);
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  requireAuth,
};
