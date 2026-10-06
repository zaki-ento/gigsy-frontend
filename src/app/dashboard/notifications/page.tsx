'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/notifications')
      .then((r) => setNotifications(r.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    try {
      await fetchApi('/notifications/mark', {
        method: 'POST',
        body: JSON.stringify({ status: 'read', mark_all: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read', read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'payment': return CurrencyDollarIcon;
      case 'message': return ChatBubbleLeftRightIcon;
      case 'proposal': return BriefcaseIcon;
      case 'order': return ShoppingBagIcon;
      case 'success': return CheckCircleIcon;
      case 'warning': return ExclamationCircleIcon;
      default: return InformationCircleIcon;
    }
  };

  const getNotifColor = (type: string) => {
    switch (type) {
      case 'payment': return 'text-green-400';
      case 'message': return 'text-blue-400';
      case 'proposal': return 'text-purple-400';
      case 'order': return 'text-teal-400';
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-[var(--accent-blue)]';
    }
  };

  const isUnread = (n: any) => n.status ? n.status !== 'read' : !n.read;
  const unreadCount = notifications.filter(isUnread).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Notifications</h1>
          <p className="text-[var(--text-secondary)]">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm font-medium px-4 py-2 rounded-xl transition-all hover:bg-white/10"
            style={{ color: 'var(--accent-blue)', border: '1px solid rgba(79,110,247,0.3)' }}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="glass-card rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center">
            <BellIcon className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
            <h2 className="text-xl font-bold text-white mb-2">No notifications yet</h2>
            <p className="text-[var(--text-secondary)]">
              We'll notify you when something important happens.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {notifications.map((notif, idx) => {
                const Icon = getNotifIcon(notif.type);
                return (
                  <motion.div
                    key={notif.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`flex items-start gap-4 p-5 transition-colors hover:bg-white/5 ${
                      isUnread(notif) ? 'bg-[var(--glow-blue)]' : ''
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'var(--bg-card-hover)' }}
                    >
                      <Icon className={`w-5 h-5 ${getNotifColor(notif.type)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isUnread(notif) ? 'font-semibold' : ''}`} style={{ color: isUnread(notif) ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {notif.title || notif.message || notif.content || 'Notification'}
                      </p>
                      {notif.title && notif.content && (
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{notif.content}</p>
                      )}
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {notif.created_at
                          ? new Date(notif.created_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                            })
                          : 'Just now'}
                      </p>
                    </div>
                    {isUnread(notif) && (
                      <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: 'var(--accent-blue)' }} />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
