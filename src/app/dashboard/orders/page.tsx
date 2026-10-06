'use client';

import { fetchApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBagIcon, ClockIcon, ArrowRightIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function OrdersPage() {
  const { data: response, isLoading: loading } = useQuery({
    queryKey: ['orders-page'],
    queryFn: () => fetchApi('/orders'),
    staleTime: 30 * 1000,
  });

  const orders = response?.items || [];

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-black mb-2">Orders</h1>
        <p className="text-[var(--text-secondary)]">Track your active projects and deliveries.</p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton w-full h-20 rounded-xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center">
            <ShoppingBagIcon className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
            <h2 className="text-xl font-bold text-black mb-2">No orders found</h2>
            <p className="text-[var(--text-secondary)] mb-6">You don't have any active orders right now.</p>
            <Link href="/services" className="btn-primary inline-flex px-6 py-3 rounded-xl font-bold">
              <span className="relative z-10">Browse Marketplace</span>
            </Link>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <AnimatePresence>
              {orders.map((order: any, idx: number) => (
                <Link href={`/dashboard/orders/${order.id}`} key={order.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white rounded-2xl p-5 flex flex-col gap-4 border transition-all hover:shadow-lg hover:border-[var(--accent-blue)] mb-4"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {/* Top Row: Title & Status */}
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-semibold text-lg line-clamp-1 text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                        {order.job?.title || order.service?.title || order.job_service_title || order.item_name || order.formatted_id || `Order #${order.id}`}
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
                        <span className="flex items-center gap-1.5">
                          <ClockIcon className="w-4 h-4 text-gray-400" /> Ordered: {new Date(order.created_at || order.started_at).toLocaleDateString()}
                        </span>
                        {order.delivery_time && (
                          <span className="flex items-center gap-1.5 text-amber-600">
                            <ClockIcon className="w-4 h-4" /> {order.delivery_time} delivery
                          </span>
                        )}
                        {order.delivery_at && !order.delivery_time && (
                          <span className="flex items-center gap-1.5 text-amber-600">
                            <ClockIcon className="w-4 h-4" /> Due: {new Date(order.delivery_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 ml-auto">
                        <span className="font-bold text-[var(--text-primary)] text-lg" dangerouslySetInnerHTML={{ __html: order.total_html || order.total_price_html || `$${order.total || 0.00}` }} />
                        <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-[var(--accent-blue)] group-hover:text-white flex items-center justify-center transition-colors">
                          <ArrowRightIcon className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
