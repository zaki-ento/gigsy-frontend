import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGigneo } from '../client';

export function useChats(params: { page?: number } = {}) {
  const queryString = new URLSearchParams(params as any).toString();
  return useQuery({
    queryKey: ['chats', params],
    queryFn: () => fetchGigneo<any>(`/chat?${queryString}`),
    staleTime: 15 * 1000, // 15 seconds
  });
}

export function useChatMessages(chatId: number, params: { page?: number } = {}) {
  const queryString = new URLSearchParams(params as any).toString();
  return useQuery({
    queryKey: ['chat-messages', chatId, params],
    queryFn: () => fetchGigneo<any>(`/chat/${chatId}/messages?${queryString}`),
    staleTime: 5 * 1000, // 5 seconds
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, data }: { chatId: number, data: any }) => fetchGigneo(`/chat/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });
}
