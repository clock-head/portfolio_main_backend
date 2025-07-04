"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = void 0;
const VerificationService_1 = require("../services/VerificationService");
const verifyEmail = async (req, res) => {
    const { token } = req.query;
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
    if (!token || typeof token !== 'string' || token.length < 10) {
        return res.status(400).json({ message: 'Invalid or missing token.' });
    }
    const verifier = new VerificationService_1.VerificationService(ip);
    try {
        if (await verifier.isIpBlocked()) {
            return res.status(429).json({
                message: 'Too many attempts from your network. Try again later.',
            });
        }
        const user = await verifier.findValidUserByToken(token);
        if (!user) {
            await verifier.handleInvalidToken(token);
            return res.status(404).json({ message: 'Invalid or expired token.' });
        }
        if (await verifier.isUserSoftLocked(user)) {
            return res.status(403).json({
                message: 'Your email verification is temporarily disabled due to suspicious activity.',
            });
        }
        await verifier.verifyUser(user);
        return res.status(200).json({ message: 'Email verified successfully.' });
    }
    catch (error) {
        console.error('[verifyEmail] Error:', error);
        return res.status(500).json({ error: `Internal server error. ${error}` });
    }
};
exports.verifyEmail = verifyEmail;
