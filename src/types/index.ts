/**
 * Core type definitions for MadadWala platform
 */

// User roles in the system
export type UserRole = 'customer' | 'provider' | 'admin';

// User account status
export type UserStatus = 'active' | 'suspended' | 'deleted';

// Booking status lifecycle
export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

// Payment status
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

/**
 * Base User type - shared across all user types
 */
export interface BaseUser {
  uid: string;
  email: string;
  displayName: string;
  profileImage?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Customer-specific user profile
 */
export interface Customer extends BaseUser {
  role: 'customer';
  savedProviders: string[]; // Array of provider UIDs
  preferences?: {
    notificationsEnabled: boolean;
    searchHistory: string[];
  };
}

/**
 * Service category definition
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  category: string;
  basePrice?: number;
  createdAt: Date;
}

/**
 * Provider-specific user profile
 */
export interface Provider extends BaseUser {
  role: 'provider';
  serviceCategories: string[]; // Service IDs the provider offers
  experience: string; // Years and description
  bio: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    state?: string;
    zipcode?: string;
  };
  rating: number; // 0-5 average rating
  totalRatings: number;
  verified: boolean;
  idProofUrl?: string;
  wallet: {
    balance: number;
    currency: string; // INR, USD, etc.
    accountType?: string; // bank, upi, etc.
  };
  availability?: {
    workingDays: string[]; // Mon, Tue, etc.
    startTime: string; // HH:MM
    endTime: string; // HH:MM
  };
}

/**
 * Admin-specific user profile
 */
export interface Admin extends BaseUser {
  role: 'admin';
  permissions: string[]; // manage_users, manage_services, etc.
}

/**
 * Union type for any user
 */
export type User = Customer | Provider | Admin;

/**
 * Booking request
 */
export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  status: BookingStatus;
  bookingDate: Date;
  completionDate?: Date;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes?: string;
  estimatedPrice: number;
  finalPrice?: number;
  specialRequests?: string;
  paymentStatus?: PaymentStatus;
  cancellationReason?: string;
  cancellationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Review and rating
 */
export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  images?: string[]; // URLs
  helpful?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat room for communication
 */
export interface ChatRoom {
  id: string;
  participants: string[]; // User UIDs
  lastMessage?: string;
  lastMessageTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat message
 */
export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  message: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  attachments?: string[]; // URLs to files/images
}

/**
 * Service availability calendar
 */
export interface ServiceAvailability {
  id: string;
  providerId: string;
  date: Date;
  slots: {
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    available: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Wallet transaction
 */
export interface WalletTransaction {
  id: string;
  providerId: string;
  amount: number;
  type: 'earning' | 'withdrawal' | 'refund' | 'bonus';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  bookingId?: string;
  createdAt: Date;
}

/**
 * Coupon/Discount
 */
export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (0-100) or fixed amount
  minBookingAmount?: number;
  maxUses: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  active: boolean;
  createdAt: Date;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
