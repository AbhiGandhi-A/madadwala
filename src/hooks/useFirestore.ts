import { useState, useCallback } from 'react';

export interface UseFirestoreOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseFirestoreReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (fn: () => Promise<T>) => Promise<T>;
}

/**
 * Hook for Firestore operations with loading and error states
 */
export function useFirestore<T>(
  options?: UseFirestoreOptions<T>
): UseFirestoreReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (fn: () => Promise<T>): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn();
        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return {
    data,
    loading,
    error,
    execute,
  };
}

/**
 * Hook for real-time Firestore listeners
 */
export function useFirestoreListener<T>(
  listener: (onUpdate: (data: T) => void) => () => void,
  initialData: T | null = null
) {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useState(() => {
    setLoading(true);
    
    try {
      const unsubscribe = listener((newData: T) => {
        setData(newData);
        setLoading(false);
        setError(null);
      });

      return () => {
        unsubscribe();
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setLoading(false);
    }
  });

  return { data, loading, error };
}
