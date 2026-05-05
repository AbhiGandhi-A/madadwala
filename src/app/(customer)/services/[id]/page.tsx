'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SkeletonCardList } from '@/components/common/Skeleton';
import { useLocation } from '@/hooks/useLocation';
import { getServiceById, queryCollection } from '@/lib/firestore-service';
import { calculateDistance } from '@/lib/utils';
import type { Service, Provider } from '@/types';
import {
  MapPin,
  Star,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { where } from 'firebase/firestore';

export default function ServiceListingPage() {
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');
  const { location } = useLocation();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch service details
        const serviceData = await getServiceById(serviceId);
        setService(serviceData as Service);

        // Fetch providers offering this service
        const providersData = await queryCollection('users', [
          where('role', '==', 'provider'),
          where('serviceCategories', 'array-contains', serviceId),
          where('verified', '==', true),
        ]);

        setProviders(providersData as unknown as Provider[]);
      } catch (error) {
        console.error('Error loading service:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [serviceId]);

  // Sort providers
  const sortedProviders = [...providers].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'price' && service?.basePrice) {
      return (a.wallet?.balance || 0) - (b.wallet?.balance || 0);
    } else if (sortBy === 'distance' && location) {
      const distA = calculateDistance(
        location.latitude,
        location.longitude,
        a.location.latitude,
        a.location.longitude
      );
      const distB = calculateDistance(
        location.latitude,
        location.longitude,
        b.location.latitude,
        b.location.longitude
      );
      return distA - distB;
    }
    return 0;
  });

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['customer']}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <SkeletonCardList count={6} />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Header */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-8 md:py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/home"
              className="flex items-center gap-2 text-primary hover:text-primary-600 mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">{service?.icon}</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {service?.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {service?.description}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {(['distance', 'rating', 'price'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                    sortBy === option
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-700 hover:border-primary'
                  }`}
                >
                  <Filter className="w-4 h-4 inline mr-2" />
                  {option}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Providers List */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {sortedProviders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No verified providers available for this service.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProviders.map((provider) => (
                  <ProviderCard
                    key={provider.uid}
                    provider={provider}
                    location={location}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

/**
 * Provider card component
 */
function ProviderCard({
  provider,
  location,
}: {
  provider: Provider;
  location: { latitude: number; longitude: number } | null;
}) {
  const distance = location
    ? calculateDistance(
        location.latitude,
        location.longitude,
        provider.location.latitude,
        provider.location.longitude
      )
    : null;

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile */}
        <div className="md:col-span-2">
          <div className="flex gap-4">
            {provider.profileImage && (
              <img
                src={provider.profileImage}
                alt={provider.displayName}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">
                {provider.displayName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {provider.experience}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {provider.location.address}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">
              {provider.rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({provider.totalRatings})
            </span>
          </div>

          {/* Distance */}
          {distance !== null && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-gray-600 dark:text-gray-400">
                {distance.toFixed(1)} km away
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 md:justify-end">
          <Link
            href={`/booking/${provider.uid}`}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-600 transition font-medium text-center"
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Book Now
          </Link>
          <button className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition font-medium flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
