'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { updateUser } from '@/lib/firestore-service';
import { useToast } from '@/context/ToastContext';
import { Moon, Sun, Bell, Lock, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const { theme, setTheme } = useTheme();

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load preferences from user data if available
    if ((user as any)?.preferences) {
      setPreferences((user as any).preferences);
    }
  }, [user]);

  const handleSavePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUser(user.uid, {
        preferences,
      } as any);
      showSuccess('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      showError('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      showError('Failed to logout');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account and preferences
            </p>
          </div>

          {/* Theme */}
          <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Appearance
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your preferred theme
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-lg transition ${
                    theme === 'light'
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary'
                  }`}
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-lg transition ${
                    theme === 'dark'
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`px-3 py-2 rounded-lg transition text-sm font-medium ${
                    theme === 'system'
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary'
                  }`}
                >
                  System
                </button>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <NotificationToggle
                label="Email Notifications"
                description="Receive notifications about bookings and messages"
                checked={preferences.emailNotifications}
                onChange={(value) =>
                  setPreferences({ ...preferences, emailNotifications: value })
                }
              />
              <NotificationToggle
                label="Push Notifications"
                description="Receive push notifications on your device"
                checked={preferences.pushNotifications}
                onChange={(value) =>
                  setPreferences({ ...preferences, pushNotifications: value })
                }
              />
              <NotificationToggle
                label="Marketing Emails"
                description="Receive promotional emails and special offers"
                checked={preferences.marketingEmails}
                onChange={(value) =>
                  setPreferences({ ...preferences, marketingEmails: value })
                }
              />
            </div>

            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="mt-6 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-600 disabled:opacity-50 transition font-medium"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </section>

          {/* Security */}
          <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Security</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your password regularly to keep your account secure
                </p>
              </button>
            </div>
          </section>

          {/* Account */}
          <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Account
            </h2>

            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-foreground font-medium">{user?.email}</p>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
              <p className="text-foreground font-medium capitalize">
                {user?.role}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}

/**
 * Notification toggle component
 */
function NotificationToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
