import { useState } from 'react';
import { verifyOtp } from '../lib/api';

export default function OtpVerificationPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('123456');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await verifyOtp({ email, otp });
    setMessage(response.message);
  }

  return (
    <section>
      <h2>OTP Verification</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input placeholder="OTP" value={otp} onChange={(event) => setOtp(event.target.value)} />
        <button type="submit">Verify OTP</button>
      </form>
      {message ? <p>{message}</p> : null}
    </section>
  );
}
