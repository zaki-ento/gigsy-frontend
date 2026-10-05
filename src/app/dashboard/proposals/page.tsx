'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/proposals')
      .then(r => setProposals(r.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'accepted':
      case 'hired': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Proposals</h1>
        <p className="text-[var(--text-secondary)]">Manage your bids and job applications.</p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton w-full h-20 rounded-xl" />
            ))}
          </div>
        ) : proposals.length === 0 ? (
          <div className="p-16 text-center">
            <BriefcaseIcon className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
            <h2 className="text-xl font-bold text-white mb-2">No proposals yet</h2>
            <p className="text-[var(--text-secondary)] mb-6">You haven't submitted any proposals for jobs.</p>
            <Link href="/jobs" className="btn-primary inline-flex px-6 py-3 rounded-xl font-bold">
              <span className="relative z-10">Find Jobs</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {proposals.map((proposal, idx) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-white">#{proposal.id}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(proposal.status)}`}>
                        {proposal.status || 'Submitted'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                      {proposal.job_title || 'Job Application'}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                      <span>Applied on {new Date(proposal.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" /> {proposal.duration || 7} {proposal.duration_type || 'days'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-64 shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-[var(--text-muted)] mb-1">Bid Amount</div>
                      <div className="font-bold text-white" dangerouslySetInnerHTML={{ __html: proposal.amount_html || '$0' }} />
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10 group-hover:border-blue-500/30">
                      <ArrowRightIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
