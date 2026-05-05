'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { updateUser, getAllServices } from '@/lib/firestore-service';
import { uploadIdProof, isValidImageFile, getImagePreview } from '@/lib/storage-service';
import { useLocation, reverseGeocode } from '@/hooks/useLocation';
import { Upload, MapPin, FileText, Briefcase } from 'lucide-react';
import type { Service } from '@/types';

export default function ProviderRegistrationPage() {
  const router = useRouter();
  const { user, refreshUserData } = useAuth();
  const { showSuccess, showError } = useToast();
  const { location } = useLocation();

  const [services, setServices] = useState<Service[]>([]);
  const [idPreview, setIdPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    serviceCategories: [] as string[],
    experience: '',
    bio: '',
    location: {
      address: '',
      latitude: 0,
      longitude: 0,
      city: '',
    },
  });

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };

    loadServices();
  }, []);

  // Auto-fill location from geolocation
  useEffect(() => {
    if (location) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }));

      // Get address from coordinates
      const getAddress = async () => {
        const address = await reverseGeocode(
          location.latitude,
          location.longitude
        );
        if (address) {
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              city: address,
            },
          }));
        }
      };
      getAddress();
    }
  }, [location]);

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(serviceId)
        ? prev.serviceCategories.filter((s) => s !== serviceId)
        : [...prev.serviceCategories, serviceId],
    }));
  };

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      showError('Invalid image. Please use JPG, PNG, or WebP under 5MB.');
      return;
    }

    try {
      const preview = await getImagePreview(file);
      setIdPreview(preview);
    } catch (error) {
      showError('Failed to preview image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== 'provider') {
      showError('Invalid user type');
      return;
    }

    if (!formData.phone || !formData.serviceCategories.length || !formData.experience) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let idProofUrl = '';

      // Upload ID proof if provided
      const idInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (idInput?.files?.[0]) {
        idProofUrl = await uploadIdProof(user.uid, idInput.files[0]);
      }

      // Update user profile
      await updateUser(user.uid, {
        phone: formData.phone,
        serviceCategories: formData.serviceCategories,
        experience: formData.experience,
        bio: formData.bio,
        location: formData.location,
        idProofUrl: idProofUrl,
        verified: false, // Admin will verify later
      } as any);

      showSuccess('Profile created! Admin will verify your details soon.');
      await refreshUserData();

      setTimeout(() => {
        router.push('/provider/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      showError('Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Help customers find you by providing your professional details
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">
                  Contact Information
                </label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Select Services You Provide
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceToggle(service.id)}
                      type="button"
                      className={`p-3 rounded-lg border-2 transition text-left ${
                        formData.serviceCategories.includes(service.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                      }`}
                    >
                      <div className="text-xl mb-1">{service.icon}</div>
                      <div className="font-medium text-foreground text-sm">
                        {service.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">
                  Experience & Bio
                </label>
                <input
                  type="text"
                  placeholder="e.g., 5 years in electrical work"
                  required
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 mb-3"
                />
                <textarea
                  rows={3}
                  placeholder="Tell customers about yourself and your expertise"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Service Location
                </label>
                <input
                  type="text"
                  placeholder="City/Area"
                  value={formData.location.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        city: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 mb-3"
                />
                <textarea
                  rows={2}
                  placeholder="Full address"
                  value={formData.location.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        address: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* ID Proof */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">
                  <FileText className="w-4 h-4 inline mr-2" />
                  ID Proof (Required for Verification)
                </label>

                {idPreview ? (
                  <div className="mb-4">
                    <img
                      src={idPreview}
                      alt="ID Proof Preview"
                      className="w-full max-h-48 object-cover rounded-lg"
                    />
                  </div>
                ) : null}

                <label className="flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary cursor-pointer transition">
                  <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Upload ID Proof (JPG, PNG, WebP max 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleIdUpload}
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
                {loading ? 'Completing Registration...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
