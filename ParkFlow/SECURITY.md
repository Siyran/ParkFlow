# Security Notes

## Planned Controls

- JWT auth with access and refresh tokens
- bcrypt password hashing
- Helmet, CORS, compression, and request logging
- Redis-backed auth rate limiting
- Parameterized queries only
- Validation and sanitization for all API inputs
- CSRF protection for state-changing routes
- Razorpay webhook signature verification
- Redis-based booking locks to prevent race conditions

## Known Limitation

This is an initial scaffold. The production hardening work will be added in later implementation passes.
