import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  QueryConstraint,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Booking, Review, ChatMessage, Service } from '@/types';

// Check if Firestore is available
const isFirestoreAvailable = () => {
  if (!db) {
    console.warn('[Firestore] Database not initialized. Running in demo mode.');
    return false;
  }
  return true;
};

/**
 * USER OPERATIONS
 */

export async function getUserById(uid: string) {
  try {
    if (!isFirestoreAvailable()) {
      return null;
    }
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    // Return null in demo mode instead of throwing
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return null;
    }
    throw error;
  }
}

export async function createUser(uid: string, userData: Partial<User>) {
  try {
    if (!isFirestoreAvailable()) {
      return { id: uid, ...userData };
    }
    const userRef = doc(db, 'users', uid);
    const docData = {
      ...userData,
      uid,
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await setDoc(userRef, docData);
    return { id: uid, ...docData };
  } catch (error) {
    console.error('Error creating user:', error);
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return { id: uid, ...userData };
    }
    throw error;
  }
}

export async function updateUser(uid: string, updateData: Partial<User>) {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

/**
 * SERVICE OPERATIONS
 */

export async function getServiceById(serviceId: string) {
  try {
    const serviceDoc = await getDoc(doc(db, 'services', serviceId));
    if (serviceDoc.exists()) {
      return { id: serviceDoc.id, ...serviceDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
}

export async function getAllServices() {
  try {
    const q = query(collection(db, 'services'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

export async function createService(serviceData: Partial<Service>) {
  try {
    const servicesRef = collection(db, 'services');
    const docRef = await addDoc(servicesRef, {
      ...serviceData,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, ...serviceData };
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

/**
 * BOOKING OPERATIONS
 */

export async function getBookingById(bookingId: string) {
  try {
    const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
    if (bookingDoc.exists()) {
      return { id: bookingDoc.id, ...bookingDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
}

export async function createBooking(bookingData: Partial<Booking>) {
  try {
    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, ...bookingData };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function updateBooking(bookingId: string, updateData: Partial<Booking>) {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
}

export async function getCustomerBookings(customerId: string) {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    throw error;
  }
}

export async function getProviderBookings(providerId: string) {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    throw error;
  }
}

export async function getProviderPendingRequests(providerId: string) {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('providerId', '==', providerId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    throw error;
  }
}

/**
 * REVIEW OPERATIONS
 */

export async function getReviewById(reviewId: string) {
  try {
    const reviewDoc = await getDoc(doc(db, 'reviews', reviewId));
    if (reviewDoc.exists()) {
      return { id: reviewDoc.id, ...reviewDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching review:', error);
    throw error;
  }
}

export async function createReview(reviewData: Partial<Review>) {
  try {
    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      ...reviewData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, ...reviewData };
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

export async function getProviderReviews(providerId: string) {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching provider reviews:', error);
    throw error;
  }
}

export async function updateProviderRating(providerId: string, newRating: number, totalRatings: number) {
  try {
    const userRef = doc(db, 'users', providerId);
    await updateDoc(userRef, {
      rating: newRating,
      totalRatings: totalRatings,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating provider rating:', error);
    throw error;
  }
}

/**
 * CHAT OPERATIONS
 */

export async function getChatRoomById(roomId: string) {
  try {
    const roomDoc = await getDoc(doc(db, 'chats', roomId));
    if (roomDoc.exists()) {
      return { id: roomDoc.id, ...roomDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching chat room:', error);
    throw error;
  }
}

export async function createChatRoom(participants: string[]) {
  try {
    const chatsRef = collection(db, 'chats');
    const docRef = await addDoc(chatsRef, {
      participants: participants.sort(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, participants };
  } catch (error) {
    console.error('Error creating chat room:', error);
    throw error;
  }
}

export async function findChatRoom(userId1: string, userId2: string) {
  try {
    const participants = [userId1, userId2].sort();
    const q = query(
      collection(db, 'chats'),
      where('participants', '==', participants)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error finding chat room:', error);
    throw error;
  }
}

export async function addChatMessage(roomId: string, messageData: Partial<ChatMessage>) {
  try {
    const messagesRef = collection(db, 'chats', roomId, 'messages');
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      status: 'sent',
      createdAt: Timestamp.now(),
    });
    
    // Update last message in room
    const roomRef = doc(db, 'chats', roomId);
    await updateDoc(roomRef, {
      lastMessage: messageData.message,
      lastMessageTime: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error('Error adding chat message:', error);
    throw error;
  }
}

export async function getChatMessages(roomId: string, pageSize: number = 50) {
  try {
    const q = query(
      collection(db, 'chats', roomId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
}

/**
 * HELPER FUNCTIONS
 */

export async function queryCollection(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error querying ${collectionName}:`, error);
    throw error;
  }
}
