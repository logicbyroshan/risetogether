import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const JoinPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !password2) return;

    try {
      setIsSubmitting(true);
      await register({
        username: username.trim() || undefined,
        email,
        password,
        password2,
        role,
      });
      navigate('/feed', { replace: true });
    } catch (err) {
      // Handled by AuthContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasLength = password.length >= 8;
  const hasMatch = password && password === password2;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="/assets/images/logo.png"
              alt="RiseTogether Logo"
              className="w-14 h-14 rounded-[3px] object-cover border border-neutral-800 mx-auto mb-4 hover:border-neutral-700 transition-colors"
            />
          </Link>
          <h2 className="font-rajdhani font-bold text-3xl text-white tracking-wide">
            JOIN RISE TOGETHER
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Create an account to start contributing, sharing blogs, and connecting.
          </p>
        </div>

        {/* Card */}
        <Card className="border border-orange-500/30 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="developer_handle"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Community Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-700/80 rounded-xl text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="member">General Member</option>
                  <option value="visitor">Visitor</option>
                  <option value="co_lead">Co-Lead Contributor</option>
                </select>
              </div>
            </div>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
            </div>

            {/* Validation indicators */}
            <div className="flex flex-wrap gap-4 text-xs pt-1">
              <span className={`flex items-center gap-1 ${hasLength ? 'text-emerald-400' : 'text-gray-500'}`}>
                <Check className="w-3.5 h-3.5" /> At least 8 characters
              </span>
              <span className={`flex items-center gap-1 ${hasMatch ? 'text-emerald-400' : 'text-gray-500'}`}>
                <Check className="w-3.5 h-3.5" /> Passwords match
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-3"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Free Account
            </Button>
          </form>

          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 font-bold hover:underline">
              Log in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
