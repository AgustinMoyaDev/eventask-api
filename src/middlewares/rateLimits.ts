import rateLimit from 'express-rate-limit'

/**
 * Express middleware for rate limiting requests.
 * Limits each IP to 500 requests per 15 minutes by default.
 * @returns Express middleware function
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  message: {
    error: 'Too many requests, please try again later.',
    code: 429,
  },
})
