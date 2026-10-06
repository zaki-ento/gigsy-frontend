'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { EnvelopeIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetchApi('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setMessage(res.message || 'If that email exists, a reset link is on its way.');
    } catch (err: any) {
      setError(err.message || 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-card rounded-3xl p-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <span className="w-10 h-10 rounded-2xl btn-primary flex items-center justify-center">
            <SparklesIcon className="w-5 h-5" />
          </span>
          <span className="text-xl font-bold">Gigneo</span>
        </Link>
        <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Reset password</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          We will email a link to choose a new password.
        </p>
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        {message && <p className="mb-4 text-sm" style={{ color: 'var(--accent-teal)' }}>{message}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-dark w-full pl-12 pr-4 py-4 rounded-2xl text-sm"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-4 rounded-2xl text-sm font-bold disabled:opacity-50">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <Link href="/login" className="block text-center text-sm mt-6" style={{ color: 'var(--accent-blue)' }}>
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
