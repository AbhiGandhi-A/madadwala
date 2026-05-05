'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loginMode, setLoginMode] = useState<'otp' | 'password'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { userRole } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined') return;
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

  // Password-based login
  const handlePasswordLogin = async () => {
    setError('');
    setStatus('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      setStatus('Login successful! Redirecting...');
      const redirectPath = data.data.user.role === 'provider' ? '/provider/dashboard' : '/home';
      setTimeout(() => {
        router.push(redirectPath);
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  // OTP flow
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
        headers: { 'Content-Type': 'application/json' },
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
      setTimeLeft(30 * 60); // 30 minutes
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
        headers: { 'Content-Type': 'application/json' },
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            <span className="text-amber-400">Madad</span>wala
          </h1>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300/90 mb-4">
            {loginMode === 'password' ? 'Password Login' : 'OTP Login'}
          </p>
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto">
            {loginMode === 'password'
              ? 'Sign in with your email and password (Demo: customer@demo.com / provider@demo.com)'
              : otpSent
              ? 'Enter the OTP sent to your email'
              : 'Sign in securely with a one-time password'}
          </p>
        </div>

        <div className="space-y-5">
          {/* Login Mode Toggle */}
          {!otpSent && (
            <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => {
                  setLoginMode('password');
                  setError('');
                  setStatus('');
                }}
                className={`flex-1 py-2 px-4 rounded-xl font-semibold transition text-sm ${
                  loginMode === 'password'
                    ? 'bg-amber-400 text-black'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Password
              </button>
              <button
                onClick={() => {
                  setLoginMode('otp');
                  setError('');
                  setStatus('');
                }}
                className={`flex-1 py-2 px-4 rounded-xl font-semibold transition text-sm ${
                  loginMode === 'otp'
                    ? 'bg-amber-400 text-black'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                OTP
              </button>
            </div>
          )}

          {loginMode === 'password' ? (
            <>
              {/* Password Login Form */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@demo.com"
                  className="w-full rounded-3xl border border-white/15 bg-white/8 px-5 py-3 text-white placeholder-white/50 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Demo@12345"
                    className="w-full rounded-3xl border border-white/15 bg-white/8 px-5 py-3 text-white placeholder-white/50 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handlePasswordLogin}
                disabled={loading || !validateEmail(email) || password.length < 6}
                className="w-full rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-base font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center text-sm text-white/60 bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="font-semibold text-white mb-2">Demo Accounts:</p>
                <p>Customer: customer@demo.com</p>
                <p>Provider: provider@demo.com</p>
                <p>Password: Demo@12345</p>
              </div>
            </>
          ) : !otpSent ? (
            <>
              {/* OTP Email Entry */}
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
              {/* OTP Verification */}
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

          {status && (
            <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {status}
            </p>
          )}
          {error && (
            <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
