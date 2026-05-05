'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Modal } from '@/components/common/Modal';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { createBooking, getUserById } from '@/lib/firestore-service';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, MapPin, Clock, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import type { Provider, Booking } from '@/types';

export default function BookingPage() {
  const params = useParams();
  const providerId = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    address: '',
    notes: '',
  });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Load provider data
  useState(() => {
    const loadProvider = async () => {
      try {
        const data = await getUserById(providerId);
        setProvider(data as Provider);
      } catch (error) {
        console.error('Error loading provider:', error);
        showError('Failed to load provider details');
      }
    };
    loadProvider();
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.date || !bookingData.time || !bookingData.address) {
      showError('Please fill in all required fields');
      return;
    }

    setConfirmModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!user || !provider) return;

    setLoading(true);
    try {
      const bookingDateTime = new Date(`${bookingData.date}T${bookingData.time}`);
      
      const newBooking = await createBooking({
        customerId: user.uid,
        providerId: provider.uid,
        serviceId: provider.serviceCategories[0], // First service category
        bookingDate: bookingDateTime,
        location: {
          latitude: 0, // Should be user's location
          longitude: 0,
          address: bookingData.address,
        },
        notes: bookingData.notes,
        estimatedPrice: provider.wallet?.balance || 300,
      } as any);

      showSuccess('Booking requested successfully! Provider will respond soon.');
      setConfirmModalOpen(false);
      
      // Redirect to bookings page
      setTimeout(() => {
        router.push('/bookings');
      }, 1500);
    } catch (error) {
      console.error('Booking error:', error);
      showError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!provider) {
    return (
      <ProtectedRoute allowedRoles={['customer']}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">Loading provider details...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            href="/home"
            className="flex items-center gap-2 text-primary hover:text-primary-600 mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Provider Card */}
            <div className="md:col-span-1">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sticky top-24">
                {provider.profileImage && (
                  <img
                    src={provider.profileImage}
                    alt={provider.displayName}
                    className="w-full h-40 rounded-lg object-cover mb-4"
                  />
                )}
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {provider.displayName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {provider.experience}
                </p>
                
                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rating:</span>
                    <span className="font-semibold text-foreground">
                      {provider.rating.toFixed(1)} ⭐
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {provider.location.city || 'Local'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      From ₹{provider.wallet?.balance || 300}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="md:col-span-2">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                <h1 className="text-2xl font-bold text-foreground mb-6">
                  Book Service
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.date}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, date: e.target.value })
                      }
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      required
                      value={bookingData.time}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, time: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Service Address
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={bookingData.address}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, address: e.target.value })
                      }
                      placeholder="Enter the complete address for the service"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={bookingData.notes}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, notes: e.target.value })
                      }
                      placeholder="Add any special requirements or notes"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Estimated Price */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Estimated Price:
                      </span>
                      <span className="text-lg font-bold text-primary">
                        ₹{provider.wallet?.balance || 300}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Final price may vary based on service complexity
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    {loading ? 'Processing...' : 'Request Service'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <Modal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          title="Confirm Booking"
          size="md"
          footer={
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-600 disabled:opacity-50 transition font-medium"
              >
                {loading ? 'Booking...' : 'Confirm'}
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Date & Time:</p>
              <p className="font-semibold text-foreground">
                {bookingData.date && bookingData.time
                  ? `${formatDate(bookingData.date)} at ${bookingData.time}`
                  : 'Not selected'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Address:</p>
              <p className="font-semibold text-foreground">{bookingData.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Price:</p>
              <p className="font-semibold text-primary text-lg">
                ₹{provider.wallet?.balance || 300}
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
