"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require('crypto');
const models_1 = require("../models");
// Middleware to protect routes
const requireAuth = async (req, res, next) => {
    const rawToken = req.cookies?.session_token;
    if (!rawToken) {
        return res.status(401).json({ message: 'Authentication required.' });
    }
    try {
        const tokenHash = crypto
            .createHash('sha256')
            .update(rawToken)
            .digest('hex');
        const session = await models_1.Session.findOne({
            where: { tokenHash },
            include: [{ model: models_1.User }],
        });
        if (!session || new Date() > session.expiresAt) {
            if (session)
                await session.destroy(); // Cleanup expired sessions
            return res.status(401).json({ message: 'Session expired or invalid.' });
        }
        // Attach user object to request
        req.user = session.user;
        req.session = session;
        next();
    }
    catch (err) {
        console.error('[Auth Middleware Error]', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
module.exports = {
    requireAuth,
};
