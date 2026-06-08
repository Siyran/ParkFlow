import type { CookieOptions, Express, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '../env.ts';
import { query } from '../db.ts';
import { success } from '../response.ts';

type Role = 'user' | 'owner' | 'admin';

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  role: Role;
  wallet_balance: string;
  created_at: Date;
  verified_at: Date | null;
  otp_code_hash: string | null;
  otp_expires_at: Date | null;
  refresh_token_hash: string | null;
  refresh_token_expires_at: Date | null;
};

const ACCESS_COOKIE = 'parkflow_access_token';
const REFRESH_COOKIE = 'parkflow_refresh_token';

function getBody<T>(req: Request) {
  return req.body as Partial<T>;
}

function parseDurationToMs(value: string) {
  const match = /^(\d+)([smhd])$/.exec(value);

  if (!match) {
    return 15 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
}

function cookieOptions(maxAgeMs: number, path = '/') {
  const options: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.cookieSecure,
    path,
    maxAge: maxAgeMs,
  };

  return options;
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_COOKIE, accessToken, cookieOptions(parseDurationToMs(env.accessTokenExpiresIn)));
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions(parseDurationToMs(env.refreshTokenExpiresIn), '/api/auth'));
}

function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_COOKIE, cookieOptions(parseDurationToMs(env.accessTokenExpiresIn)));
  res.clearCookie(REFRESH_COOKIE, cookieOptions(parseDurationToMs(env.refreshTokenExpiresIn), '/api/auth'));
}

function createAccessToken(user: Pick<UserRow, 'id' | 'email' | 'role'>) {
  return jwt.sign({ email: user.email, role: user.role }, env.jwtAccessSecret, {
    subject: user.id,
    expiresIn: env.accessTokenExpiresIn,
  });
}

function createRefreshToken(userId: string) {
  return jwt.sign({ tokenType: 'refresh' }, env.jwtRefreshSecret, {
    subject: userId,
    expiresIn: env.refreshTokenExpiresIn,
  });
}

function publicUser(user: UserRow) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    walletBalance: Number(user.wallet_balance),
    verified: Boolean(user.verified_at),
  };
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function loadUserByEmail(email: string) {
  const result = await query<UserRow>(
    `
      SELECT id::text, name, email, password_hash, phone, role, wallet_balance, created_at, verified_at,
             otp_code_hash, otp_expires_at, refresh_token_hash, refresh_token_expires_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

async function loadUserById(id: string) {
  const result = await query<UserRow>(
    `
      SELECT id::text, name, email, password_hash, phone, role, wallet_balance, created_at, verified_at,
             otp_code_hash, otp_expires_at, refresh_token_hash, refresh_token_expires_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

async function storeOtp(email: string, otp: string) {
  const otpCodeHash = await bcrypt.hash(otp, 12);

  await query(
    `
      UPDATE users
      SET otp_code_hash = $2,
          otp_expires_at = NOW() + ($3 || ' minutes')::interval
      WHERE email = $1
    `,
    [email, otpCodeHash, String(env.otpExpiresInMinutes)],
  );
}

async function issueSession(res: Response, user: UserRow) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user.id);
  const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

  await query(
    `
      UPDATE users
      SET refresh_token_hash = $2,
          refresh_token_expires_at = NOW() + ($3 || ' seconds')::interval
      WHERE id = $1
    `,
    [user.id, refreshTokenHash, String(parseDurationToMs(env.refreshTokenExpiresIn) / 1000)],
  );

  setAuthCookies(res, accessToken, refreshToken);
}

async function verifyAccessToken(req: Request) {
  const token = req.cookies?.[ACCESS_COOKIE] as string | undefined;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
    const userId = payload.sub;

    if (typeof userId !== 'string') {
      return null;
    }

    return await loadUserById(userId);
  } catch {
    return null;
  }
}

