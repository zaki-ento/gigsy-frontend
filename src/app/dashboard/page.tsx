'use client';

import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BriefcaseIcon,
  ShoppingBagIcon,
  WalletIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function DashboardOverview() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/dashboard')
      .then(res => setStats(res))
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
  const availableCredits = dash?.stats?.credits || 0;

  const recentOrders = dash?.recent_orders || [];
  const recentActivity = dash?.recent_activity;
  const profileHealth = dash?.profile_health;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-[var(--text-primary)]">
      
      {/* Top Banner Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Welcome Section */}
        <div className="lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-center">
          <h1 className="text-xl font-bold mb-1">Welcome, {profile?.name?.split(' ')[0] || ''} 👋</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Here's a quick overview of your work.</p>
          <div className="flex items-center gap-3">
            <button className="btn-primary py-2 px-5 text-sm rounded-lg">
              + Add funds
            </button>
            <button className="bg-white border border-[var(--border)] text-[var(--text-primary)] hover:bg-gray-50 py-2 px-5 text-sm font-semibold rounded-lg transition-colors">
              View services
            </button>
          </div>
        </div>

        {/* Small Stat Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <BriefcaseIcon className="w-6 h-6 text-purple-500" />
              <ArrowUpRightIcon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{activeServices}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-[var(--text-secondary)]">Active services</span>
            </div>
          </div>
          
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBagIcon className="w-6 h-6 text-blue-500" />
              <ArrowUpRightIcon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{activeOrders}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-[var(--text-secondary)]">Active orders</span>
            </div>
          </div>
          
          {dash?.stats?.credits !== undefined && (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <WalletIcon className="w-6 h-6 text-green-500" />
                <ArrowUpRightIcon className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold">{dash.stats.credits}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-[var(--text-secondary)]">Available credits</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Main Left Content */}
        <div className={(profileHealth || recentActivity) ? "xl:col-span-8 space-y-6" : "xl:col-span-12 space-y-6"}>
          
          {/* Earnings Profile Block */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500 font-bold">{profile?.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-lg">{profile?.name || ''}</h3>
                    {profile?.name && <CheckCircleIcon className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{profile?.user_email || ''}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-sm font-semibold border border-[var(--border)] bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                View earnings <ArrowUpRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 mb-4 text-[var(--text-secondary)]">
              <WalletIcon className="w-4 h-4" />
              <span className="text-sm font-semibold">Earnings</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {dash?.stats?.last_30_days_earnings !== undefined && (
                <div>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Last 30 days</p>
                  <p className="text-xl font-bold mb-1">${amount(dash.stats.last_30_days_earnings)}</p>
                </div>
              )}
              {dash?.stats?.total_earnings !== undefined && (
                <div>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Total earning</p>
                  <p className="text-xl font-bold mb-1">${amount(dash.stats.total_earnings)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-[var(--text-secondary)] mb-1">Wallet balance</p>
                <p className="text-xl font-bold mb-1">${amount(dash?.stats?.wallet_balance) || '0.00'}</p>
              </div>
              {dash?.stats?.in_escrow !== undefined && (
                <div>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">In escrow</p>
                  <p className="text-xl font-bold mb-1">${amount(dash.stats.in_escrow)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Orders List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Active orders</h2>
              <button className="flex items-center gap-2 text-sm font-semibold border border-[var(--border)] bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                View all orders <ArrowUpRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <button className="px-4 py-1.5 text-xs font-semibold rounded-full border border-blue-200 text-blue-700 bg-blue-50 flex items-center gap-2">
                Service <span className="bg-blue-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">{activeServices}</span>
              </button>
              <button className="px-4 py-1.5 text-xs font-semibold rounded-full border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 flex items-center gap-2 transition-colors">
                Jobs <span className="bg-gray-200 text-gray-700 w-4 h-4 rounded-full flex items-center justify-center text-[9px]">{amount(dash?.counts?.jobs)}</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 text-center text-[var(--text-muted)] text-sm">
                  No active orders at the moment.
                </div>
              ) : (
                recentOrders.map((order: any, idx: number) => (
                  <div key={order.id || idx} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 flex items-center gap-4 hover:border-gray-300 transition-colors">
                    {order.thumbnail?.url && (
                      <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0 flex-none relative">
                        <img src={order.thumbnail.url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[15px] truncate mb-2">{order.job_service_title || `Order #${order.id}`}</h4>
                      <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                        {order.location && <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" /> {order.location}</span>}
                        {order.due_date && <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" /> {order.due_date}</span>}
                        <span className="font-semibold text-[var(--text-primary)]">${order.total || '0.00'}</span>
                        {order.buyer_name && <span className="flex items-center gap-1"><UserIcon className="w-3.5 h-3.5" /> {order.buyer_name}</span>}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 capitalize">{order.status || 'Active'}</span>
                      <button className="w-8 h-8 rounded border border-[var(--border)] flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <ArrowUpRightIcon className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        {(profileHealth || (recentActivity && recentActivity.length > 0)) && (
          <div className="xl:col-span-4 space-y-6">
            
            {/* Profile Health */}
            {profileHealth && (
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
                <h3 className="font-bold mb-6">Profile health</h3>
                
                <div className="flex justify-center mb-8 relative">
                  <div className="w-48 h-24 overflow-hidden relative">
                    <div className="w-48 h-48 rounded-full border-[16px] border-gray-100 absolute top-0 border-b-transparent border-r-transparent transform -rotate-45"></div>
                    {profileHealth.percentage > 0 && (
                      <div 
                        className="w-48 h-48 rounded-full border-[16px] border-purple-500 absolute top-0 border-b-transparent border-r-transparent transform -rotate-45"
                        style={{ transform: `rotate(${-45 + (180 * (profileHealth.percentage / 100))}deg)` }}
                      ></div>
                    )}
                  </div>
                  <div className="absolute bottom-0 w-full text-center">
                    <span className="block text-xl font-bold">{profileHealth.percentage || 0}%</span>
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider">Completed</span>
                  </div>
                </div>
                
                {profileHealth.items && profileHealth.items.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {profileHealth.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                          <span className="text-[var(--text-secondary)]">{item.label}</span>
                        </div>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-sm text-[var(--text-muted)] mb-6">
                    Complete your profile to stand out.
                  </div>
                )}
                
                <button className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors">
                  Profile settings <ArrowUpRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            {/* Recent Order Activity */}
            {recentActivity && recentActivity.length > 0 && (
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
                <h3 className="font-bold mb-6">Recent order activity</h3>
                
                <div className="space-y-6">
                  {recentActivity.map((activity: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-500">
                        {activity.avatar ? <img src={activity.avatar} alt="" className="w-full h-full object-cover" /> : activity.initials || 'U'}
                      </div>
                      <div>
                        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: activity.content }} />
                        <p className="text-[11px] text-gray-400 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
