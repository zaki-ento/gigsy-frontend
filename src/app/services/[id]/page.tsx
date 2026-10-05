'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  SparklesIcon,
  ClockIcon,
  ArrowLeftIcon,
  CheckBadgeIcon,
  StarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function SingleService() {
  const { id } = useParams();
  const router = useRouter();
  const { token, profile } = useAuth();

  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('one');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetchApi(`/service/${id}`)
      .then((r) => setService(r.item || r))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleOrder = async () => {
    if (!token) { router.push('/login'); return; }
    setIsOrdering(true);
    try {
      await fetchApi('/order', { method: 'POST', body: JSON.stringify({ service_id: id, plan: selectedPlan }) });
      router.push('/dashboard/orders');
    } catch (err: any) {
      alert(err.message || 'Failed to place order.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-blue)' }} />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white" style={{ background: 'var(--bg-primary)' }}>
        <SparklesIcon className="w-16 h-16 mb-4" style={{ color: 'var(--text-muted)' }} />
        <h1 className="text-2xl font-bold mb-3">Service not found</h1>
        <Link href="/services" className="flex items-center gap-2" style={{ color: 'var(--accent-blue)' }}>
          <ArrowLeftIcon className="w-4 h-4" /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeftIcon className="w-4 h-4" /> Back to Services
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left — Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">{service.title}</h1>

              {/* Author row */}
              {service.author && (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={service.author.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" style={{ border: '2px solid var(--border)' }} />
                    {service.author.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2" style={{ borderColor: 'var(--bg-primary)' }} />
                    )}
                  </div>
                  <div>
                    <Link href={`/freelancers/${service.author.id}`} className="font-semibold text-white hover:text-blue-300 transition-colors flex items-center gap-1.5">
                      {service.author.name}
                      {service.author.verified && <CheckBadgeSolid className="w-4 h-4 text-blue-400" />}
                    </Link>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{service.author.tagline}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <StarSolid className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-yellow-400">{Number(service.author.rating?.average || 0).toFixed(1)}</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>({service.author.rating?.count} reviews)</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Thumbnail */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-3xl overflow-hidden border" style={{ borderColor: 'var(--border)', aspectRatio: '16/9' }}>
              {service.thumbnail?.url ? (
                <img src={service.thumbnail.url} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-card)' }}>
                  <SparklesIcon className="w-20 h-20" style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">About this service</h2>
              <div
                className="prose prose-sm max-w-none leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: service.description || '<p>No description provided.</p>' }}
              />
            </motion.div>

            {/* Skills & Categories */}
            {(service.skills?.length > 0 || service.categories?.length > 0) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-3xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">Skills & Categories</h2>
                {service.categories?.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>CATEGORIES</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.categories.map((c: any) => (
                        <span key={c.id} className="badge" style={{ background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)', color: '#7d9bff' }}>
                          <TagIcon className="w-3 h-3 mr-1" />{c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {service.skills?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>SKILLS</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.skills.map((sk: any) => (
                        <span key={sk.id} className="badge" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right — Sticky Order Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl overflow-hidden">
                {/* Plan selector (Basic) */}
                <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-bold text-white mb-4">Order this Service</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Price</span>
                      <span className="text-2xl font-black text-white" dangerouslySetInnerHTML={{ __html: service.price_html || '$0' }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                      <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
                        {service.delivery}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Orders</span>
                      <span className="text-sm font-semibold text-white">{service.orders} completed</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <button
                    onClick={handleOrder}
                    disabled={isOrdering || profile?.type === 'freelancer'}
                    className="btn-primary w-full py-4 rounded-2xl text-base font-bold mb-4 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <SparklesIcon className="w-5 h-5" />
                      {isOrdering ? 'Processing...' : 'Order Now'}
                    </span>
                  </button>

                  <div className="space-y-3">
                    {[
                      'Secure payment via Escrow',
                      'Money-back guarantee',
                      '24/7 customer support',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <CheckBadgeSolid className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-teal)' }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Author mini card */}
              {service.author && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-3xl p-6">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>ABOUT THE SELLER</h3>
                  <Link href={`/freelancers/${service.author.id}`} className="flex items-center gap-3 group">
                    <img src={service.author.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-white group-hover:text-blue-300 transition-colors">{service.author.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{service.author.tagline}</div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
