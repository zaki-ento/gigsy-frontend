'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function FreelancersFeed() {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetchApi('/freelancers')
      .then((r) => { if (r.items) setFreelancers(r.items); })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = freelancers.filter((f) =>
    !search || f.name?.toLowerCase().includes(search.toLowerCase()) || f.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="relative overflow-hidden py-20 px-4" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="orb-blue w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-tag mb-4 inline-flex">
              <UserGroupIcon className="w-4 h-4" />
              Talent Directory
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-black mb-4 leading-tight">
              Hire <span className="gradient-text-blue">Elite Talent</span>
            </h1>
            <p className="text-lg max-w-xl mb-10" style={{ color: 'var(--text-secondary)' }}>
              Connect with pre-vetted professionals who are ready to deliver exceptional work for your projects.
            </p>
            <div className="relative max-w-2xl">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search freelancers by name, skill, or expertise..."
                className="input-dark w-full pl-12 pr-4 py-4 rounded-2xl text-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{filtered.length} freelancer{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card rounded-3xl p-6 space-y-3">
                <div className="skeleton w-24 h-24 mx-auto rounded-2xl" />
                <div className="skeleton h-4 w-1/2 mx-auto" />
                <div className="skeleton h-3 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <UserGroupIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-xl font-bold text-black mb-2">No freelancers found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((f, idx) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(idx * 0.08, 0.4) }}
                >
                  <Link href={`/freelancers/${f.id}`} className="block glass-card rounded-3xl overflow-hidden group">
                    {/* Cover */}
                    <div className="h-24 relative overflow-hidden" style={{
                      background: f.cover?.url ? `url(${f.cover.url}) center/cover` : 'linear-gradient(135deg, rgba(79,110,247,0.3), rgba(151,71,255,0.3))'
                    }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
                    </div>

                    <div className="px-6 pb-6 -mt-10 relative">
                      {/* Avatar */}
                      <div className="relative w-20 h-20 mb-4">
                        <div className="w-full h-full rounded-2xl overflow-hidden border-4 group-hover:border-blue-500/50 transition-colors" style={{ borderColor: 'var(--bg-card)' }}>
                          {f.avatar ? (
                            <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-black text-black" style={{ background: 'var(--bg-card-hover)' }}>
                              {f.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        {f.online && (
                          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2" style={{ borderColor: 'var(--bg-card)' }} />
                        )}
                        {f.verified && (
                          <span className="absolute -top-1 -right-1">
                            <CheckBadgeIcon className="w-5 h-5 text-blue-400" />
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-black mb-1 group-hover:text-blue-300 transition-colors">{f.name}</h3>
                      <p className="text-sm mb-3 line-clamp-1" style={{ color: 'var(--accent-blue)' }}>{f.tagline || 'Expert Professional'}</p>

                      {f.location?.country_state_name && (
                        <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                          <MapPinIcon className="w-3.5 h-3.5" />
                          {f.location.country_state_name}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-1">
                          <StarSolid className="w-3.5 h-3.5 text-yellow-400" />
                          <span className="text-xs font-bold text-yellow-400">{Number(f.rating?.average || 0).toFixed(1)}</span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({f.rating?.count})</span>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-lg transition-all group-hover:text-black"
                          style={{ background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
                          View Profile
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
