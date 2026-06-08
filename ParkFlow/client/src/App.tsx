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
import { useAuthSession } from './hooks/useAuthSession';
import Layout from './components/Layout';

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
  const { user, loading, logout, reloadSession, message } = useAuthSession();
  const ActiveView = views[view];

  const handleAuthenticated = async () => {
    await reloadSession();
    setView('overview');
  };

  return (
    <Layout user={user} onLogout={logout} onNavigate={(v) => setView(v as keyof typeof views)}>
      {message ? <p className="mt-2 text-teal-700">{message}</p> : null}
      <section className="bg-white rounded-xl p-6 mt-6 shadow-lg">
        <ActiveView onAuthenticated={handleAuthenticated} />
      </section>
    </Layout>
  );
}
