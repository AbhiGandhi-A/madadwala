'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById } from '@/lib/firestore-service';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  userRole: UserRole | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setError(null);
        if (firebaseUser) {
          setFirebaseUser(firebaseUser);
          
          // Fetch user data from Firestore
          const userData = await getUserById(firebaseUser.uid);
          
          if (userData) {
            setUser(userData as User);
            setUserRole((userData as any).role || null);
          } else {
            // User authenticated but no profile yet
            setUser(null);
            setUserRole(null);
          }
        } else {
          setFirebaseUser(null);
          setUser(null);
          setUserRole(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user data';
        setError(errorMessage);
        console.error('Auth state change error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
      setUserRole(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      console.error('Sign out error:', err);
      throw err;
    }
  };

  const refreshUserData = async () => {
    if (!firebaseUser) return;
    
    try {
      setError(null);
      const userData = await getUserById(firebaseUser.uid);
      
      if (userData) {
        setUser(userData as User);
        setUserRole((userData as any).role || null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh user data';
      setError(errorMessage);
      console.error('Refresh user data error:', err);
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    userRole,
    loading,
    error,
    isAuthenticated: !!user && !!firebaseUser,
    signOut,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook to get current user role
 */
export function useUserRole(): UserRole | null {
  const { userRole } = useAuth();
  return userRole;
}
