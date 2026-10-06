import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGigneo } from '../client';

export function useServices(params: { category?: number, search?: string, page?: number } = {}) {
  const queryString = new URLSearchParams(params as any).toString();
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => fetchGigneo<any>(`/services?${queryString}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useService(id: number) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchGigneo<any>(`/services/${id}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchGigneo('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
    }
  });
}

export function useJobs(params: { category?: number, search?: string, page?: number } = {}) {
  const queryString = new URLSearchParams(params as any).toString();
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => fetchGigneo<any>(`/jobs?${queryString}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useJob(id: number) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchGigneo<any>(`/jobs/${id}`),
    staleTime: 5 * 60 * 1000,
  });
}
