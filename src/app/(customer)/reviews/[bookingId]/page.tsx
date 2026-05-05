'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import {
  getBookingById,
  createReview,
  updateBooking,
  getProviderReviews,
  updateProviderRating,
} from '@/lib/firestore-service';
import { uploadReviewImage, isValidImageFile, getImagePreview } from '@/lib/storage-service';
import { calculateAverageRating } from '@/lib/utils';
import { Star, Upload } from 'lucide-react';
import { useState as useStateEffect } from 'react';

export default function ReviewPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  // Load booking details
  useState(() => {
    const loadBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (error) {
        console.error('Error loading booking:', error);
      }
    };
    loadBooking();
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      showError('Invalid image. Use JPG, PNG, or WebP under 5MB.');
      return;
    }

    try {
      const preview = await getImagePreview(file);
      setImagePreview(preview);
    } catch (error) {
      showError('Failed to preview image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !booking) {
      showError('Invalid booking');
      return;
    }

    if (!comment.trim()) {
      showError('Please write a review');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';

      // Upload image if provided
      const imageInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (imageInput?.files?.[0]) {
        imageUrl = await uploadReviewImage(bookingId, imageInput.files[0]);
      }

      // Create review
      const review = await createReview({
        bookingId,
        customerId: user.uid,
        providerId: booking.providerId,
        rating,
        title,
        comment,
        images: imageUrl ? [imageUrl] : [],
      } as any);

      // Update booking with rating
      await updateBooking(bookingId, {
        rating,
      } as any);

      // Update provider's average rating
      const providerReviews = await getProviderReviews(booking.providerId);
      const ratings = providerReviews.map((r: any) => r.rating);
      const avgRating = calculateAverageRating(ratings);

      await updateProviderRating(
        booking.providerId,
        avgRating,
        providerReviews.length
      );

      showSuccess('Review submitted successfully!');
      setTimeout(() => {
        router.push('/bookings');
      }, 1500);
    } catch (error) {
      console.error('Error submitting review:', error);
      showError('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <ProtectedRoute allowedRoles={['customer']}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading booking...</p>
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
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Share Your Experience</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Help other customers by rating your service experience
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">
                  How would you rate this service?
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition"
                    >
                      <Star
                        className={`w-12 h-12 ${
                          value <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        } transition`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  placeholder="Summarize your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Your Review
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Share your detailed experience. What did you like? What could be improved?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">
                  Add Photos (Optional)
                </label>

                {imagePreview && (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Review"
                      className="max-h-40 rounded-lg"
                    />
                  </div>
                )}

                <label className="flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary cursor-pointer transition">
                  <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Upload Photo
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {loading ? 'Submitting Review...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
