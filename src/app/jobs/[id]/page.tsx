'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BriefcaseIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserCircleIcon,
  ClockIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function SingleJob() {
  const { id } = useParams();
  const router = useRouter();
  const { token, profile } = useAuth();

  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalData, setProposalData] = useState({
    amount: '',
    duration: '',
    duration_type: 'days',
    message: '',
  });

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetchApi(`/job/${id}`)
      .then((r) => setJob(r.item || r))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!token) { router.push('/login'); return; }
    if (!proposalData.amount || !proposalData.message) {
      alert('Please fill in all required fields.'); return;
    }
    setIsSubmitting(true);
    try {
      await fetchApi('/proposals', {
        method: 'POST',
        body: JSON.stringify({
          job_id: Number(id),
          amount: Number(proposalData.amount),
          duration: Number(proposalData.duration) || 7,
          duration_type: proposalData.duration_type,
          message: proposalData.message,
        }),
      });
      alert('Proposal submitted successfully!');
      router.push('/dashboard/proposals');
    } catch (err: any) {
      alert(err.message || 'Failed to submit proposal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-blue)' }} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white" style={{ background: 'var(--bg-primary)' }}>
        <BriefcaseIcon className="w-16 h-16 mb-4" style={{ color: 'var(--text-muted)' }} />
        <h1 className="text-2xl font-bold mb-3">Job not found</h1>
        <Link href="/jobs" className="flex items-center gap-2" style={{ color: 'var(--accent-blue)' }}>
          <ArrowLeftIcon className="w-4 h-4" /> Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeftIcon className="w-4 h-4" /> Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8 md:p-10">
              <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{job.title}</h1>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: CurrencyDollarIcon, label: 'Budget', value: job.budget_html, valueClass: 'text-green-400' },
                  { icon: BriefcaseIcon, label: 'Experience', value: job.experience || 'Any Level', valueClass: 'text-white' },
                  { icon: UserCircleIcon, label: 'Proposals', value: `${job.proposals || 0} bids`, valueClass: 'text-white' },
                  { icon: ClockIcon, label: 'Posted', value: new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), valueClass: 'text-white' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl p-4 text-center" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>
                    <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--accent-blue)' }} />
                    <div className={`font-bold text-sm ${stat.valueClass}`} dangerouslySetInnerHTML={{ __html: stat.value || '' }} />
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <h2 className="text-lg font-bold text-white mb-4">Project Description</h2>
              <div
                className="prose prose-sm max-w-none leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: job.description || '<p>No description provided.</p>' }}
              />
            </motion.div>

            {/* Skills & Categories */}
            {(job.skills?.length > 0 || job.categories?.length > 0) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-8">
                {job.categories?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>CATEGORIES</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.categories.map((c: any) => (
                        <span key={c.id} className="badge" style={{ background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)', color: '#7d9bff' }}>
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {job.skills?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>REQUIRED SKILLS</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((sk: any) => (
                        <span key={sk.id} className="badge" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Proposal Form */}
            {profile?.type === 'freelancer' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Submit a Proposal</h2>
                  {!showProposalForm && (
                    <button
                      onClick={() => setShowProposalForm(true)}
                      className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                    >
                      <span className="relative z-10">Apply Now</span>
                    </button>
                  )}
                </div>

                {showProposalForm && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Bid Amount ($) *</label>
                        <input
                          type="number"
                          value={proposalData.amount}
                          onChange={(e) => setProposalData({ ...proposalData, amount: e.target.value })}
                          placeholder="e.g. 500"
                          className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Duration (days) *</label>
                        <input
                          type="number"
                          value={proposalData.duration}
                          onChange={(e) => setProposalData({ ...proposalData, duration: e.target.value })}
                          placeholder="e.g. 7"
                          className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Cover Letter *</label>
                      <textarea
                        rows={5}
                        value={proposalData.message}
                        onChange={(e) => setProposalData({ ...proposalData, message: e.target.value })}
                        placeholder="Introduce yourself and explain why you're the best fit for this project..."
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleApply}
                        disabled={isSubmitting}
                        className="btn-primary px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <PaperAirplaneIcon className="w-4 h-4" />
                          {isSubmitting ? 'Sending...' : 'Submit Proposal'}
                        </span>
                      </button>
                      <button
                        onClick={() => setShowProposalForm(false)}
                        className="px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Employer Card */}
            {job.author && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl p-6">
                <h3 className="text-sm font-semibold mb-5" style={{ color: 'var(--text-muted)' }}>ABOUT THE EMPLOYER</h3>
                <Link href={`/employers/${job.author.id}`} className="flex items-center gap-3 group mb-4">
                  <img src={job.author.avatar} alt="" className="w-12 h-12 rounded-xl object-cover border" style={{ borderColor: 'var(--border)' }} />
                  <div>
                    <div className="font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                      {job.author.name}
                      {job.author.verified && <CheckBadgeIcon className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{job.author.tagline}</div>
                  </div>
                </Link>
                <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  {job.author.country && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <MapPinIcon className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
                      {job.author.country}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className={`w-2 h-2 rounded-full ${job.author.online ? 'bg-green-500' : 'bg-gray-500'}`} />
                    {job.author.online ? 'Online now' : 'Offline'}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Apply CTA for non-logged or employer-type */}
            {!token && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-3xl p-6 text-center">
                <h3 className="font-bold text-white mb-2">Want to apply?</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Create a free account to submit proposals and get hired.</p>
                <Link href="/register" className="btn-primary w-full py-3 rounded-xl text-sm font-bold block">
                  <span className="relative z-10">Sign Up Free</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
