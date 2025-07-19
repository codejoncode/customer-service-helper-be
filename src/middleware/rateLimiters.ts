import rateLimit from "express-rate-limit";

const showRateLimitHeaders = process.env.NODE_ENV === "development";

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Too many login attempts, please wait a minute.",
  standardHeaders: showRateLimitHeaders, // // No need to tell attackers how to adjust there robots before we block them
  legacyHeaders: false,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // adjust based on real usage
  message: "Too many registration attempts. Please try again later.",
  standardHeaders: showRateLimitHeaders,
  legacyHeaders: false,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: showRateLimitHeaders,
  legacyHeaders: false,
});
