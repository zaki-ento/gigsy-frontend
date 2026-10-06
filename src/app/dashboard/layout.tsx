'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDashboardStats } from '@/lib/gigneo/api/dashboardHooks';
import {
  RectangleStackIcon,
  ShoppingBagIcon,
  BriefcaseIcon,
  WalletIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  BookmarkIcon,
  LifebuoyIcon,
  RectangleGroupIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, profile, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  const { data: statsData } = useDashboardStats();
  const unreadMessages = statsData?.counts?.unread_messages || 0;
  const unreadNotifs = statsData?.counts?.unread_notifications || 0;
  const activeOrders = statsData?.stats?.active_orders_count || 0;

  useEffect(() => {
    setIsMounted(true);
    if (token === null) {
      router.push('/login');
    }
  }, [token, router]);

  if (!isMounted || !token) {
    return null;
  }

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: RectangleStackIcon },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBagIcon, badge: activeOrders },
    { name: 'Proposals', href: '/dashboard/proposals', icon: BriefcaseIcon },
    { name: 'My Listings', href: '/dashboard/listings', icon: RectangleGroupIcon },
    { name: 'Saved', href: '/dashboard/saved', icon: BookmarkIcon },
    { name: 'Wallet', href: '/dashboard/wallet', icon: WalletIcon },
    { name: 'Messages', href: '/dashboard/chat', icon: ChatBubbleLeftRightIcon, badge: unreadMessages },
    { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon, badge: unreadNotifs },
    { name: 'Support', href: '/dashboard/support', icon: LifebuoyIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="glass-card rounded-3xl p-6 sticky top-24 border border-white/5">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-black/5 flex items-center justify-center">
                  <img src={profile?.avatar || '/default-avatar.png'} alt={profile?.name || ''} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-black font-bold truncate text-sm">{profile?.name || 'Loading...'}</h3>
                  <p className="text-xs text-[var(--text-muted)] capitalize">{profile?.type || 'User'}</p>
                </div>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = item.href === '/dashboard' ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-[var(--glow-blue)] text-[var(--accent-blue)] border border-[rgba(79,110,247,0.2)]' 
                          : 'text-[var(--text-secondary)] hover:text-black hover:bg-black/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-[var(--accent-blue)]' : ''}`} />
                        {item.name}
                      </div>
                      {item.badge ? (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          isActive ? 'bg-[var(--accent-blue)] text-white' : 'bg-red-500 text-white'
                        }`}>
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      ) : null}
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-8 pt-8 border-t border-white/5">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 relative">
            <div className="orb-purple w-[300px] h-[300px] top-0 right-0 opacity-10" />
            <div className="relative z-10">
              {children}
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
}
