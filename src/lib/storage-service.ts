/**
 * Storage service for file uploads
 * Currently using Vercel Blob for file storage
 * You can extend this with more providers as needed
 */

/**
 * Upload file to storage
 * Currently a placeholder - integrate with Vercel Blob or similar service
 */
export async function uploadFile(
  path: string,
  file: File
): Promise<string> {
  try {
    // TODO: Implement file storage integration (Vercel Blob, AWS S3, etc.)
    // For now, returning a placeholder URL
    const fileName = `${Date.now()}-${file.name}`;
    console.warn('[Storage] File upload not yet implemented. Placeholder:', fileName);
    return `https://storage.example.com/${path}/${fileName}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Upload file with progress tracking
 */
export function uploadFileWithProgress(
  path: string,
  file: File
): {
  promise: Promise<string>;
} {
  const promise = uploadFile(path, file);

  return { promise };
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(
  userId: string,
  file: File
): Promise<string> {
  const path = `profiles/${userId}`;
  return uploadFile(path, file);
}

/**
 * Upload provider ID proof
 */
export async function uploadIdProof(
  providerId: string,
  file: File
): Promise<string> {
  const path = `id-proofs/${providerId}`;
  return uploadFile(path, file);
}

/**
 * Upload booking image (receipt, work photo, etc.)
 */
export async function uploadBookingImage(
  bookingId: string,
  file: File
): Promise<string> {
  const path = `bookings/${bookingId}`;
  return uploadFile(path, file);
}

/**
 * Upload review image
 */
export async function uploadReviewImage(
  reviewId: string,
  file: File
): Promise<string> {
  const path = `reviews/${reviewId}`;
  return uploadFile(path, file);
}

/**
 * Upload chat attachment
 */
export async function uploadChatAttachment(
  roomId: string,
  file: File
): Promise<string> {
  const path = `chats/${roomId}`;
  return uploadFile(path, file);
}

/**
 * Delete file from storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    // TODO: Implement file deletion
    console.warn('[Storage] File deletion not yet implemented for:', path);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Validate image file
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return false;
  }

  if (file.size > maxSize) {
    return false;
  }

  return true;
}

/**
 * Get image preview
 */
export async function getImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate file size
 */
export function getFileSize(file: File): string {
  const bytes = file.size;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate document file
 */
export function isValidDocumentFile(file: File): boolean {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return false;
  }

  if (file.size > maxSize) {
    return false;
  }

  return true;
}
