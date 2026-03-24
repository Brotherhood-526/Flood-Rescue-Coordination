import {Button} from "@/components/ui/button.tsx";
import {Undo2} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import ChatBox, {type MessageComponent} from "@/layouts/ChatBox.tsx";
import {useEffect, useState} from "react";
import {useChatbox} from "@/hooks/useChatBox";
import { useAuthStore } from "@/store/authStore";
import { coordinatorService } from "@/services/Coordinator/coordinatorService";
import type { RequestDetail } from "@/types/coordinator";

// const mockMessages: MessageComponent[] = [
//     { content: "Hello world", time: "10:30 AM", name: "Điều phối viên" },
//     { content: "Chúng tôi đã tới nơi", time: "10:31 AM", name: "Đội cứu hộ" },
//     { content: "Ok giữ liên lạc", time: "10:32 AM", name: "Điều phối viên" },
// ];

export type ChatBoxInfo = {
    id:string;
    senderRole: string;
    content: string;
    sentAt: string;
    senderName: string;
    senderId: string;
}

export default function ChatBoxPage() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<MessageComponent[]>([]);
    const {fetchMessage} = useChatbox();
    const { requestId } = useParams();
    const [requestDetail, setRequestDetail] = useState<RequestDetail | null>(null);
    const [tick, setTick] = useState(0);
    const staff = useAuthStore((state) => state.staff);

    const senderId = staff?.accountId;

    const handleBack = ()=> {
        navigate(-1);
    }

    useEffect(() => {
        const loadRequestDetail = async () => {
            if (!requestId) return;
            try {
                const detail = await coordinatorService.getRequestDetail(requestId);
                setRequestDetail(detail);
            } catch (error) {
                console.error("Fetch request detail failed:", error);
            }
        };
        loadRequestDetail();
    }, [requestId]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick((prev) => prev + 1);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const loadMessages = async () => {
            if (!requestId) return;

            const data = await fetchMessage(requestId);

            const formatted: MessageComponent[] = data.map((msg) => ({
                content: msg.content,
                time: new Date(msg.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                name: msg.senderName,
                senderId: msg.senderId,
            }));

            setMessages(formatted);
        };

        loadMessages();
    }, [requestId, tick]);

    const isCompleted =
        requestDetail?.status?.toLowerCase().includes("hoàn thành") ?? false;
    const statusLabel = requestDetail?.status ?? "Chưa cập nhật";
    const vehicleLabel = requestDetail?.vehicleType ?? "Chưa điều xe";
    const rescueTeamLabel = requestDetail?.rescueTeamName ?? "Chưa phân công";



    return (
        <div className="flex flex-col w-full h-full mt-[3vh]">
            <div className="ml-[1vw]">
                <Button className="!bg-gray-300 !text-black !font-bold"
                        onClick={handleBack}>
                    <Undo2 className="!w-5 !h-5" strokeWidth={2.5} />
                    Quay Lại
                </Button>
            </div>

            <div className="flex flex-row w-full mt-[2vh]">
                <div className="w-1/2 h-[75vh]">
                    <ChatBox title={"Hộp Thoại"}
                             senderId={senderId!} requestId={requestId!}
                             inputDisabled={isCompleted}
                             inputPlaceholder={
                                 isCompleted
                                     ? "Nhiệm vụ đã hoàn thành nên không thể gửi tin nhắn"
                                     : "Nhập tin nhắn tại đây..."
                             }
                             messages={messages} setMessages={setMessages} />
                </div>

                <div className="w-1/2 h-[75vh]">
                    <div className={`flex flex-col w-full h-full bg-gray-200`}>

                        {/* Header */}
                        <div className="flex items-center justify-center h-[15%] max-h-[8vh] min-h-[5vh] bg-red-600 text-white font-bold text-[1.3em]">
                            Thông tin nhóm giải cứu
                        </div>

                        {/*Tất cả giá trị trong ngoặc đều lấy từ api hoặc được truyền vào*/}
                        <div className="flex flex-col gap-2 text-[1.3em] p-[3vw]">
                            <p>
                                <span className="font-bold">Đội trưởng nhóm:</span> {rescueTeamLabel}
                                <span className="px-4 py-1 rounded-[1vh] bg-blue-200 text-sky-800 ml-[1vh]">
                                    {statusLabel}
                                </span>
                            </p>
                            <p>Sử dụng phương tiện giải cứu: {vehicleLabel}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
