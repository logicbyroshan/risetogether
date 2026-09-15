import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 selection:bg-neutral-800 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-20 bg-black">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
