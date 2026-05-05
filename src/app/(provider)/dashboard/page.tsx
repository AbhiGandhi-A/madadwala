'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SkeletonCardList } from '@/components/common/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getProviderPendingRequests, getProviderBookings, updateBooking } from '@/lib/firestore-service';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { Briefcase, TrendingUp, CheckCircle, Clock, DollarSign } from 'lucide-react';
import type { Booking } from '@/types';

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [pendingRequests, setPendingRequests] = useState<Booking[]>([]);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'earnings'>('overview');
  const [respondingId, setRespondingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== 'provider') return;

      try {
        setLoading(true);

        // Load pending requests
        const pending = await getProviderPendingRequests(user.uid);
        setPendingRequests(pending as Booking[]);

        // Load all bookings to calculate stats
        const allBookings = await getProviderBookings(user.uid);
        const bookings = allBookings as Booking[];

        // Filter active and completed
        const active = bookings.filter((b) =>
          ['accepted', 'in_progress'].includes(b.status)
        );
        setActiveBookings(active);

        const completed = bookings.filter((b) => b.status === 'completed').length;
        setCompletedCount(completed);

        // Calculate earnings
        const earnings = bookings
          .filter((b) => b.status === 'completed')
          .reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice), 0);
        setTotalEarnings(earnings);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, showError]);

  const handleAcceptRequest = async (bookingId: string) => {
    setRespondingId(bookingId);
    try {
      await updateBooking(bookingId, {
        status: 'accepted',
      } as any);

      setPendingRequests((prev) => prev.filter((r) => r.id !== bookingId));
      const booking = pendingRequests.find((r) => r.id === bookingId);
      if (booking) {
        setActiveBookings((prev) => [...prev, { ...booking, status: 'accepted' }]);
      }

      showSuccess('Request accepted!');
    } catch (error) {
      console.error('Error accepting request:', error);
      showError('Failed to accept request');
    } finally {
      setRespondingId(null);
    }
  };

  const handleRejectRequest = async (bookingId: string) => {
    setRespondingId(bookingId);
    try {
      await updateBooking(bookingId, {
        status: 'cancelled',
      } as any);

      setPendingRequests((prev) => prev.filter((r) => r.id !== bookingId));
      showSuccess('Request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      showError('Failed to reject request');
    } finally {
      setRespondingId(null);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['provider']}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <SkeletonCardList count={3} />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome, {user?.displayName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your bookings and track your earnings
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Total Earnings"
              value={`₹${totalEarnings}`}
              color="text-emerald-600"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="Jobs Completed"
              value={completedCount.toString()}
              color="text-blue-600"
            />
            <StatCard
              icon={<Briefcase className="w-6 h-6" />}
              title="Active Jobs"
              value={activeBookings.length.toString()}
              color="text-purple-600"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              title="Pending Requests"
              value={pendingRequests.length.toString()}
              color="text-amber-600"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800">
            {(
              ['overview', 'requests', 'earnings'] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium transition capitalize border-b-2 ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Active Jobs
                </h2>
                {activeBookings.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">
                    No active jobs at the moment.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {activeBookings.slice(0, 3).map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No pending requests.
                </p>
              ) : (
                pendingRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                    isResponding={respondingId === request.id}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Earnings Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                    <p className="text-3xl font-bold text-primary">₹{totalEarnings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed Jobs</p>
                    <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

/**
 * Stat card component
 */
function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className={`${color} mb-4`}>{icon}</div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

/**
 * Booking card component
 */
function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDateTime(booking.bookingDate)}
          </p>
          <p className="font-semibold text-foreground">{booking.location.address}</p>
          {booking.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {booking.notes}
            </p>
          )}
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
          {booking.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}

/**
 * Request card component
 */
function RequestCard({
  request,
  onAccept,
  onReject,
  isResponding,
}: {
  request: Booking;
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  isResponding: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDateTime(request.bookingDate)}
          </p>
          <p className="font-semibold text-foreground">{request.location.address}</p>
          {request.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Notes: {request.notes}
            </p>
          )}
          <p className="text-sm font-semibold text-primary mt-2">
            Est. ₹{request.estimatedPrice}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onReject(request.id)}
            disabled={isResponding}
            className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition font-medium text-sm"
          >
            Decline
          </button>
          <button
            onClick={() => onAccept(request.id)}
            disabled={isResponding}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition font-medium text-sm"
          >
            {isResponding ? 'Processing...' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}
