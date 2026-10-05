'use client';

import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  BriefcaseIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function DashboardOverview() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We fetch a basic dashboard endpoint which gives high level stats
    fetchApi('/dashboard')
      .then(res => setStats(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Earnings', value: stats?.earnings || '$0.00', icon: CurrencyDollarIcon, color: 'var(--accent-blue)' },
    { label: 'Active Orders', value: stats?.active_orders || '0', icon: ShoppingBagIcon, color: 'var(--accent-teal)' },
    { label: 'Proposals', value: stats?.active_proposals || '0', icon: BriefcaseIcon, color: 'var(--accent-pink)' },
    { label: 'Profile Views', value: stats?.profile_views || '0', icon: ChartBarIcon, color: 'var(--accent-purple)' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Welcome back, {profile?.name?.split(' ')[0]}!</h1>
        <p className="text-[var(--text-secondary)]">Here's an overview of your account today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10" style={{ background: stat.color }} />
            <stat.icon className="w-8 h-8 mb-4" style={{ color: stat.color }} />
            <div className="text-3xl font-black text-white mb-1">
              {loading ? <div className="skeleton w-20 h-8 rounded" /> : stat.value}
            </div>
            <div className="text-sm text-[var(--text-secondary)] font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-3xl p-8">
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton w-3/4 h-4 rounded" />
                    <div className="skeleton w-1/4 h-3 rounded" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[var(--text-muted)] text-sm">No recent activity to show.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-3xl p-8">
          <h2 className="text-lg font-bold text-white mb-6">Action Items</h2>
          <div className="text-center py-8">
             <p className="text-[var(--text-muted)] text-sm">You're all caught up!</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
