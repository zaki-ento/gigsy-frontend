import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGigneo } from '../client';

export function useOrders(params: { status?: string, page?: number, per_page?: number } = {}) {
  const queryString = new URLSearchParams(params as any).toString();
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => fetchGigneo<any>(`/orders?${queryString}`),
    staleTime: 30 * 1000,
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchGigneo<any>(`/orders/${id}`),
    staleTime: 30 * 1000,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => fetchGigneo(`/orders/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });
}

export function useSubmitOrderDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => fetchGigneo(`/orders/${id}/delivery`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    }
  });
}
