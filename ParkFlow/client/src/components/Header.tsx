import React from 'react';
import { IconMap } from './Icon';
import Button from './Button';

export default function Header({ user, onLogout, onNavigate }: { user?: any; onLogout?: () => void; onNavigate?: (view: string) => void }) {
  const views = ['home', 'overview', 'map', 'bookings', 'wallet', 'profile', 'settings'];

  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><IconMap /> ParkFlow</h1>
        <p className="text-sm text-gray-600">Parking marketplace</p>
      </div>

      <nav className="flex items-center gap-2">
        {views.map((v) => (
          <button key={v} className="px-3 py-1 rounded-full text-sm bg-white text-gray-900 border border-gray-200" onClick={() => onNavigate?.(v)}>
            {v}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {user ? <div className="text-sm text-gray-600">Signed in as {user.name}</div> : <div className="text-sm text-gray-600">Not signed in</div>}
        {user ? <Button variant="ghost" onClick={onLogout}>Logout</Button> : null}
      </div>
    </header>
  );
}
