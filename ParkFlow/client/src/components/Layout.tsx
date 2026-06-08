import React from 'react';
import Header from './Header';

export default function Layout({ children, user, onLogout, onNavigate }: { children: React.ReactNode; user?: any; onLogout?: () => void; onNavigate?: (view: string) => void }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto p-4">
        <Header user={user} onLogout={onLogout} onNavigate={onNavigate} />
        <main className="mt-6">{children}</main>
      </div>
    </div>
  );
}
