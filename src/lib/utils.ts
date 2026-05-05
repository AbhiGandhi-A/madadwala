import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format currency with locale
 */
export function formatCurrency(
  amount: number,
  currency: string = "INR"
): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

/**
 * Format date to readable format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  return /^[0-9]{10}$/.test(phone.replace(/\D/g, ""));
}

/**
 * Validate password strength
 * Returns: weak, medium, strong
 */
export function getPasswordStrength(password: string): "weak" | "medium" | "strong" {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 1) return "weak";
  if (strength <= 2) return "medium";
  return "strong";
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number = 50): string {
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

/**
 * Get user initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Delay function for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get average rating from array of ratings
 */
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
}

/**
 * Check if coordinates are valid
 */
export function isValidCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

/**
 * Parse error message from Firebase error
 */
export function getFirebaseErrorMessage(error: any): string {
  const code = error?.code || "";
  const messages: Record<string, string> = {
    "auth/weak-password": "Password is too weak. Use at least 6 characters.",
    "auth/email-already-in-use": "Email is already registered.",
    "auth/invalid-email": "Invalid email address.",
    "auth/user-not-found": "User not found.",
    "auth/wrong-password": "Incorrect password.",
    "auth/too-many-requests": "Too many login attempts. Try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/account-exists-with-different-credential":
      "An account with this email already exists.",
  };

  return messages[code] || error?.message || "An error occurred.";
}

/**
 * Convert Firestore timestamp to Date
 */
export function firestoreTimestampToDate(timestamp: any): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp.toDate) return timestamp.toDate(); // Firestore timestamp
  return new Date(timestamp);
}

/**
 * Format service category name
 */
export function formatServiceName(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Check if two coordinates are close (within X km)
 */
export function areCoordinatesClose(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  maxDistanceKm: number = 50
): boolean {
  return calculateDistance(lat1, lon1, lat2, lon2) <= maxDistanceKm;
}
