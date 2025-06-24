"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
const user_model_1 = require("../models/user.model");
const verificationattempt_model_1 = require("../models/verificationattempt.model");
const MAX_INVALID_ATTEMPTS = 5;
const MAX_IP_ATTEMPTS = 10;
const LOCK_DURATION_MINUTES = 15;
class VerificationService {
    constructor(ip) {
        this.ip = ip;
    }
    async isIpBlocked() {
        const attempt = await verificationattempt_model_1.VerificationAttempt.findOne({
            where: { ip: this.ip },
        });
        return !!(attempt?.lockedUntil && (0, date_fns_1.isAfter)(new Date(attempt.lockedUntil), new Date()));
    }
    async IncrementAttempts() {
        const attempt = await verificationattempt_model_1.VerificationAttempt.findOne({
            where: { ip: this.ip },
        });
        if (!attempt) {
            await verificationattempt_model_1.VerificationAttempt.create({
                ip: this.ip,
                attempts: 1,
            });
        }
        else {
            attempt.attempts += 1;
            if (attempt.attempts >= MAX_IP_ATTEMPTS) {
                attempt.lockedUntil = (0, date_fns_1.addMinutes)(new Date(), LOCK_DURATION_MINUTES);
            }
            await attempt.save();
        }
    }
    async resetIpAttempts() {
        const attempt = await verificationattempt_model_1.VerificationAttempt.findOne({
            where: { ip: this.ip },
        });
        if (attempt) {
            attempt.attempts = 0;
            attempt.lockedUntil = null;
            await attempt.save();
        }
    }
    async findValidUserByToken(token) {
        return user_model_1.User.findOne({
            where: {
                emailVerificationToken: token,
                emailVerificationExpiresAt: { [sequelize_1.Op.gt]: new Date() },
            },
        });
    }
    async handleInvalidToken(token) {
        const user = await user_model_1.User.findOne({
            where: { emailVerificationToken: token },
        });
        if (user) {
            user.verificationAttempts = (user.verificationAttempts || 0) + 1;
            if (user.verificationAttempts >= MAX_INVALID_ATTEMPTS) {
                user.lockedUntil = (0, date_fns_1.addMinutes)(new Date(), LOCK_DURATION_MINUTES);
            }
            await user.save();
        }
        await this.IncrementAttempts();
    }
    async isUserSoftLocked(user) {
        return !!(user.lockedUntil && (0, date_fns_1.isAfter)(new Date(user.lockedUntil), new Date()));
    }
    async verifyUser(user) {
        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpiresAt = null;
        user.verificationAttempts = 0;
        user.lockedUntil = null;
        await user.save();
        await this.resetIpAttempts();
    }
}
exports.VerificationService = VerificationService;
