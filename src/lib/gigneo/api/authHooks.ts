import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGigneo } from '../client';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: any) => fetchGigneo('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    onSuccess: (data: any) => {
      if (data.token) {
        localStorage.setItem('gigneo_token', data.token);
      }
      queryClient.invalidateQueries();
    }
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: any) => fetchGigneo('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: any) => fetchGigneo('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  });
}
