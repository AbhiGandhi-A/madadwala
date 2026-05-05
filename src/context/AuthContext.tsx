'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
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
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setError(null);
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data?.user) {
            setUser(data.data.user as User);
            setUserRole(data.data.user.role);
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      } catch (err) {
        console.warn('[Auth] Could not fetch user data:', err);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signOut = async () => {
    try {
      setError(null);
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
      setUserRole(null);
      router.push('/login');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      console.error('Sign out error:', err);
      throw err;
    }
  };

  const refreshUserData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.user) {
          setUser(data.data.user as User);
          setUserRole(data.data.user.role);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh user data';
      setError(errorMessage);
      console.error('Refresh user data error:', err);
    }
  };

  const value: AuthContextType = {
    user,
    userRole,
    loading,
    error,
    isAuthenticated: !!user && !!userRole,
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
