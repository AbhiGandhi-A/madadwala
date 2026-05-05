'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useToast } from '@/context/ToastContext';
import { queryCollection, updateUser } from '@/lib/firestore-service';
import { Users, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { where } from 'firebase/firestore';
import type { User, Provider } from '@/types';

export default function AdminDashboardPage() {
  const { showSuccess, showError } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'providers'>(
    'overview'
  );
  const [suspendingId, setSuspendingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load users
        const usersData = await queryCollection('users', [
          where('role', '==', 'customer'),
        ]);
        setUsers(usersData as unknown as User[]);

        // Load providers
        const providersData = await queryCollection('users', [
          where('role', '==', 'provider'),
        ]);
        setProviders(providersData as unknown as Provider[]);
      } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showError]);

  const handleSuspendUser = async (uid: string) => {
    setSuspendingId(uid);
    try {
      await updateUser(uid, {
        status: 'suspended',
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.uid === uid ? { ...u, status: 'suspended' } : u
        )
      );

      showSuccess('User suspended successfully');
    } catch (error) {
      console.error('Error suspending user:', error);
      showError('Failed to suspend user');
    } finally {
      setSuspendingId(null);
    }
  };

  const handleVerifyProvider = async (uid: string) => {
    try {
      await updateUser(uid, {
        verified: true,
      });

      setProviders((prev) =>
        prev.map((p) =>
          p.uid === uid ? { ...p, verified: true } : p
        )
      );

      showSuccess('Provider verified successfully');
    } catch (error) {
      console.error('Error verifying provider:', error);
      showError('Failed to verify provider');
    }
  };

  const verifiedProviders = providers.filter((p) => p.verified).length;

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage users, providers, and platform settings
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              label="Total Users"
              value={users.length.toString()}
            />
            <StatCard
              icon={<Shield className="w-6 h-6" />}
              label="Total Providers"
              value={providers.length.toString()}
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Verified Providers"
              value={verifiedProviders.toString()}
            />
            <StatCard
              icon={<AlertCircle className="w-6 h-6" />}
              label="Pending Verification"
              value={(providers.length - verifiedProviders).toString()}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800">
            {(['overview', 'users', 'providers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium transition capitalize border-b-2 ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Platform Overview
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Active Users
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {users.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Active Providers
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {providers.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              {loading ? (
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No users yet.</p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <UserRow
                      key={user.uid}
                      user={user}
                      onSuspend={handleSuspendUser}
                      isSuspending={suspendingId === user.uid}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'providers' && (
            <div className="space-y-4">
              {loading ? (
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              ) : providers.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No providers yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {providers.map((provider) => (
                    <ProviderRow
                      key={provider.uid}
                      provider={provider}
                      onVerify={handleVerifyProvider}
                      onSuspend={handleSuspendUser}
                      isSuspending={suspendingId === provider.uid}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

/**
 * Stat card
 */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="text-gray-600 dark:text-gray-400 mb-2">{icon}</div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

/**
 * User row
 */
function UserRow({
  user,
  onSuspend,
  isSuspending,
}: {
  user: User;
  onSuspend: (uid: string) => Promise<void>;
  isSuspending: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex items-center justify-between">
      <div>
        <p className="font-semibold text-foreground">{user.displayName}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
        <span
          className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
            user.status === 'active'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200'
              : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'
          }`}
        >
          {user.status}
        </span>
      </div>
      <button
        onClick={() => onSuspend(user.uid)}
        disabled={isSuspending || user.status === 'suspended'}
        className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition text-sm font-medium"
      >
        {isSuspending ? 'Suspending...' : 'Suspend'}
      </button>
    </div>
  );
}

/**
 * Provider row
 */
function ProviderRow({
  provider,
  onVerify,
  onSuspend,
  isSuspending,
}: {
  provider: Provider;
  onVerify: (uid: string) => Promise<void>;
  onSuspend: (uid: string) => Promise<void>;
  isSuspending: boolean;
}) {
  const providerData = provider;
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-semibold text-foreground">
            {provider.displayName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {provider.email}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {providerData.experience}
          </p>
          <div className="flex gap-2 mt-2">
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${
                providerData.verified
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200'
                  : 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
              }`}
            >
              {providerData.verified ? 'Verified' : 'Pending'}
            </span>
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${
                provider.status === 'active'
                  ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                  : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'
              }`}
            >
              {provider.status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {!providerData.verified && (
            <button
              onClick={() => onVerify(provider.uid)}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition text-sm font-medium"
            >
              Verify
            </button>
          )}
          <button
            onClick={() => onSuspend(provider.uid)}
            disabled={isSuspending}
            className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition text-sm font-medium"
          >
            {isSuspending ? 'Suspending...' : 'Suspend'}
          </button>
        </div>
      </div>
    </div>
  );
}
