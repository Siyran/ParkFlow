import { useState } from 'react';
import { registerAccount } from '../lib/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await registerAccount({ name, email, password });
    setMessage(response.data?.otpHint ? `${response.message} Demo OTP: ${response.data.otpHint}` : response.message);
  }

  return (
    <section>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <input placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button type="submit">Create account</button>
      </form>
      {message ? <p>{message}</p> : null}
    </section>
  );
}
