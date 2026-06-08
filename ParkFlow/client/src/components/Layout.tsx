import React from 'react';
import Header from './Header';

export default function Layout({ children, user, onLogout, onNavigate, currentView }: { children: React.ReactNode; user?: any; onLogout?: () => void; onNavigate?: (view: string) => void; currentView?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-parkflow-bg to-white text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-gradient-to-r from-white to-transparent p-5 rounded-2xl shadow-sm">
          <Header user={user} onLogout={onLogout} onNavigate={onNavigate} currentView={currentView} />
        </div>

        <main className="mt-6">{children}</main>
      </div>
    </div>
  );
}
