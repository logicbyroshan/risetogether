import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authApi } from '../api/auth';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const PasswordResetConfirmPage: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !token || !password || !password2) return;

    try {
      setIsSubmitting(true);
      const res = await authApi.confirmPasswordReset({
        uid,
        token,
        password,
        password2,
      });
      success(res.message);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      toastError(err.customMessage || 'Password reset link is invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="/assets/images/logo.png"
              alt="RiseTogether Logo"
              className="w-14 h-14 rounded-[3px] object-cover border border-orange-500/40 mx-auto mb-4 shadow-xl shadow-orange-500/20 hover:scale-105 transition-transform"
            />
          </Link>
          <h2 className="font-rajdhani font-bold text-3xl text-white tracking-wide">
            SET NEW PASSWORD
          </h2>
        </div>

        <Card className="border border-orange-500/30 p-8 shadow-2xl">
          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white font-rajdhani">Password Updated!</h3>
              <p className="text-sm text-gray-300">
                Your password has been changed. Redirecting you to login...
              </p>
              <Link to="/login" className="block pt-2">
                <Button variant="primary" size="md" className="w-full">
                  Log In Now
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  New Password
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
                  Confirm New Password
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full mt-2"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Reset Password
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
