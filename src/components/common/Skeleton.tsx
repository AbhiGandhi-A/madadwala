'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'card' | 'text' | 'circle' | 'rectangle';
}

/**
 * Skeleton loader component
 */
export function Skeleton({ className, variant = 'rectangle', ...props }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600';

  const variantClasses = {
    card: 'h-48 rounded-lg',
    text: 'h-4 rounded w-full',
    circle: 'h-10 w-10 rounded-full',
    rectangle: 'h-12 rounded-lg',
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

/**
 * Skeleton card for loading states
 */
export function SkeletonCard() {
  return (
    <div className="space-y-4">
      <Skeleton variant="rectangle" className="h-48 rounded-lg" />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="circle" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-3 w-1/3" />
          <Skeleton variant="text" className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}

/**
 * Multiple skeleton cards for list loading
 */
export function SkeletonCardList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
