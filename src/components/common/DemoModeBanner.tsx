'use client';

import Link from 'next/link';

export function DemoModeBanner() {
  const isConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (isConfigured) {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-100 px-4 py-3 text-center text-sm">
      <span>Running in demo mode. </span>
      <Link href="/setup" className="font-semibold hover:underline">
        Configure Firebase →
      </Link>
    </div>
  );
}
