import apiClient from "@/services/axiosClient";

export type ChatMessageDto = {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  sentAt: string;
};

type SendMessagePayload = {
  content: string;
  sendAt?: string;
};

export const chatService = {
  getCoordinatorMessages: async (requestId: string): Promise<ChatMessageDto[]> => {
    return (await apiClient.get(
      `/coordinator/chat/${requestId}`,
    )) as unknown as ChatMessageDto[];
  },

  sendCoordinatorMessage: async (
    requestId: string,
    senderId: string,
    payload: SendMessagePayload,
  ): Promise<ChatMessageDto> => {
    return (await apiClient.post(`/coordinator/chat/${requestId}`, payload, {
      params: { testAccountId: senderId || undefined },
    })) as unknown as ChatMessageDto;
  },

  getRescueMessages: async (requestId: string): Promise<ChatMessageDto[]> => {
    return (await apiClient.get(
      `/rescueteam/chat/${requestId}`,
    )) as unknown as ChatMessageDto[];
  },

  sendRescueMessage: async (
    requestId: string,
    senderId: string,
    payload: SendMessagePayload,
  ): Promise<ChatMessageDto> => {
    return (await apiClient.post(`/rescueteam/chat/${requestId}`, payload, {
      params: { testAccountId: senderId || undefined },
    })) as unknown as ChatMessageDto;
  },
};
