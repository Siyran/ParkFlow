import 'dotenv/config';

function parseBoolean(value: string | undefined, fallback = false) {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/parkflow',
  jwtAccessSecret: process.env.JWT_SECRET ?? 'replace_me_with_a_long_random_secret',
  jwtRefreshSecret: process.env.REFRESH_SECRET ?? 'replace_me_with_a_long_random_refresh_secret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d',
  otpExpiresInMinutes: Number(process.env.OTP_EXPIRES_IN_MINUTES ?? 10),
  cookieSecure: parseBoolean(process.env.COOKIE_SECURE, false),
};
