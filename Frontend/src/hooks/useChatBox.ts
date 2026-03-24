import { useCallback, useState } from "react";
import { chatService, type ChatMessageDto } from "@/services/chatSerivice";
import { getAxiosErrorMessage } from "@/utils/errorHandler";

export const useChatbox = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessage = useCallback(async (requestId: string): Promise<ChatMessageDto[]> => {
    if (!requestId) return [];
    try {
      setLoading(true);
      setError(null);
      return await chatService.getCoordinatorMessages(requestId);
    } catch (err) {
      setError(getAxiosErrorMessage(err, "Không thể tải lịch sử chat."));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (
      requestId: string,
      senderId: string,
      content: string,
    ): Promise<ChatMessageDto | null> => {
      if (!requestId || !senderId || !content.trim()) return null;
      try {
        setLoading(true);
        setError(null);
        return await chatService.sendCoordinatorMessage(requestId, senderId, {
          content: content.trim(),
          sendAt: new Date().toISOString(),
        });
      } catch (err) {
        setError(getAxiosErrorMessage(err, "Không thể gửi tin nhắn."));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { fetchMessage, sendMessage, loading, error };
};
