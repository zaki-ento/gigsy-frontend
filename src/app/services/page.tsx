'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function ServicesFeed() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Services' },
    { id: 'remote', label: 'Remote' },
    { id: 'onsite', label: 'On-site' },
  ];

  useEffect(() => {
    setIsLoading(true);
    fetchApi('/services')
      .then((r) => { if (r.items) setServices(r.items); })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = services.filter((s) => {
    const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase()) || !search;
    const matchFilter = activeFilter === 'all' || s.type === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Hero Header */}
      <div className="relative overflow-hidden py-20 px-4" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="orb-purple w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-20" />
        <div className="orb-blue w-[400px] h-[400px] bottom-[-100px] left-[-50px] opacity-15" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-tag mb-4 inline-flex">
              <SparklesIcon className="w-4 h-4" />
              Marketplace
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Discover <span className="gradient-text-blue">Services</span>
            </h1>
            <p className="text-lg max-w-xl mb-10" style={{ color: 'var(--text-secondary)' }}>
              Purchase ready-to-deliver projects from the world's most elite creative professionals.
            </p>

            {/* Search */}
            <div className="relative max-w-2xl">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services, skills, freelancers..."
                className="input-dark w-full pl-12 pr-4 py-4 rounded-2xl text-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
          {filters.map((f) => (
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
          <div className="ml-auto text-sm" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden glass-card">
                <div className="skeleton aspect-[4/3]" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <SparklesIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-xl font-bold text-white mb-2">No services found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(idx * 0.08, 0.4) }}
                >
                  <Link href={`/services/${service.id}`} className="block glass-card rounded-2xl overflow-hidden group h-full">
                    {/* Thumbnail */}
                    <div className="aspect-[4/3] relative overflow-hidden" style={{ background: 'var(--bg-card-hover)' }}>
                      {service.thumbnail?.url ? (
                        <img
                          src={service.thumbnail.url}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <SparklesIcon className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
                        </div>
                      )}
                      {/* Hover overlay with CTA */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-4">
                        <div>
                          {service.categories?.slice(0, 1).map((c: any) => (
                            <span key={c.id} className="badge text-white" style={{ background: 'rgba(79,110,247,0.6)', border: '1px solid rgba(79,110,247,0.4)' }}>
                              {c.name}
                            </span>
                          ))}
                        </div>
                        <ArrowRightIcon className="w-5 h-5 text-white" />
                      </div>
                      {/* Author floating pill */}
                      {service.author && (
                        <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                          <img src={service.author.avatar} alt="" className="w-5 h-5 rounded-full" />
                          <span className="text-xs text-white font-medium">{service.author.name}</span>
                          {service.author.online && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                        </div>
                      )}
                      {/* Featured badge */}
                      {service.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="badge" style={{ background: 'linear-gradient(135deg,#ff4ecd,#9747ff)', color: 'white' }}>Featured</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col gap-3">
                      <h3 className="font-semibold text-white text-sm leading-relaxed line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {service.title}
                      </h3>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          {service.delivery}
                        </span>
                        {service.orders > 0 && <span>{service.orders} orders</span>}
                      </div>

                      {/* Skills */}
                      {service.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {service.skills.slice(0, 2).map((sk: any) => (
                            <span key={sk.id} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                              {sk.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer row */}
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-semibold text-yellow-400">{Number(service.rating).toFixed(1)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>from </span>
                          <span className="text-sm font-bold text-white" dangerouslySetInnerHTML={{ __html: service.price_html || '$0' }} />
                        </div>
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
