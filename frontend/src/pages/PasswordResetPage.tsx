import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authApi } from '../api/auth';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const PasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { success, error: toastError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      const res = await authApi.requestPasswordReset(email);
      success(res.message);
      setIsSuccess(true);
    } catch (err: any) {
      toastError(err.customMessage || 'Failed to request password reset.');
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
            RESET PASSWORD
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Enter your email and we'll send you recovery instructions.
          </p>
        </div>

        <Card className="border border-orange-500/30 p-8 shadow-2xl">
          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white font-rajdhani">Check Your Email</h3>
              <p className="text-sm text-gray-300">
                If an account exists with <strong className="text-orange-400">{email}</strong>, you will receive password reset link instructions shortly.
              </p>
              <Link to="/login" className="block pt-2">
                <Button variant="secondary" size="md" className="w-full">
                  Return to Log In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                required
                autoFocus
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full mt-2"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Reset Link
              </Button>

              <div className="border-t border-gray-800 mt-6 pt-6 text-center text-xs text-gray-400">
                Remember your password?{' '}
                <Link to="/login" className="text-orange-400 font-bold hover:underline">
                  Log in
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
