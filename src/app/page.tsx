'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { DemoModeBanner } from '@/components/common/DemoModeBanner';
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import ProCTA from "@/components/ProCTA";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function Home() {
  const { isAuthenticated, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && userRole) {
      // Redirect authenticated users to their dashboard
      if (userRole === 'provider') {
        router.replace('/provider/dashboard');
      } else if (userRole === 'customer') {
        router.replace('/home');
      } else if (userRole === 'admin') {
        router.replace('/admin/dashboard');
      }
    }
  }, [isAuthenticated, userRole, loading, router]);

  // Show landing page for unauthenticated users
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <DemoModeBanner />
      <Navbar />
      <Hero />
      <Categories />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <ProCTA />
      <Footer />
      <MobileBottomNav />
    </main>
  );
}
