import { useCallback, useState } from "react";
import { chatService, type ChatMessageDto } from "@/services/chatService.ts";
import { getAxiosErrorMessage } from "@/utils/errorHandler";

type ChatScope = "coordinator" | "rescue" | "citizen";

export const useChatbox = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessage = useCallback(
    async (requestId: string, scope: ChatScope = "coordinator"): Promise<ChatMessageDto[]> => {
      if (!requestId) return [];
      try {
        setLoading(true);
        setError(null);
        if (scope === "rescue") {
          return await chatService.getRescueMessages(requestId);
        }
        if (scope === "citizen") {
          return await chatService.getCitizenMessages(requestId);
        }
        return await chatService.getCoordinatorMessages(requestId);
      } catch (err) {
        setError(getAxiosErrorMessage(err, "Không thể tải lịch sử chat."));
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const sendMessage = useCallback(
    async (
      requestId: string,
      senderId: string,
      content: string,
      scope: ChatScope = "coordinator",
    ): Promise<ChatMessageDto | null> => {
      if (!requestId || !content.trim()) return null;
      try {
        setLoading(true);
        setError(null);
        const payload = {
          content: content.trim(),
          sendAt: new Date().toISOString(),
        };
        if (scope === "citizen") {
          return await chatService.sendCitizenMessage(requestId, payload);
        }
        if (!senderId) return null;
        if (scope === "rescue") {
          return await chatService.sendRescueMessage(requestId, senderId, payload);
        }
        return await chatService.sendCoordinatorMessage(requestId, senderId, payload);
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
