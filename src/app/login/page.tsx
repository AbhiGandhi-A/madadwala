'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();
  const { userRole } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If user already has a role (authenticated), redirect
    if (userRole) {
      const redirectPath = userRole === 'provider' ? '/provider/dashboard' : '/home';
      router.replace(redirectPath);
    }
  }, [userRole, router]);

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const sendOTP = async () => {
    setError('');
    setStatus('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send OTP. Please try again.');
        setLoading(false);
        return;
      }

      setOtpSent(true);
      setTimeLeft(30 * 60); // 30 minutes in seconds
      setStatus('OTP sent successfully! Check your email.');
      setOtp('');
    } catch (err) {
      console.error('Send OTP error:', err);
      setError('Failed to send OTP. Please try again.');
    }

    setLoading(false);
  };

  const verifyOTP = async () => {
    setError('');
    setStatus('');

    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          otp,
          role: selectedRole,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to verify OTP. Please try again.');
        setLoading(false);
        return;
      }

      // Redirect based on role
      const redirectPath = selectedRole === 'provider' ? '/provider/register' : '/home';
      setStatus('Login successful! Redirecting...');
      setTimeout(() => {
        router.push(redirectPath);
      }, 500);
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError('Failed to verify OTP. Please try again.');
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,159,10,0.22),transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(248,113,20,0.35),transparent_30%),linear-gradient(180deg,#1c1310_0%,#2c1100_40%,#0f172a_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-black/30 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300/90 mb-3">OTP Login</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            <span className="text-amber-400">Madad</span>wala
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-xl mx-auto">
            {otpSent ? 'Enter the OTP sent to your email' : 'Sign in securely with a one-time password'}
          </p>
        </div>

        <div className="space-y-5">
          {!otpSent ? (
            <>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">I am a</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedRole('customer')}
                    disabled={otpSent}
                    className={`flex-1 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition ${
                      selectedRole === 'customer'
                        ? 'border-amber-400 bg-amber-400/20 text-amber-100'
                        : 'border-white/15 bg-white/8 text-white/70 hover:border-white/30 disabled:opacity-60'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => setSelectedRole('provider')}
                    disabled={otpSent}
                    className={`flex-1 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition ${
                      selectedRole === 'provider'
                        ? 'border-emerald-400 bg-emerald-400/20 text-emerald-100'
                        : 'border-white/15 bg-white/8 text-white/70 hover:border-white/30 disabled:opacity-60'
                    }`}
                  >
                    Service Provider
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={otpSent}
                  className="w-full rounded-3xl border border-white/15 bg-white/8 px-5 py-3 text-white placeholder-white/50 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-60"
                />
              </div>

              <button
                onClick={sendOTP}
                disabled={loading || !validateEmail(email)}
                className="w-full rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-base font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="text-sm text-white/70 mb-1">OTP sent to:</p>
                <p className="text-base font-semibold text-white">{email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full rounded-3xl border border-white/15 bg-white/8 px-5 py-3 text-center text-2xl font-semibold text-white placeholder-white/50 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 tracking-widest"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                <span className="text-sm text-white/70">OTP expires in:</span>
                <span className={`text-lg font-semibold ${timeLeft < 60 ? 'text-red-400' : 'text-amber-400'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              <button
                onClick={verifyOTP}
                disabled={loading || otp.length < 6}
                className="w-full rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-base font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Login'}
              </button>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setTimeLeft(0);
                }}
                disabled={loading}
                className="w-full rounded-3xl border border-white/15 bg-white/10 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Change Email
              </button>
            </>
          )}

          {status && <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{status}</p>}
          {error && <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        </div>
      </div>
    </div>
  );
}
  }, [userRole, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentUrl = window.location.href;

    if (isSignInWithEmailLink(auth, currentUrl)) {
      const storedEmail = window.localStorage.getItem(STORAGE_KEY);
      const emailForSignIn = storedEmail || window.prompt('Enter your email to complete sign in:');

      if (!emailForSignIn) {
        setError('Email is required to complete login.');
        return;
      }

      setLoading(true);
      signInWithEmailLink(auth, emailForSignIn, currentUrl)
        .then(async (result) => {
          window.localStorage.removeItem(STORAGE_KEY);
          const userRole = window.localStorage.getItem(STORAGE_ROLE_KEY) as UserRole || 'customer';
          window.localStorage.removeItem(STORAGE_ROLE_KEY);
          
          // Create user profile with role
          const { createUser } = await import('@/lib/firestore-service');
          await createUser(result.user.uid, {
            email: emailForSignIn,
            displayName: emailForSignIn.split('@')[0],
            role: userRole,
            uid: result.user.uid,
          });

          const redirectPath = userRole === 'provider' ? '/provider/register' : '/home';
          router.push(redirectPath);
        })
        .catch((err) => {
          console.error(err);
          setError('Unable to complete login. Request a new email link.');
        })
        .finally(() => setLoading(false));
    } else {
      getRedirectResult(auth)
        .then(async (result) => {
          if (result?.user) {
            const userRole = window.localStorage.getItem(STORAGE_ROLE_KEY) as UserRole || 'customer';
            window.localStorage.removeItem(STORAGE_ROLE_KEY);
            
            // Create user profile with role
            const { createUser } = await import('@/lib/firestore-service');
            await createUser(result.user.uid, {
              email: result.user.email || '',
              displayName: result.user.displayName || result.user.email?.split('@')[0] || 'User',
              profileImage: result.user.photoURL || undefined,
              role: userRole,
              uid: result.user.uid,
            });

            const redirectPath = userRole === 'provider' ? '/provider/register' : '/home';
            router.push(redirectPath);
          }
        })
        .catch((err) => {
          console.error('Google redirect result error:', err);
        });
    }
  }, [router]);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const sendLoginLink = async () => {
    setError('');
    setStatus('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      };

      // Store email and selected role for later use
      window.localStorage.setItem(STORAGE_KEY, email);
      window.localStorage.setItem(STORAGE_ROLE_KEY, selectedRole);

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      setLinkSent(true);
      setStatus('A secure login link has been sent to your inbox. Check your email and click the link to continue.');
    } catch (err) {
      console.error('sendSignInLinkToEmail error:', err);
      setError('Failed to send email link. Please try again or verify your email address.');
    }

    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setError('');
    setStatus('');
    setLoading(true);

    try {
      // Store selected role before redirect
      window.localStorage.setItem(STORAGE_ROLE_KEY, selectedRole);
      
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,159,10,0.22),transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(248,113,20,0.35),transparent_30%),linear-gradient(180deg,#1c1310_0%,#2c1100_40%,#0f172a_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-black/30 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300/90 mb-3">Email Login</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            <span className="text-gradient-orange">Madad</span>wala
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-xl mx-auto">
            Enter your email to get a secure login link. No password needed — just open the email and tap to continue.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">I am a</label>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedRole('customer')}
                className={`flex-1 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition ${
                  selectedRole === 'customer'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-100'
                    : 'border-white/15 bg-white/8 text-white/70 hover:border-white/30'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setSelectedRole('provider')}
                className={`flex-1 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition ${
                  selectedRole === 'provider'
                    ? 'border-emerald-400 bg-emerald-400/20 text-emerald-100'
                    : 'border-white/15 bg-white/8 text-white/70 hover:border-white/30'
                }`}
              >
                Service Provider
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-3xl border border-white/15 bg-white/8 px-5 py-3 text-white placeholder-white/50 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full rounded-3xl border border-white/15 bg-white/10 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue with Google
          </button>

          <div className="relative py-3">
            <div className="absolute inset-x-0 top-1/2 border-t border-white/10" />
            <p className="relative mx-auto inline-block bg-black/30 px-4 text-sm text-white/70">or use email link</p>
          </div>

          <button
            onClick={sendLoginLink}
            disabled={loading || !validateEmail(email)}
            className="w-full rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-base font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending link...' : linkSent ? 'Resend login link' : 'Send login link'}
          </button>

          {status && <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{status}</p>}
          {error && <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

          <p className="text-center text-sm text-white/60">
            Use the same browser when opening the email link. If it doesn’t arrive, check spam or request again.
          </p>
        </div>
      </div>
    </div>
  );
}
