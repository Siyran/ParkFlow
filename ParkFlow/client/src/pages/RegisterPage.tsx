import { useState } from 'react';
import { registerAccount } from '../lib/api';

type RegisterPageProps = {
  onAuthenticated?: () => void;
};

export default function RegisterPage({ onAuthenticated }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await registerAccount({ name, email, password });
    setMessage(response.data?.otpHint ? `${response.message} Demo OTP: ${response.data.otpHint}` : response.message);
    if (response.success) {
      onAuthenticated?.();
    }
  }

  return (
    <section>
      <h2 className="text-lg font-bold">Create an account</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 max-w-sm mt-3">
        <label className="block">
          <div className="text-sm font-medium">Full name</div>
          <input className="mt-1 w-full border rounded p-2" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Email</div>
          <input className="mt-1 w-full border rounded p-2" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Password</div>
          <input className="mt-1 w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <div className="flex gap-2">
          <button type="submit" className="px-3 py-2 bg-gray-900 text-white rounded">Create account</button>
          <button type="button" className="px-3 py-2 border rounded" onClick={() => { setName(''); setEmail(''); setPassword(''); setMessage(''); }}>Reset</button>
        </div>
      </form>
      {message ? <p className="mt-3 text-sm text-teal-700">{message}</p> : null}
    </section>
  );
}
