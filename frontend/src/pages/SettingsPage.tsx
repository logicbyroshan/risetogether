import React, { useState, useEffect } from 'react';
import { Bell, Shield, Key, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { accountsApi } from '../api/accounts';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preferences?.notifications_enabled ?? true
  );
  const [isSaving, setIsSaving] = useState(false);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    accountsApi.getPreferences().then((res) => {
      setNotificationsEnabled(res.preferences.notifications_enabled);
    }).catch(console.error);
  }, []);

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);
      const res = await accountsApi.updatePreferences({
        notifications_enabled: notificationsEnabled,
      });
      success(res.message || 'Preferences saved.');
    } catch (err: any) {
      toastError(err.customMessage || 'Failed to update preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-gray-800">
        <Badge variant="orange" size="md" className="mb-2">ACCOUNT & PREFERENCES</Badge>
        <h1 className="font-rajdhani font-bold text-4xl sm:text-5xl text-white tracking-tight">
          SETTINGS
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Manage your notification preferences, account security, and active session details.
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications Preference Card */}
        <Card className="border border-gray-800 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
            <div className="p-2.5 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-rajdhani font-bold text-xl text-white">Notifications</h3>
              <p className="text-xs text-gray-400">Choose how you receive community and activity alerts.</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-950/70 border border-gray-800">
            <div>
              <div className="text-sm font-bold text-gray-200">Community Interaction Alerts</div>
              <div className="text-xs text-gray-400 mt-0.5">
                Receive notifications when peers like your posts or reply to your comments.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
            </label>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={handleSavePreferences} isLoading={isSaving}>
              Save Preferences
            </Button>
          </div>
        </Card>

        {/* Security & Password Card */}
        <Card className="border border-gray-800 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-rajdhani font-bold text-xl text-white">Account & Password</h3>
              <p className="text-xs text-gray-400">Manage password and security authentication.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-950/70 border border-gray-800">
            <div>
              <div className="text-sm font-bold text-gray-200">Change Account Password</div>
              <div className="text-xs text-gray-400 mt-0.5">
                Send a secure password reset link to your registered email ({user?.email}).
              </div>
            </div>
            <Link to="/password-reset">
              <Button variant="outline" size="sm" leftIcon={<Key className="w-4 h-4 text-orange-400" />}>
                Reset Password
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
