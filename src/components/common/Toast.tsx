'use client';

import { useToast } from '@/context/ToastContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Toast notification component
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: ReturnType<typeof useToast>['toasts'][0];
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const bgColorMap = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColorMap = {
    success: 'text-emerald-900',
    error: 'text-red-900',
    warning: 'text-amber-900',
    info: 'text-blue-900',
  };

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-lg border p-4 ${bgColorMap[toast.type]} ${textColorMap[toast.type]} animate-in fade-in slide-in-from-bottom-4 duration-300`}
      role="alert"
    >
      {iconMap[toast.type]}
      <div className="flex-1 text-sm font-medium leading-5">{toast.message}</div>
      <button
        onClick={onClose}
        className="inline-flex flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
