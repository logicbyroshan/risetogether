import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/feed';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsSubmitting(true);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      // Handled by AuthContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="/assets/images/logo.png"
              alt="RiseTogether Logo"
              className="w-12 h-12 rounded-[3px] object-cover border border-neutral-800 mx-auto mb-3.5 hover:border-neutral-700 transition-colors bg-neutral-900"
            />
          </Link>
          <h2 className="font-rajdhani font-bold text-3xl text-white tracking-wide">
            WELCOME BACK
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Sign in to continue connecting with your developer peers.
          </p>
        </div>

        {/* Card */}
        <Card className="border border-neutral-800 p-8 shadow-2xl bg-neutral-950/90">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
              required
              autoFocus
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/password-reset"
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 px-3.5 bg-black border border-neutral-800 rounded-[3px] text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500 pr-10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Log In to Account
            </Button>
          </form>

          <div className="border-t border-neutral-800 mt-6 pt-6 text-center text-xs text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/join" className="text-orange-400 font-bold hover:underline">
              Join the community
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
