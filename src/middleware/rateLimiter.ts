import rateLimit, { ValueDeterminingMiddleware } from 'express-rate-limit';
import { Request, Response } from 'express';

const keyGenerator: ValueDeterminingMiddleware<string> = (
  req: Request,
  res: Response
): string => {
  return req.ip ?? 'unknown'; // Use the IP address as the key
};

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator,
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip ?? 'unknown'}`);
    res.status(429).json({
      status: 'fail',
      message: 'Too many login attempts, please try again later.',
    });
  },
});
