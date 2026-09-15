import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center mx-auto text-orange-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="font-rajdhani font-bold text-6xl text-white">404</h1>
        <h2 className="font-rajdhani font-bold text-2xl text-gray-200">PAGE NOT FOUND</h2>
        <p className="text-sm text-gray-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
