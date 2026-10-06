import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGigneo } from '../client';

export function useWalletBalance() {
  return useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => fetchGigneo<any>('/wallet/balance'),
    staleTime: 10 * 1000, // 10 sec
  });
}

export function useWalletTransactions(page = 1) {
  return useQuery({
    queryKey: ['wallet-transactions', page],
    queryFn: () => fetchGigneo<any>(`/wallet/transactions?page=${page}`),
    staleTime: 30 * 1000,
  });
}

export function useDepositFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchGigneo('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });
}

export function useWithdrawFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchGigneo('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });
}
