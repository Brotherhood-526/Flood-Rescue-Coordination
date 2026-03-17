import {Button} from "@/components/ui/button.tsx";
import {Undo2} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import ChatBox, {type MessageComponent} from "@/layouts/ChatBox.tsx";
import {useEffect, useState} from "react";
import {useChatbox} from "@/hooks/useChatbox.ts";

// const mockMessages: MessageComponent[] = [
//     { content: "Hello world", time: "10:30 AM", name: "Điều phối viên" },
//     { content: "Chúng tôi đã tới nơi", time: "10:31 AM", name: "Đội cứu hộ" },
//     { content: "Ok giữ liên lạc", time: "10:32 AM", name: "Điều phối viên" },
// ];

export type ChatBoxInfo = {
    id:string;
    senderRole: string;
    content: string;
    sendAt: string;
    senderName: string;
}

export default function CoordinatorChatBox() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<MessageComponent[]>([]);
    const {fetchMessage} = useChatbox();
    const { requestId } = useParams();

    const handleBack = ()=> {
        navigate(-1);
    }



    useEffect(() => {
        const loadMessages = async () => {
            if (!requestId) return;

            const data = await fetchMessage(requestId);

            const formatted: MessageComponent[] = data.map((msg) => ({
                content: msg.content,
                time: new Date(msg.sendAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                name: msg.senderName,
            }));

            setMessages(formatted);
        };

        loadMessages();
    }, [requestId]);
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
                    <ChatBox title={"Hộp Thoại"} senderName={"Điều phối viên"} messages={messages} setMessages={setMessages} />
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
                                <span className="font-bold">Đội trưởng nhóm:</span> (Tên nhóm)
                                <span className="px-4 py-1 rounded-[1vh] bg-blue-200 text-sky-800 ml-[1vh]">
                                    Đã nhận nhiệm vụ
                                </span>
                            </p>
                            <p>Sử dụng phương tiện giải cứu: (tên phương tiện)</p>
                            <p>Vị trí: (vị trí)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
