import type { Express, Request, Response } from 'express';
import { success } from '../response.ts';

type Role = 'user' | 'owner' | 'admin';

type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  verified: boolean;
};

const users = new Map<string, DemoUser>();
const otpCodes = new Map<string, string>();

function createToken(prefix: string, email: string) {
  return `${prefix}.${Buffer.from(email).toString('base64url')}.${Date.now()}`;
}

function getBody<T>(req: Request) {
  return req.body as Partial<T>;
}

function publicUser(user: DemoUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.verified,
  };
}

function registerDemoRoutes(app: Express) {
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const body = getBody<{ name: string; email: string; password: string }>(req);

    if (!body.name || !body.email || !body.password) {
      return res.status(400).json(success(null, 'Name, email, and password are required'));
    }

    const email = body.email.trim().toLowerCase();
    if (users.has(email)) {
      return res.status(409).json(success(null, 'Account already exists'));
    }

    const user: DemoUser = {
      id: `user_${users.size + 1}`,
      name: body.name.trim(),
      email,
      password: body.password,
      role: 'user',
      verified: false,
    };

    users.set(email, user);

    const otp = '123456';
    otpCodes.set(email, otp);

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

  app.post('/api/auth/request-otp', (req: Request, res: Response) => {
    const body = getBody<{ email: string }>(req);

    if (!body.email) {
      return res.status(400).json(success(null, 'Email is required'));
    }

    const email = body.email.trim().toLowerCase();
    const user = users.get(email);

    if (!user) {
      return res.status(404).json(success(null, 'Account not found'));
    }

    const otp = '123456';
    otpCodes.set(email, otp);

    return res.json(
      success(
        {
          email,
          otpHint: otp,
        },
        'OTP generated for the demo environment.',
      ),
    );
  });

  app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
    const body = getBody<{ email: string; otp: string }>(req);

    if (!body.email || !body.otp) {
      return res.status(400).json(success(null, 'Email and OTP are required'));
    }

    const email = body.email.trim().toLowerCase();
    const user = users.get(email);

    if (!user) {
      return res.status(404).json(success(null, 'Account not found'));
    }

    if (otpCodes.get(email) !== body.otp.trim()) {
      return res.status(401).json(success(null, 'Invalid OTP'));
    }

    user.verified = true;
    otpCodes.delete(email);

    return res.json(
      success(
        {
          user: publicUser(user),
        },
        'OTP verified successfully.',
      ),
    );
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const body = getBody<{ email: string; password: string }>(req);

    if (!body.email || !body.password) {
      return res.status(400).json(success(null, 'Email and password are required'));
    }

    const email = body.email.trim().toLowerCase();
    const user = users.get(email);

    if (!user || user.password !== body.password) {
      return res.status(401).json(success(null, 'Invalid credentials'));
    }

    if (!user.verified) {
      return res.status(403).json(success(null, 'Verify OTP before logging in'));
    }

    return res.json(
      success(
        {
          user: publicUser(user),
          accessToken: createToken('access', user.email),
          refreshToken: createToken('refresh', user.email),
        },
        'Login successful.',
      ),
    );
  });
}

export { registerDemoRoutes };