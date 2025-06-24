import request from 'supertest';
import { app } from '../src/server';
import { User } from '../src/models/user.model';
import { VerificationAttempt } from '../src/models/verificationattempt.model';
import { addMinutes } from 'date-fns';

describe('verifyEmail API', () => {
  let testToken: string;

  beforeEach(async () => {
    await VerificationAttempt.destroy({ where: {} });
    await User.destroy({ where: {} });

    testToken = 'valid-test-token-1234';
  });

  it('verifies a valid token and updates user states', async () => {
    const res = await request(app).get(`/api/verify-email?token=${testToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Email verified successfully.');

    const user = await User.findOne({ where: { email: 'test@example.com' } });
    expect(user?.emailVerified).toBe(true);
    expect(user?.emailVerificationToken).toBeNull();
  });

  it('rejects an invalid token and creates a verification attempt record', async () => {
    const badToken = 'wrong-token-999';
    const res = await request(app).get(`/api/verify-email?token=${badToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Invalid or expired token.');

    const attempts = await VerificationAttempt.findAll();
    expect(attempts.length).toBe(1);
    expect(attempts[0].ip).toBeDefined();
    expect(attempts[0].attempts).toBe(1);
  });

  it('blocks verification if IP is locked out', async () => {
    await VerificationAttempt.create({
      ip: '::ffff:127.0.0.1',
      attempts: 20,
      lockedUntil: addMinutes(new Date(), 10),
    });

    const res = await request(app).get(`/api/verify-email?token=${testToken}`);

    expect(res.status).toBe(429);
    expect(res.body.message).toMatch(/Too many attempts/);
  });

  it('blocks verification if user is soft-locked', async () => {
    const user = await User.findOne({ where: { email: 'test@example.com' } });
    if (user) {
      user.lockedUntil = addMinutes(new Date(), 10);
      await user.save();
    }

    const res = await request(app).get(`/api/verify-email?token=${testToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/temporarily disabled/);
  });

  it('returns 400 on missing or malformed token', async () => {
    const res = await request(app).get(`/api/verify-email`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid or missing token/);
  });
});
