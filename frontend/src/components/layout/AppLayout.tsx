import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 selection:bg-orange-500 selection:text-white">
      {/* Glow ambient background spots */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
