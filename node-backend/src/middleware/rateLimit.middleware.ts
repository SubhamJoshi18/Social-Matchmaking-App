import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // Maximum Number of Requests allowed in the windows,
  message: 'Too Many Requests, Please Try again Later',
});

export default limiter;
