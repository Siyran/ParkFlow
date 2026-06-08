import { useState } from 'react';
import BookingsPage from './pages/BookingsPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import OverviewPage from './pages/OverviewPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import WalletPage from './pages/WalletPage';
import AdminPage from './pages/AdminPage';

const views = {
  home: HomePage,
  overview: OverviewPage,
  map: MapPage,
  bookings: BookingsPage,
  wallet: WalletPage,
  profile: ProfilePage,
  settings: SettingsPage,
  login: LoginPage,
  register: RegisterPage,
  otp: OtpVerificationPage,
  admin: AdminPage,
} as const;

export default function App() {
  const [view, setView] = useState<keyof typeof views>('home');
  const ActiveView = views[view];

  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>ParkFlow</h1>
          <p style={{ margin: '0.25rem 0 0' }}>Parking marketplace scaffold ready.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.keys(views).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key as keyof typeof views)}
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: 999,
                background: view === key ? '#0f172a' : 'white',
                color: view === key ? 'white' : '#0f172a',
                padding: '0.5rem 0.85rem',
                cursor: 'pointer',
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </header>

      <section style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: 24, background: 'white', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)' }}>
        <ActiveView />
      </section>
    </main>
  );
}
