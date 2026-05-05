import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
} from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload file to Firebase Storage
 * Returns download URL
 */
export async function uploadFile(
  path: string,
  file: File
): Promise<string> {
  try {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Upload file with progress tracking
 * Returns upload task and promise
 */
export function uploadFileWithProgress(
  path: string,
  file: File
): {
  task: UploadTask;
  promise: Promise<string>;
} {
  const fileRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(fileRef, file);

  const promise = new Promise<string>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload progress:', progress);
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });

  return { task: uploadTask, promise };
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(
  userId: string,
  file: File
): Promise<string> {
  const path = `profiles/${userId}/${Date.now()}-${file.name}`;
  return uploadFile(path, file);
}

/**
 * Upload provider ID proof
 */
export async function uploadIdProof(
  providerId: string,
  file: File
): Promise<string> {
  const path = `id-proofs/${providerId}/${Date.now()}-${file.name}`;
  return uploadFile(path, file);
}

/**
 * Upload booking image (receipt, work photo, etc.)
 */
export async function uploadBookingImage(
  bookingId: string,
  file: File
): Promise<string> {
  const path = `bookings/${bookingId}/${Date.now()}-${file.name}`;
  return uploadFile(path, file);
}

/**
 * Upload review image
 */
export async function uploadReviewImage(
  reviewId: string,
  file: File
): Promise<string> {
  const path = `reviews/${reviewId}/${Date.now()}-${file.name}`;
  return uploadFile(path, file);
}

/**
 * Upload chat attachment
 */
export async function uploadChatAttachment(
  roomId: string,
  file: File
): Promise<string> {
  const path = `chats/${roomId}/${Date.now()}-${file.name}`;
  return uploadFile(path, file);
}

/**
 * Delete file from Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
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
