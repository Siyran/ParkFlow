import { useState } from 'react';
import { verifyOtp } from '../lib/api';

type OtpVerificationPageProps = {
  onAuthenticated?: () => void;
};

export default function OtpVerificationPage({ onAuthenticated }: OtpVerificationPageProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('123456');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await verifyOtp({ email, otp });
    setMessage(response.message);
    if (response.success) {
      onAuthenticated?.();
    }
  }

  return (
    <section>
      <h2 className="text-lg font-bold">OTP Verification</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 max-w-sm mt-3">
        <input className="border rounded p-2" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input className="border rounded p-2" placeholder="OTP" value={otp} onChange={(event) => setOtp(event.target.value)} />
        <button type="submit" className="px-3 py-2 bg-gray-900 text-white rounded">Verify OTP</button>
      </form>
      {message ? <p className="mt-3 text-sm text-teal-700">{message}</p> : null}
    </section>
  );
}
