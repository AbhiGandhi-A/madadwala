'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SkeletonCardList } from '@/components/common/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getCustomerBookings, updateBooking } from '@/lib/firestore-service';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { Calendar, MapPin, User, DollarSign, X } from 'lucide-react';
import type { Booking } from '@/types';

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-700',
  accepted: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-700',
  in_progress: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-200 dark:border-purple-700',
  completed: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-700',
  cancelled: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-700',
};

export default function BookingsPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>(
    'all'
  );
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user || user.role !== 'customer') return;

      try {
        setLoading(true);
        const data = await getCustomerBookings(user.uid);
        setBookings(data as Booking[]);
      } catch (error) {
        console.error('Error loading bookings:', error);
        showError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user, showError]);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return booking.status === 'pending';
    if (filter === 'active')
      return ['accepted', 'in_progress'].includes(booking.status);
    if (filter === 'completed') return booking.status === 'completed';
    return true;
  });

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await updateBooking(bookingId, {
        status: 'cancelled',
        cancellationDate: new Date(),
        cancellationReason: 'Cancelled by customer',
      } as any);

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );

      showSuccess('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showError('Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage your service bookings
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(
              ['all', 'pending', 'active', 'completed'] as const
            ).map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  filter === option
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-700 hover:border-primary'
                }`}
              >
                {option === 'in_progress' ? 'In Progress' : option}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {loading ? (
            <SkeletonCardList count={3} />
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No bookings found in this category.
              </p>
              <a
                href="/home"
                className="text-primary hover:underline font-medium"
              >
                Browse services
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                  isCancelling={cancellingId === booking.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

/**
 * Booking card component
 */
function BookingCard({
  booking,
  onCancel,
  isCancelling,
}: {
  booking: Booking;
  onCancel: (id: string) => Promise<void>;
  isCancelling: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Booking Details */}
        <div className="md:col-span-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Booking #{booking.id.slice(0, 8)}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  statusColors[booking.status as keyof typeof statusColors]
                }`}
              >
                {booking.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatDateTime(booking.bookingDate)}</span>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{booking.location.address}</span>
            </div>

            {booking.notes && (
              <div className="text-sm">
                <p className="text-gray-600 dark:text-gray-400">Notes:</p>
                <p className="text-foreground">{booking.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Estimated Price</p>
            <p className="text-lg font-bold text-primary">
              ₹{booking.estimatedPrice}
            </p>
          </div>

          {booking.finalPrice && (
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Final Price</p>
              <p className="text-lg font-bold text-foreground">
                ₹{booking.finalPrice}
              </p>
            </div>
          )}

          {booking.status === 'completed' && !booking.rating && (
            <div className="text-xs text-amber-600 dark:text-amber-400">
              <p>Review pending</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 md:justify-end">
          {['pending', 'accepted'].includes(booking.status) && (
            <button
              onClick={() => onCancel(booking.id)}
              disabled={isCancelling}
              className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              {isCancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}

          {booking.status === 'completed' && !booking.rating && (
            <button className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-600 transition font-medium text-sm">
              Leave Review
            </button>
          )}

          <button className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition font-medium text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
