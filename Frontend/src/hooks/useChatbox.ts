import apiClient from "@/services/axiosClient.ts";
import type {ChatBoxInfo} from "@/pages/Coordinator/CoordinatorChatBox.tsx";


export function useChatbox() {
    const fetchMessage = async (id: string) => {
        const res = await apiClient.post("/coordinator/chatBox", {
            request_id: id,
        });

        const data = res as unknown as ChatBoxInfo[];
        return data;
    }

    const sendMessage = async (
        requestId: string,
        senderId: string,
        senderRole: string,
        content: string
    ) => {

        await apiClient.post("/coordinator/sendMessage", {
            requestId,
            senderRole,
            content,
            senderId,
            sendAt: new Date().toISOString()
        });

    }

    return {fetchMessage, sendMessage}
}