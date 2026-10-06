import { useQuery } from '@tanstack/react-query';
import { fetchGigneo } from '../client';
import { WalletBalance, Order, Notification } from '../types';

export function useWalletBalance() {
  return useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => fetchGigneo<WalletBalance>('/wallet/balance'),
    staleTime: 10 * 1000,
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => fetchGigneo<Order[]>('/orders?per_page=5'),
    staleTime: 30 * 1000,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchGigneo<Notification[]>('/notifications?per_page=5'),
    staleTime: 15 * 1000,
  });
}

// Added for the user's specific dashboard payload
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetchGigneo<any>('/dashboard'),
    staleTime: 30 * 1000,
  });
}

export function useOrderNotifications() {
  return useQuery({
    queryKey: ['order-notifications'],
    queryFn: () => fetchGigneo<any>('/notifications?category=order&per_page=05'),
    staleTime: 15 * 1000,
  });
}
