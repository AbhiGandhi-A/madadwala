'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SkeletonCardList } from '@/components/common/Skeleton';
import { useLocation } from '@/hooks/useLocation';
import { getAllServices } from '@/lib/firestore-service';
import type { Service } from '@/types';
import { MapPin, Search, Star } from 'lucide-react';

export default function CustomerHomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { location } = useLocation();

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const fetchedServices = await getAllServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section with Location */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Location Display */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-gray-600 dark:text-gray-400">
                {location
                  ? `Searching nearby services at (${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)})`
                  : 'Enable location to find services nearby'}
              </span>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services (electrician, plumber, cleaning...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Find Local Services
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Browse available services and book your appointment
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <SkeletonCardList count={6} />
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No services found matching your search.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary hover:underline font-medium"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
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
 * Service card component
 */
function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.id}`}>
      <div className="h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-shadow cursor-pointer">
        {/* Icon */}
        <div className="text-4xl mb-4">{service.icon}</div>

        {/* Name */}
        <h3 className="text-xl font-bold text-foreground mb-2">{service.name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {service.description}
        </p>

        {/* Price and Rating */}
        <div className="flex items-center justify-between">
          {service.basePrice && (
            <span className="text-sm font-semibold text-primary">
              From ₹{service.basePrice}
            </span>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>4.8 (128)</span>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full mt-4 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-600 transition font-medium text-sm">
          Book Now
        </button>
      </div>
    </Link>
  );
}
