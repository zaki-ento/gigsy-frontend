'use client';

import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BriefcaseIcon, ShoppingBagIcon, WalletIcon, ArrowUpRightIcon, CheckCircleIcon,
  MapPinIcon, ClockIcon, UserIcon, BellAlertIcon, ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function DashboardOverview() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [orderNotifications, setOrderNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi('/dashboard'),
      fetchApi('/notifications?category=order&per_page=05')
    ])
      .then(([dashRes, notifsRes]) => {
        setStats(dashRes);
        setOrderNotifications(notifsRes?.items || notifsRes?.data?.items || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const dash = stats?.dashboard || stats || {};
  const amount = (value: any) => {
    if (value == null) return '0';
    if (typeof value === 'number' || typeof value === 'string') return value;
    if (typeof value === 'object') return value.lifetime ?? value.all ?? value.last_30 ?? 0;
    return '0';
  };

  const activeServices = amount(dash?.counts?.services);
  const activeOrders = amount(dash?.stats?.active_orders_count);
  const recentOrders = dash?.recent_orders || [];
  
  // New API Data
  const analytics = dash?.analytics || [];
  const actionRequired = dash?.action_required || [];
  const activeProposals = dash?.active_proposals || [];
  const missingSteps = dash?.profile_missing_steps || [];
  const wallet = dash?.wallet_breakdown || {};
  const profileHealth = dash?.profile_health || { percentage: 0 };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-blue)' }}></div>
      </div>
    );
  }

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (profileHealth.percentage / 100) * circumference;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto text-[var(--text-primary)]">
      
      {/* Hero Welcome */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] overflow-hidden p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 border" 
        style={{ 
          borderColor: 'var(--border)', 
          background: 'linear-gradient(135deg, rgba(206, 231, 255, 0.4), rgba(221, 214, 255, 0.3))' 
        }}
      >
        <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl -z-10"></div>
        
        {/* Avatar with Progress Ring */}
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
            <circle cx="64" cy="64" r={radius} stroke="rgba(255,255,255,0.4)" strokeWidth="4" fill="none" />
            <circle 
              cx="64" cy="64" r={radius} 
              stroke="var(--accent-blue)" 
              strokeWidth="5" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset} 
              className="transition-all duration-1000 ease-out" 
            />
          </svg>
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/50 shadow-xl relative z-10">
             <img src={profile?.avatar_url || profile?.avatar || '/default-avatar.png'} alt="" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome back, {profile?.name?.split(' ')[0]}</h1>
          <p className="text-[var(--text-secondary)] mb-6 text-lg max-w-2xl">
            {profileHealth.percentage === 100 
              ? "Your profile is fully optimized and looking great!" 
              : "Let's complete your profile to unlock your full earning potential."}
          </p>
          
          {missingSteps.length > 0 && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {missingSteps.slice(0, 2).map((step: string, i: number) => (
                <span key={i} className="px-4 py-2 text-sm font-medium rounded-xl bg-white border shadow-sm" style={{ borderColor: 'var(--border)' }}>
                  + {step}
                </span>
              ))}
              {missingSteps.length > 2 && (
                <span className="text-sm font-medium text-[var(--text-muted)]">+{missingSteps.length - 2} more</span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Available Balance', value: `$${wallet.available || '0.00'}`, color: 'var(--accent-blue)' },
          { label: 'Pending Clearance', value: `$${wallet.pending_clearance || '0.00'}`, color: 'var(--accent-orange)' },
          { label: 'Active Escrow', value: `$${wallet.active_escrow || '0.00'}`, color: 'var(--accent-teal)' },
          { label: 'Total Earnings', value: `$${wallet.withdrawn_total || '0.00'}`, color: 'var(--accent-purple)' },
        ].map((metric, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, borderColor: metric.color }} 
            className="glass-card rounded-[2rem] p-6 border transition-all" 
            style={{ borderColor: 'var(--border)', boxShadow: '0 8px 32px rgba(5,0,26,0.03)' }}
          >
            <p className="text-sm text-[var(--text-secondary)] font-medium mb-3">{metric.label}</p>
            <h2 className="text-3xl font-bold tracking-tight">{metric.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Chart & Add Funds */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8">
          {/* Analytics Chart */}
          {analytics.length > 0 ? (
            <div className="glass-card border rounded-[2rem] p-6 md:p-8 h-full" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-semibold text-xl mb-1">Performance</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Your views and earnings over the last 7 days</p>
                </div>
                <select className="bg-transparent border border-[var(--border)] rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-[var(--accent-blue)] transition-colors">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                      cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="var(--accent-purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                    <Area type="monotone" dataKey="earnings" stroke="var(--accent-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="glass-card border rounded-[2rem] p-6 md:p-8 h-full flex items-center justify-center text-[var(--text-muted)]" style={{ borderColor: 'var(--border)' }}>
              No performance data available.
            </div>
          )}
        </div>

        {/* Add Funds */}
        <div className="xl:col-span-4">
          <div className="glass-card border rounded-[2rem] p-6 md:p-8 h-full flex flex-col relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-blue)] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-xl mb-1 text-[var(--text-primary)]">Add Funds</h3>
              <p className="text-sm text-[var(--text-secondary)]">Top up your wallet to hire elite talent.</p>
            </div>
            
            <div className="mt-auto pt-6">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button className="py-2 rounded-xl border bg-white text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)] transition-colors" style={{ borderColor: 'var(--border)' }}>$100</button>
                <button className="py-2 rounded-xl border bg-white text-sm font-semibold text-[var(--accent-blue)] border-[var(--accent-blue)] ring-1 ring-[var(--accent-blue)] shadow-[0_4px_12px_rgba(43,76,255,0.15)] transition-colors">$200</button>
                <button className="py-2 rounded-xl border bg-white text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)] transition-colors" style={{ borderColor: 'var(--border)' }}>$300</button>
                <button className="py-2 rounded-xl border bg-white text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)] transition-colors" style={{ borderColor: 'var(--border)' }}>$400</button>
                <button className="py-2 rounded-xl border bg-white text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)] transition-colors" style={{ borderColor: 'var(--border)' }}>$500</button>
                <button className="py-2 rounded-xl border bg-white text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)] transition-colors" style={{ borderColor: 'var(--border)' }}>$1,000</button>
              </div>

              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-[var(--text-secondary)]">$</span>
                <input 
                  type="number" 
                  placeholder="Custom amount" 
                  className="w-full py-3.5 pl-8 pr-4 rounded-xl border bg-white font-semibold outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all text-[var(--text-primary)]"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              
              <button className="w-full py-3.5 rounded-xl font-bold text-white hover:shadow-[0_8px_24px_rgba(43,76,255,0.25)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--accent-blue)' }}
              >
                 Deposit Funds <ArrowUpRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Orders & Action Center */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Active Orders */}
        <div className="xl:col-span-8">
          <div className="glass-card border rounded-[2rem] p-6 md:p-8" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold">Active Orders</h2>
              <button className="text-sm font-semibold text-[var(--accent-blue)] hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)] text-sm rounded-2xl bg-black/50 border border-[var(--border)]">
                  No active orders at the moment.
                </div>
              ) : (
                recentOrders.map((order: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={order.id || idx} 
                    className="group bg-white rounded-2xl p-5 flex flex-col gap-3 border transition-all hover:shadow-lg"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {/* Top Row: Title & Status */}
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-semibold text-lg line-clamp-1">
                        {order.job?.title || order.service?.title || order.job_service_title || order.formatted_id || `Order #${order.id}`}
                      </h4>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                        {order.stage ? order.stage.replace(/_/g, ' ') : order.status || 'Active'}
                      </span>
                    </div>
                    
                    {/* Bottom Row: Metadata & Price */}
                    <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--text-secondary)] font-medium">
                      <div className="flex flex-wrap items-center gap-4">
                        {order.type && (
                          <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg capitalize">
                            <BriefcaseIcon className="w-4 h-4 text-gray-400" /> {order.type}
                          </span>
                        )}
                        {order.started_at && (
                          <span className="flex items-center gap-1.5"><ClockIcon className="w-4 h-4 text-gray-400" /> Start: {new Date(order.started_at).toLocaleDateString()}</span>
                        )}
                        {order.delivery_at && (
                          <span className="flex items-center gap-1.5"><ClockIcon className="w-4 h-4 text-amber-500" /> Due: {new Date(order.delivery_at).toLocaleDateString()}</span>
                        )}
                      </div>
                      <span className="font-bold text-[var(--text-primary)] text-lg ml-auto">
                        ${order.total || 0.00}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Action Center & Proposals */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Action Center (Order Notifications) */}
          <div className="glass-card border rounded-[2rem] p-6 relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-pink)] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <h3 className="font-semibold text-lg mb-6 flex items-center">
              Action Center
            </h3>
            
            {orderNotifications.length > 0 ? (
              <div className="space-y-4">
                {orderNotifications.map((notif: any, i: number) => (
                  <Link href={notif.link || '#'} key={notif.id || i} className="block p-4 rounded-2xl bg-white border hover:border-[var(--accent-blue)] transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                        {notif.type === 'message' ? <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-[var(--accent-orange)]" /> : <BellAlertIcon className="w-5 h-5 text-[var(--accent-blue)]" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-2 mb-1 text-[var(--text-primary)]" dangerouslySetInnerHTML={{ __html: notif.content || notif.title }} />
                        <span className="text-xs font-semibold text-[var(--accent-blue)]">View details →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">You're all caught up!</p>
            )}
          </div>

          {/* Active Proposals */}
          {activeProposals.length > 0 && (
            <div className="glass-card border rounded-[2rem] p-6" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5 text-[var(--accent-purple)]" /> Active Proposals
              </h3>
              <div className="space-y-4">
                {activeProposals.map((prop: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
                    <h4 className="font-semibold text-sm truncate">{prop.job_title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-lg capitalize text-[var(--text-secondary)]">{prop.status}</span>
                      <span className="font-bold text-sm">${prop.bid_amount}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 rounded-xl text-sm font-semibold bg-gray-50 hover:bg-gray-100 transition-colors">
                View All Proposals
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
