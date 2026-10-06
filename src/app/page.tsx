'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import {
  SparklesIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  StarIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BoltIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

// Stat Counter Component
function StatNumber({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [end]);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-black gradient-text-blue mb-2">{count.toLocaleString()}{suffix}</div>
      <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}

// Service Card
function ServiceCard({ service, idx }: { service: any; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
    >
      <Link href={`/services/${service.id}`} className="block glass-card rounded-2xl overflow-hidden group">
        <div className="aspect-[4/3] relative overflow-hidden bg-black/5">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {service.author && (
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium text-black"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
              <img src={service.author.avatar} alt="" className="w-5 h-5 rounded-full" />
              {service.author.name}
            </div>
          )}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">
              <span className="relative z-10">View</span>
              <ArrowRightIcon className="w-3 h-3 relative z-10" />
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-black line-clamp-2 mb-3 leading-relaxed group-hover:text-blue-300 transition-colors">
            {service.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium text-yellow-400">{service.rating || '5.0'}</span>
            </div>
            <div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>from </span>
              <span className="text-sm font-bold text-black" dangerouslySetInnerHTML={{ __html: service.price_html || '$45' }} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Freelancer Card
function FreelancerCard({ f, idx }: { f: any; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
    >
      <Link href={`/freelancers/${f.id}`} className="block glass-card rounded-2xl p-6 text-center group">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-blue-500/50 transition-colors">
            {f.avatar ? (
              <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-black" style={{ background: 'var(--bg-card-hover)' }}>
                {f.name?.charAt(0)}
              </div>
            )}
          </div>
          {f.online && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[var(--bg-primary)]" />
          )}
        </div>
        <h3 className="font-bold text-black mb-1 group-hover:gradient-text-blue transition-colors text-sm">{f.name}</h3>
        <p className="text-xs mb-3 line-clamp-1" style={{ color: 'var(--accent-blue)' }}>{f.tagline || 'Expert Professional'}</p>
        <div className="flex items-center justify-center gap-1 text-yellow-400 mb-4">
          <StarIcon className="w-3.5 h-3.5 fill-yellow-400" />
          <span className="text-xs font-bold text-yellow-400">{f.rating?.average || '5.0'}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({f.rating?.count || 0})</span>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all group-hover:text-black" style={{ background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
          View Profile →
        </span>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const [services, setServices] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ name: string; id: number }[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingFreelancers, setLoadingFreelancers] = useState(true);

  useEffect(() => {
    fetchApi('/services').then((r) => { if (r.items) setServices(r.items.slice(0, 8)); }).finally(() => setLoadingServices(false));
    fetchApi('/freelancers').then((r) => { if (r.items) setFreelancers(r.items.slice(0, 6)); }).finally(() => setLoadingFreelancers(false));
    fetchApi('/taxonomy/gigneo_facet?parent=0&per_page=8')
      .then((r) => { if (r.items) setCategories(r.items.slice(0, 8)); })
      .catch(() => undefined);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ━━━━━ HERO ━━━━━ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        {/* Ambient Glows */}
        <div className="orb-blue w-[700px] h-[700px] top-[-200px] left-[-150px] opacity-60" />
        <div className="orb-purple w-[600px] h-[600px] bottom-[-150px] right-[-100px] opacity-50" />
        <div className="orb-pink w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

        {/* Animated Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="section-tag mb-8 inline-flex">
              <SparklesIcon className="w-4 h-4" />
              The Premium Freelance Marketplace
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95]"
          >
            Where Elite{' '}
            <span className="gradient-text-blue">Talent</span>
            {' '}Meets<br className="hidden md:block" />
            <span className="gradient-text-pink"> Opportunity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Discover world-class services, connect with top freelancers, and scale your business with Gigneo — the marketplace that only accepts the best.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/services" className="btn-primary px-8 py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2">
              <span className="relative z-10">Explore Services</span>
              <ArrowRightIcon className="w-5 h-5 relative z-10" />
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-all hover:bg-black/5"
              style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              Start Selling
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {['No hidden fees', 'Top 3% of talent', 'Secure payments', '24/7 support'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-400" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 rounded-full bg-white/30" />
          </div>
        </motion.div>
      </section>

      {/* ━━━━━ STATS ━━━━━ */}
      <section className="py-16" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatNumber end={12000} suffix="+" label="Active Freelancers" />
          <StatNumber end={48000} suffix="+" label="Projects Completed" />
          <StatNumber end={98} suffix="%" label="Satisfaction Rate" />
          <StatNumber end={150} suffix="+" label="Countries Served" />
        </div>
      </section>

      {/* ━━━━━ FEATURED SERVICES ━━━━━ */}
      <section className="py-24 relative" style={{ background: 'var(--bg-primary)' }}>
        <div className="orb-purple w-[500px] h-[500px] top-0 right-0 opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <div className="section-tag mb-4 inline-flex">
                <SparklesIcon className="w-4 h-4" />
                Featured Services
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-black leading-tight">
                Discover <span className="gradient-text-blue">top-tier</span><br />creative work
              </h2>
            </div>
            <Link
              href="/services"
              className="flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
              style={{ color: 'var(--accent-blue)' }}
            >
              View all services <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {loadingServices ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {services.map((service, idx) => (
                <ServiceCard key={service.id} service={service} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━ CATEGORIES ━━━━━ */}
      <section className="py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-tag mb-4 inline-flex"><BoltIcon className="w-4 h-4" />Browse by Category</div>
            <h2 className="text-4xl md:text-5xl font-black text-black">Everything your<br /><span className="gradient-text-pink">business needs</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(categories.length ? categories.map((c) => ({ label: c.name, href: `/services?category=${c.id}` })) : [
              { label: 'Design', href: '/services' },
              { label: 'Development', href: '/services' },
              { label: 'Marketing', href: '/services' },
              { label: 'Writing', href: '/services' },
            ]).map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={cat.href}
                  className="glass-card rounded-2xl p-5 flex flex-col gap-3 group"
                >
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━ TOP FREELANCERS ━━━━━ */}
      <section className="py-24 relative" style={{ background: 'var(--bg-primary)' }}>
        <div className="orb-blue w-[500px] h-[500px] top-0 left-0 opacity-15" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <div className="section-tag mb-4 inline-flex"><UserGroupIcon className="w-4 h-4" />Elite Talent</div>
              <h2 className="text-4xl md:text-5xl font-black text-black leading-tight">
                Work with the<br /><span className="gradient-text-blue">world's best</span>
              </h2>
            </div>
            <Link href="/freelancers" className="flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all" style={{ color: 'var(--accent-blue)' }}>
              Explore all talent <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {loadingFreelancers ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 space-y-3">
                  <div className="skeleton w-20 h-20 mx-auto rounded-2xl" />
                  <div className="skeleton h-3 w-3/4 mx-auto" />
                  <div className="skeleton h-2 w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {freelancers.map((f, idx) => (
                <FreelancerCard key={f.id} f={f} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━ WHY GIGNEO ━━━━━ */}
      <section className="py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-tag mb-4 inline-flex"><ShieldCheckIcon className="w-4 h-4" />Why Gigneo</div>
            <h2 className="text-4xl md:text-5xl font-black text-black">The smarter way<br />to <span className="gradient-text-blue">get work done</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckBadgeIcon,
                title: 'Vetted Professionals',
                description: 'Every freelancer on Gigneo passes a rigorous vetting process. Only the top 3% are accepted onto our platform.',
                color: 'var(--accent-blue)',
                glow: 'rgba(79,110,247,0.1)',
              },
              {
                icon: ShieldCheckIcon,
                title: 'Secure & Protected',
                description: 'All payments are secured with escrow. Your money is only released when you approve the work.',
                color: 'var(--accent-teal)',
                glow: 'rgba(0,212,170,0.1)',
              },
              {
                icon: BoltIcon,
                title: 'Fast Delivery',
                description: 'Get matched with the right talent within 48 hours. No more endless searching and vetting.',
                color: 'var(--accent-pink)',
                glow: 'rgba(255,78,205,0.1)',
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="glass-card rounded-3xl p-8"
                style={{ background: feature.glow }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}30` }}>
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold text-black mb-4">{feature.title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━ TESTIMONIALS ━━━━━ */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        <div className="orb-pink w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <div className="section-tag mb-4 inline-flex"><StarIcon className="w-4 h-4" />Social Proof</div>
            <h2 className="text-4xl md:text-5xl font-black text-black">Loved by <span className="gradient-text-pink">thousands</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'Founder, FlowAI',
                avatar: '/placeholder.png',
                quote: 'Gigneo helped us build our entire product team in just two weeks. The quality of talent is unmatched anywhere else.'
              },
              {
                name: 'Marcus Williams',
                role: 'CTO, NovaTech',
                avatar: '/placeholder.png',
                quote: 'As a freelancer, Gigneo gives me access to the best clients in the world. My income has tripled since joining.'
              },
              {
                name: 'Elena Vasquez',
                role: 'Creative Director',
                avatar: '/placeholder.png',
                quote: 'The platform is beautiful, the payments are instant, and the support team is always there. 10/10 recommend.'
              },
            ].map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="glass-card rounded-3xl p-8"
              >
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 fill-yellow-400" />)}
                </div>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <div className="text-sm font-bold text-black">{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━ CTA BANNER ━━━━━ */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div className="orb-blue w-[600px] h-[400px] top-0 left-0 opacity-30" />
        <div className="orb-purple w-[600px] h-[400px] bottom-0 right-0 opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-black mb-6 leading-tight">
              Ready to build<br />something <span className="gradient-text-blue">amazing?</span>
            </h2>
            <p className="text-lg mb-10" style={{ color: 'var(--text-secondary)' }}>
              Join over 12,000 elite freelancers and forward-thinking companies on Gigneo today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary px-10 py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-2">
                <span className="relative z-10">Start Free Today</span>
                <ArrowRightIcon className="w-5 h-5 relative z-10" />
              </Link>
              <Link href="/services" className="px-10 py-5 rounded-2xl text-lg font-semibold flex items-center justify-center gap-2 transition-all hover:bg-black/5"
                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                Browse Marketplace
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
