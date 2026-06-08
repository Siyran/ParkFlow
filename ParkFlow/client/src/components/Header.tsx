import React, { useState } from 'react';
import { IconMap } from './Icon';
import Button from './Button';
import { HiMenu } from 'react-icons/hi';

export default function Header({ user, onLogout, onNavigate, currentView }: { user?: any; onLogout?: () => void; onNavigate?: (view: string) => void; currentView?: string }) {
  const views = ['home', 'overview', 'map', 'bookings', 'wallet', 'profile', 'settings'];
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <IconMap />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">ParkFlow</h1>
            <div className="text-sm text-gray-500">Parking marketplace</div>
          </div>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-3">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onNavigate?.(v)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${currentView === v ? 'bg-parkflow-primary text-white shadow' : 'bg-white text-gray-800 border border-gray-200'}`}
          >
            {v}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <div className="hidden md:block text-sm text-gray-600">{user ? `Signed in as ${user.name}` : 'Not signed in'}</div>
        {user ? <Button variant="ghost" onClick={onLogout}>Logout</Button> : null}
        <button className="md:hidden p-2 rounded-lg bg-white border" onClick={() => setOpen((s) => !s)} aria-label="menu">
          <HiMenu size={20} />
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="md:hidden absolute left-4 right-4 top-20 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex flex-col gap-2">
            {views.map((v) => (
              <button key={v} onClick={() => { onNavigate?.(v); setOpen(false); }} className={`text-left px-3 py-2 rounded ${currentView === v ? 'bg-parkflow-primary text-white' : 'text-gray-700'}`}>{v}</button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
