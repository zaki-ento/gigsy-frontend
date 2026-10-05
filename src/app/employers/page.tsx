'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BuildingOfficeIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function EmployersFeed() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetchApi('/employers')
      .then((r) => { if (r.items) setEmployers(r.items); })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = employers.filter((e) =>
    !search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="relative overflow-hidden py-20 px-4" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="orb-purple w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-tag mb-4 inline-flex">
              <BuildingOfficeIcon className="w-4 h-4" />
              Companies
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              World-Class <span className="gradient-text-blue">Employers</span>
            </h1>
            <p className="text-lg max-w-xl mb-10" style={{ color: 'var(--text-secondary)' }}>
              Discover innovative companies and visionary founders who are building the future with Gigneo talent.
            </p>
            <div className="relative max-w-2xl">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="input-dark w-full pl-12 pr-4 py-4 rounded-2xl text-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>{filtered.length} compan{filtered.length !== 1 ? 'ies' : 'y'}</p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card rounded-3xl p-6 space-y-4">
                <div className="skeleton w-16 h-16 rounded-2xl" />
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((e, idx) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(idx * 0.08, 0.4) }}
                >
                  <Link href={`/employers/${e.id}`} className="block glass-card rounded-3xl overflow-hidden group">
                    {/* Cover */}
                    <div className="h-20 relative" style={{
                      background: e.cover?.url
                        ? `url(${e.cover.url}) center/cover`
                        : 'linear-gradient(135deg, rgba(255,170,50,0.3), rgba(255,78,205,0.2))'
                    }}>
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, var(--bg-card) 100%)' }} />
                    </div>
                    <div className="px-6 pb-6 -mt-8 relative">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 mb-4 flex items-center justify-center group-hover:border-amber-500/50 transition-colors"
                        style={{ borderColor: 'var(--bg-card)', background: 'var(--bg-card-hover)' }}>
                        {e.avatar ? (
                          <img src={e.avatar} alt={e.name} className="w-full h-full object-cover" />
                        ) : (
                          <BuildingOfficeIcon className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                        )}
                      </div>
                      <h3 className="font-bold text-white mb-1 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                        {e.name}
                        {e.verified && <CheckBadgeIcon className="w-4 h-4 text-blue-400" />}
                      </h3>
                      <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{e.tagline || 'Leading Organization'}</p>
                      {e.location?.country_state_name && (
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <MapPinIcon className="w-3 h-3" />
                          {e.location.country_state_name}
                        </div>
                      )}
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
