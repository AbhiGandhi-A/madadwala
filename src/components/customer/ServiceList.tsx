'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin, DollarSign } from 'lucide-react';
import type { Provider } from '@/types';

interface ServiceListProps {
  providers: Provider[];
  isLoading?: boolean;
  onFilterChange?: (category: string) => void;
}

export function ServiceList({
  providers,
  isLoading = false,
  onFilterChange,
}: ServiceListProps) {
  const [filteredProviders, setFilteredProviders] = useState(providers);

  useEffect(() => {
    setFilteredProviders(providers);
  }, [providers]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 animate-pulse"
          >
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredProviders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No services available in your area.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Try adjusting your filters or location.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProviders.map((provider) => (
        <ProviderCard key={provider.uid} provider={provider} />
      ))}
    </div>
  );
}

/**
 * Individual provider card
 */
function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Link href={`/booking/${provider.uid}`}>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg hover:border-primary transition cursor-pointer h-full flex flex-col">
        {/* Image */}
        {provider.profileImage && (
          <img
            src={provider.profileImage}
            alt={provider.displayName}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        )}

        {/* Name & Experience */}
        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">
          {provider.displayName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
          {provider.experience}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(provider.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">
            {provider.rating.toFixed(1)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{provider.location.city}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <DollarSign className="w-4 h-4" />
          <span>From ₹{provider.wallet?.balance || 300}</span>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {provider.serviceCategories.slice(0, 2).map((service) => (
            <span
              key={service}
              className="px-2 py-1 rounded text-xs bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300"
            >
              {service}
            </span>
          ))}
          {provider.serviceCategories.length > 2 && (
            <span className="px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-400">
              +{provider.serviceCategories.length - 2} more
            </span>
          )}
        </div>

        {/* CTA Button */}
        <button className="w-full mt-auto px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-600 transition font-medium text-sm">
          Book Now
        </button>
      </div>
    </Link>
  );
}
