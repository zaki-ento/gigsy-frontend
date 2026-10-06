'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.token || response.data?.token) {
        login(response.token || response.data?.token);
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Background Orbs */}
      <div className="orb-blue w-[600px] h-[600px] absolute -top-40 -left-40 opacity-30" />
      <div className="orb-purple w-[500px] h-[500px] absolute -bottom-40 -right-40 opacity-25" />
      <div className="orb-pink w-[300px] h-[300px] absolute top-1/3 right-1/4 opacity-15" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-auto px-4"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center btn-primary">
              <SparklesIcon className="w-6 h-6 text-white relative z-10" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              Gig<span className="gradient-text-blue">neo</span>
            </span>
          </Link>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Sign in to access your Gigneo account
            </p>
          </motion.div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="glass-card rounded-3xl p-8 border"
          style={{ borderColor: 'var(--border)' }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 px-4 py-3 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-dark w-full pl-12 pr-4 py-4 rounded-2xl text-sm"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <div className="relative">
                <LockClosedIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-dark w-full pl-12 pr-12 py-4 rounded-2xl text-sm"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--accent-blue)' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 rounded-2xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid var(--border)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                New to Gigneo?
              </span>
            </div>
          </div>

          <Link
            href="/register"
            className="block text-center py-3.5 rounded-2xl text-sm font-semibold transition-all hover:bg-white/10"
            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            Create an account →
          </Link>
        </motion.div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          By continuing, you agree to Gigneo's{' '}
          <a href="#" className="hover:text-white underline underline-offset-2">Terms</a>
          {' '}and{' '}
          <a href="#" className="hover:text-white underline underline-offset-2">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  );
}
