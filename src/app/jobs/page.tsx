'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserCircleIcon,
  MapPinIcon,
  TagIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function JobsFeed() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const expFilters = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'expert', label: 'Expert' },
  ];

  useEffect(() => {
    setIsLoading(true);
    fetchApi('/jobs')
      .then((r) => { if (r.items) setJobs(r.items); })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = jobs.filter((j) => {
    const matchSearch = j.title?.toLowerCase().includes(search.toLowerCase()) || !search;
    const matchFilter = activeFilter === 'all' || j.experience === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="relative overflow-hidden py-20 px-4" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="orb-blue w-[500px] h-[500px] top-[-100px] left-[-100px] opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-tag mb-4 inline-flex">
              <BriefcaseIcon className="w-4 h-4" />
              Job Board
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-black mb-4 leading-tight">
              Find Your <span className="gradient-text-blue">Dream Project</span>
            </h1>
            <p className="text-lg max-w-xl mb-10" style={{ color: 'var(--text-secondary)' }}>
              Browse high-paying opportunities from vetted companies looking for exceptional talent like you.
            </p>
            <div className="relative max-w-2xl">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, skills, companies..."
                className="input-dark w-full pl-12 pr-4 py-4 rounded-2xl text-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
          {expFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeFilter === f.id ? 'linear-gradient(135deg, #4f6ef7, #9747ff)' : 'var(--bg-card)',
                color: activeFilter === f.id ? 'white' : 'var(--text-secondary)',
                border: '1px solid ' + (activeFilter === f.id ? 'transparent' : 'var(--border)'),
              }}
            >
              {f.label}
            </button>
          ))}
          <div className="ml-auto text-sm shrink-0" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} job{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <div className="skeleton h-6 w-2/3 mb-3" />
                <div className="skeleton h-4 w-1/3 mb-4" />
                <div className="flex gap-3">
                  <div className="skeleton h-7 w-20 rounded-lg" />
                  <div className="skeleton h-7 w-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <BriefcaseIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-xl font-bold text-black mb-2">No jobs found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(idx * 0.07, 0.3) }}
                >
                  <Link href={`/jobs/${job.id}`} className="block glass-card rounded-2xl p-6 md:p-8 group">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Title + employer */}
                        <div className="flex items-start gap-4 mb-4">
                          {job.author?.avatar && (
                            <img
                              src={job.author.avatar}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border"
                              style={{ borderColor: 'var(--border)' }}
                            />
                          )}
                          <div className="min-w-0">
                            <h2 className="text-xl font-bold text-black mb-1 group-hover:text-blue-300 transition-colors truncate">
                              {job.title}
                            </h2>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              By {job.author?.name || 'Anonymous Employer'} • {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-green-400">
                            <CurrencyDollarIcon className="w-4 h-4" />
                            <span dangerouslySetInnerHTML={{ __html: job.budget_html || '$0' }} />
                          </span>
                          <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <BriefcaseIcon className="w-4 h-4" />
                            {job.experience || 'Any Level'}
                          </span>
                          {job.author?.country && (
                            <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <MapPinIcon className="w-4 h-4" />
                              {job.author.country}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <UserCircleIcon className="w-4 h-4" />
                            {job.proposals || 0} proposals
                          </span>
                        </div>

                        {/* Skills */}
                        {job.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((sk: any) => (
                              <span key={sk.id} className="badge text-xs" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                                {sk.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="shrink-0">
                        <span className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all group-hover:text-black"
                          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                          View Details
                          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
