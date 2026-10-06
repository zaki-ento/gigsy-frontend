'use client';

import { useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'freelancer' | 'employer'>('freelancer');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError('You must agree to the terms and privacy policy.'); return; }
    setError('');
    setIsLoading(true);

    try {
      const response = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          user_name: username,
          password,
          user_role: role,
          term_and_privacy: agreed ? '1' : '0',
        }),
      });

      if (response.token || response.data?.token) {
        login(response.token || response.data?.token);
        router.push('/dashboard');
      } else if (response.type === 'success') {
        router.push('/login?registered=1');
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-10"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="orb-purple w-[600px] h-[600px] absolute -top-40 -right-40 opacity-25" />
      <div className="orb-blue w-[500px] h-[500px] absolute -bottom-40 -left-40 opacity-25" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-auto px-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center btn-primary">
              <SparklesIcon className="w-6 h-6 text-white relative z-10" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              Gig<span className="gradient-text-blue">neo</span>
            </span>
          </Link>
          <div className="mt-6">
            <h1 className="text-3xl font-black text-white mb-2">Join Gigneo</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Create your account and start today
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="glass-card rounded-3xl p-8"
          style={{ border: '1px solid var(--border)' }}
        >
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('freelancer')}
              className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-semibold transition-all ${
                role === 'freelancer' ? 'border-[rgba(79,110,247,0.5)]' : ''
              }`}
              style={{
                background: role === 'freelancer' ? 'rgba(79,110,247,0.15)' : 'var(--bg-card)',
                border: `1px solid ${role === 'freelancer' ? 'rgba(79,110,247,0.4)' : 'var(--border)'}`,
                color: role === 'freelancer' ? '#7d9bff' : 'var(--text-secondary)',
              }}
            >
              <BriefcaseIcon className="w-5 h-5 shrink-0" />
              <span>Freelancer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-semibold transition-all`}
              style={{
                background: role === 'employer' ? 'rgba(151,71,255,0.15)' : 'var(--bg-card)',
                border: `1px solid ${role === 'employer' ? 'rgba(151,71,255,0.4)' : 'var(--border)'}`,
                color: role === 'employer' ? '#b87fff' : 'var(--text-secondary)',
              }}
            >
              <BuildingOfficeIcon className="w-5 h-5 shrink-0" />
              <span>Employer</span>
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  First Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    id="register-fname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="input-dark w-full pl-10 pr-3 py-3.5 rounded-xl text-sm"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="register-lname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="input-dark w-full px-3 py-3.5 rounded-xl text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>@</span>
                <input
                  type="text"
                  id="register-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  required
                  className="input-dark w-full pl-8 pr-4 py-3.5 rounded-xl text-sm"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  id="register-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-dark w-full pl-11 pr-4 py-3.5 rounded-xl text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="input-dark w-full pl-11 pr-12 py-3.5 rounded-xl text-sm"
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setAgreed(!agreed)}
                className="mt-0.5 w-5 h-5 rounded-md shrink-0 flex items-center justify-center transition-all border"
                style={{
                  background: agreed ? 'var(--accent-blue)' : 'transparent',
                  borderColor: agreed ? 'var(--accent-blue)' : 'var(--border)',
                }}
              >
                {agreed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                I agree to the{' '}
                <a href="#" className="hover:text-white underline underline-offset-2" style={{ color: 'var(--accent-blue)' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="hover:text-white underline underline-offset-2" style={{ color: 'var(--accent-blue)' }}>Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              id="register-submit"
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
                    Creating account...
                  </span>
                ) : (
                  `Create ${role === 'freelancer' ? 'Freelancer' : 'Employer'} Account`
                )}
              </span>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid var(--border)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                Already have an account?
              </span>
            </div>
          </div>

          <Link
            href="/login"
            className="block text-center py-3.5 rounded-2xl text-sm font-semibold transition-all hover:bg-white/10"
            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            Sign in instead
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
