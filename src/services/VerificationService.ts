import { Op } from 'sequelize';
import { addMinutes, isAfter } from 'date-fns';
import { User } from '../models/user.model';
import { VerificationAttempt } from '../models/verificationattempt.model';

const MAX_INVALID_ATTEMPTS = 5;
const MAX_IP_ATTEMPTS = 10;
const LOCK_DURATION_MINUTES = 15;

export class VerificationService {
  private ip: string;

  constructor(ip: string) {
    this.ip = ip;
  }

  async isIpBlocked(): Promise<boolean> {
    const attempt = await VerificationAttempt.findOne({
      where: { ip: this.ip },
    });
    return !!(
      attempt?.lockedUntil && isAfter(new Date(attempt.lockedUntil), new Date())
    );
  }

  async IncrementAttempts(): Promise<void> {
    const attempt = await VerificationAttempt.findOne({
      where: { ip: this.ip },
    });

    if (!attempt) {
      await VerificationAttempt.create({
        ip: this.ip,
        attempts: 1,
      });
    } else {
      attempt.attempts += 1;
      if (attempt.attempts >= MAX_IP_ATTEMPTS) {
        attempt.lockedUntil = addMinutes(new Date(), LOCK_DURATION_MINUTES);
      }
      await attempt.save();
    }
  }

  async resetIpAttempts(): Promise<void> {
    const attempt = await VerificationAttempt.findOne({
      where: { ip: this.ip },
    });
    if (attempt) {
      attempt.attempts = 0;
      attempt.lockedUntil = null;
      await attempt.save();
    }
  }

  async findValidUserByToken(token: string): Promise<User | null> {
    return User.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiresAt: { [Op.gt]: new Date() },
      },
    });
  }

  async handleInvalidToken(token: string): Promise<void> {
    const user = await User.findOne({
      where: { emailVerificationToken: token },
    });

    if (user) {
      user.verificationAttempts = (user.verificationAttempts || 0) + 1;

      if (user.verificationAttempts >= MAX_INVALID_ATTEMPTS) {
        user.lockedUntil = addMinutes(new Date(), LOCK_DURATION_MINUTES);
      }

      await user.save();
    }

    await this.IncrementAttempts();
  }

  async isUserSoftLocked(user: User): Promise<boolean> {
    return !!(
      user.lockedUntil && isAfter(new Date(user.lockedUntil), new Date())
    );
  }

  async verifyUser(user: User): Promise<void> {
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;
    user.verificationAttempts = 0;
    user.lockedUntil = null;
    await user.save();
    await this.resetIpAttempts();
  }
}
