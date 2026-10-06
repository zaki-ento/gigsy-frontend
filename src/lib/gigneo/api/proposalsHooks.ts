import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGigneo } from '../client';

export function useProposals(params: { page?: number, status?: string } = {}) {
  const queryString = new URLSearchParams(params as any).toString();
  return useQuery({
    queryKey: ['proposals', params],
    queryFn: () => fetchGigneo<any>(`/proposals?${queryString}`),
    staleTime: 30 * 1000,
  });
}

export function useSubmitProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchGigneo('/proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    }
  });
}
