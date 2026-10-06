'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon } from '@heroicons/react/24/solid';

export default function SingleFreelancer() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetchApi(`/profile/${id}`)
      .then((r) => setProfile(r.item || r))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-blue)' }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-black" style={{ background: 'var(--bg-primary)' }}>
        <h1 className="text-2xl font-bold mb-3">Profile not found</h1>
        <Link href="/freelancers" className="flex items-center gap-2" style={{ color: 'var(--accent-blue)' }}>
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Cover */}
      <div
        className="h-64 w-full relative"
        style={{
          background: profile.cover?.url
            ? `url(${profile.cover.url}) center/cover`
            : 'linear-gradient(135deg, rgba(79,110,247,0.4), rgba(151,71,255,0.4))',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, var(--bg-primary) 100%)' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <Link href="/freelancers" className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors hover:text-black" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeftIcon className="w-4 h-4" /> Back to Talent
        </Link>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6 text-center">
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-2xl overflow-hidden border-4" style={{ borderColor: 'var(--bg-primary)' }}>
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-black" style={{ background: 'var(--bg-card-hover)' }}>
                      {profile.name?.charAt(0)}
                    </div>
                  )}
                </div>
                {profile.online && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2" style={{ borderColor: 'var(--bg-primary)' }} />
                )}
              </div>

              <h1 className="text-xl font-black text-black mb-1 flex items-center justify-center gap-1.5">
                {profile.name}
                {profile.verified && <CheckBadgeIcon className="w-5 h-5 text-blue-400" />}
              </h1>
              <p className="text-sm mb-4" style={{ color: 'var(--accent-blue)' }}>{profile.tagline}</p>

              <div className="flex items-center justify-center gap-1 mb-5">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-yellow-400">{Number(profile.rating?.average || 0).toFixed(1)}</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>({profile.rating?.count} reviews)</span>
              </div>

              <button className="btn-primary w-full py-3 rounded-xl text-sm font-bold mb-3 flex items-center justify-center gap-2">
                <span className="relative z-10 flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  Send Message
                </span>
              </button>

              <div className="pt-5 border-t text-left space-y-3" style={{ borderColor: 'var(--border)' }}>
                {profile.location?.country_state_name && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <MapPinIcon className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-blue)' }} />
                    {profile.location.country_state_name}
                  </div>
                )}
                {profile.member_since && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <CalendarIcon className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-blue)' }} />
                    Member since {new Date(profile.member_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className={`w-2.5 h-2.5 rounded-full ${profile.online ? 'bg-green-500' : 'bg-gray-600'}`} />
                  {profile.online ? 'Online now' : `Last seen ${profile.last_active ? new Date(profile.last_active).toLocaleDateString() : 'recently'}`}
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            {profile.skills?.filter((s: any) => s?.name).length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-6">
                <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.filter((s: any) => s?.name).map((sk: any, i: number) => (
                    <span key={i} className="badge text-xs" style={{ background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)', color: '#7d9bff' }}>
                      {sk.name || sk}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* About */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-8">
              <h2 className="text-xl font-bold text-black mb-6">About</h2>
              <div
                className="prose prose-sm max-w-none leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: profile.description || '<p>This freelancer hasn\'t added a bio yet.</p>' }}
              />
            </motion.div>

            {/* Categories */}
            {profile.categories?.filter((c: any) => c?.name).length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl p-8">
                <h2 className="text-xl font-bold text-black mb-6">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.categories.filter((c: any) => c?.name).map((c: any, i: number) => (
                    <span key={i} className="badge" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                      {c.name || c}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
