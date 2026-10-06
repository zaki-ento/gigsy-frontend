import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGigneo } from '../client';

export function useAccount() {
  return useQuery({
    queryKey: ['account'],
    queryFn: () => fetchGigneo<any>('/account'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchGigneo('/account', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] });
    }
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['account-notifications'],
    queryFn: () => fetchGigneo<any>('/account/notifications'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { type: string, value: string }) => fetchGigneo('/account/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-notifications'] });
    }
  });
}
