export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string;
  error: string | null;
};

async function request<T>(path: string, body: unknown) {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  return (await response.json()) as ApiResponse<T>;
}

export function registerAccount(payload: { name: string; email: string; password: string }) {
  return request<{ user: unknown; otpHint: string }>('/api/auth/register', payload);
}

export function requestOtp(payload: { email: string }) {
  return request<{ email: string; otpHint: string }>('/api/auth/request-otp', payload);
}

export function verifyOtp(payload: { email: string; otp: string }) {
  return request<{ user: unknown }>('/api/auth/verify-otp', payload);
}

export function loginAccount(payload: { email: string; password: string }) {
  return request<{ user: unknown }>('/api/auth/login', payload);
}