async function verifyRefreshToken(req: Request) {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
    const userId = payload.sub;

    if (typeof userId !== 'string') {
      return null;
    }

    const user = await loadUserById(userId);

    if (!user?.refresh_token_hash || !user.refresh_token_expires_at || user.refresh_token_expires_at.getTime() < Date.now()) {
      return null;
    }

    const matches = await bcrypt.compare(token, user.refresh_token_hash);
    if (!matches) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export function registerAuthRoutes(app: Express) {
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    const body = getBody<{ name: string; email: string; password: string }>(req);

    if (!body.name || !body.email || !body.password) {
      return res.status(400).json(success(null, 'Name, email, and password are required'));
    }

    const email = body.email.trim().toLowerCase();
    const existing = await loadUserByEmail(email);

    if (existing) {
      return res.status(409).json(success(null, 'Account already exists'));
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const otp = generateOtp();
    const otpCodeHash = await bcrypt.hash(otp, 12);

    const created = await query<UserRow>(
      `
        INSERT INTO users (name, email, password_hash, phone, role, wallet_balance, verified_at, otp_code_hash, otp_expires_at)
        VALUES ($1, $2, $3, NULL, 'user', 0, NULL, $4, NOW() + ($5 || ' minutes')::interval)
        RETURNING id::text, name, email, password_hash, phone, role, wallet_balance, created_at, verified_at,
                  otp_code_hash, otp_expires_at, refresh_token_hash, refresh_token_expires_at
      `,
      [body.name.trim(), email, passwordHash, otpCodeHash, String(env.otpExpiresInMinutes)],
    );

    const user = created.rows[0];

    return res.status(201).json(
      success(
        {
          user: publicUser(user),
          otpHint: otp,
        },
        'Registration started. Verify the OTP to continue.',
      ),
    );
  });

  app.post('/api/auth/request-otp', async (req: Request, res: Response) => {
    const body = getBody<{ email: string }>(req);

    if (!body.email) {
      return res.status(400).json(success(null, 'Email is required'));
    }

    const email = body.email.trim().toLowerCase();
    const user = await loadUserByEmail(email);

    if (!user) {
      return res.status(404).json(success(null, 'Account not found'));
    }

    const otp = generateOtp();
    await storeOtp(email, otp);

    return res.json(success({ email, otpHint: otp }, 'OTP generated successfully.'));
  });

  app.post('/api/auth/verify-otp', async (req: Request, res: Response) => {
    const body = getBody<{ email: string; otp: string }>(req);

    if (!body.email || !body.otp) {
      return res.status(400).json(success(null, 'Email and OTP are required'));
    }

    const email = body.email.trim().toLowerCase();
    const user = await loadUserByEmail(email);

    if (!user) {
      return res.status(404).json(success(null, 'Account not found'));
    }

    if (!user.otp_code_hash || !user.otp_expires_at || user.otp_expires_at.getTime() < Date.now()) {
      return res.status(410).json(success(null, 'OTP expired. Request a new one.'));
    }

    const matches = await bcrypt.compare(body.otp.trim(), user.otp_code_hash);
    if (!matches) {
      return res.status(401).json(success(null, 'Invalid OTP'));
    }

    const verified = await query<UserRow>(
      `
        UPDATE users
        SET verified_at = NOW(),
            otp_code_hash = NULL,
            otp_expires_at = NULL
        WHERE email = $1
        RETURNING id::text, name, email, password_hash, phone, role, wallet_balance, created_at, verified_at,
                  otp_code_hash, otp_expires_at, refresh_token_hash, refresh_token_expires_at
      `,
      [email],
    );

    const verifiedUser = verified.rows[0];
    await issueSession(res, verifiedUser);

    return res.json(success({ user: publicUser(verifiedUser) }, 'OTP verified successfully.'));
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const body = getBody<{ email: string; password: string }>(req);

    if (!body.email || !body.password) {
      return res.status(400).json(success(null, 'Email and password are required'));
    }

    const email = body.email.trim().toLowerCase();
    const user = await loadUserByEmail(email);

    if (!user) {
      return res.status(401).json(success(null, 'Invalid credentials'));
    }

    if (!user.verified_at) {
      return res.status(403).json(success(null, 'Verify OTP before logging in'));
    }

    const matches = await bcrypt.compare(body.password, user.password_hash);
    if (!matches) {
      return res.status(401).json(success(null, 'Invalid credentials'));
    }

    await issueSession(res, user);

    return res.json(success({ user: publicUser(user) }, 'Login successful.'));
  });

  app.post('/api/auth/refresh', async (req: Request, res: Response) => {
    const user = await verifyRefreshToken(req);

    if (!user) {
      return res.status(401).json(success(null, 'Refresh token is invalid or expired'));
    }

    const refreshed = await query<UserRow>(
      `
        SELECT id::text, name, email, password_hash, phone, role, wallet_balance, created_at, verified_at,
               otp_code_hash, otp_expires_at, refresh_token_hash, refresh_token_expires_at
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [user.id],
    );

    const currentUser = refreshed.rows[0];

    if (!currentUser) {
      return res.status(401).json(success(null, 'Session could not be refreshed'));
    }

    await issueSession(res, currentUser);

    return res.json(success({ user: publicUser(currentUser) }, 'Session refreshed.'));
  });

  app.post('/api/auth/logout', async (req: Request, res: Response) => {
    const user = await verifyRefreshToken(req);

    if (user) {
      await query('UPDATE users SET refresh_token_hash = NULL, refresh_token_expires_at = NULL WHERE id = $1', [user.id]);
    }

    clearAuthCookies(res);
    return res.json(success(null, 'Logged out successfully.'));
  });

  app.get('/api/auth/me', async (req: Request, res: Response) => {
    const user = await verifyAccessToken(req);

    if (!user) {
      return res.status(401).json(success(null, 'Not authenticated'));
    }

    return res.json(success({ user: publicUser(user) }, 'Current user loaded.'));
  });
}