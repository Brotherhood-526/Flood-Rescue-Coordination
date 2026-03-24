import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { rescueTeamService } from "@/services/Rescue/rescueTeamService";
import { useChatbox } from "@/hooks/useChatBox";
import type { RescueRequest } from "@/types/rescue";
interface ChatMessage {
  id: string;
  sender: string;
  senderRole: string;
  content: string;
  time: string;
}

export default function RescueChatBox() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const staff = useAuthStore((state) => state.staff);
  const [detail, setDetail] = useState<RescueRequest | null>(null);
  const [message, setMessage] = useState("");
  const isCompleted =
    detail?.status?.toLowerCase().includes("hoàn thành") ?? false;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tick, setTick] = useState(0);
  const { fetchMessage, sendMessage, error: chatError } = useChatbox();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch task detail để lấy vehicleType
  useEffect(() => {
    if (!requestId) return;
    const fetch = async () => {
      try {
        const data = await rescueTeamService.getTaskDetail(requestId);
        setDetail(data);
      } catch (e) {
        console.error("Lỗi fetch detail chat:", e);
      }
    };
    fetch();
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
      const formatted: ChatMessage[] = data.map((msg) => ({
        id: msg.id,
        sender: msg.senderName,
        senderRole: msg.senderRole,
        content: msg.content,
        time: new Date(msg.sentAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setMessages(formatted);
    };
    loadMessages();
  }, [requestId, tick, fetchMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isCompleted) return;
    if (!requestId || !staff?.accountId) return;
    const sent = await sendMessage(requestId, staff.accountId, message);
    if (!sent) return;
    setMessages((prev) => [
      ...prev,
      {
        id: sent.id,
        sender: sent.senderName,
        senderRole: sent.senderRole,
        content: sent.content,
        time: new Date(sent.sentAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setMessage("");
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] pr-5 pl-5 pb-5 mt-10 bg-white font-sans">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-5 py-2.5 mb-6 bg-[#e5e7eb] hover:bg-[#d1d5db] text-gray-800 rounded-full font-bold text-sm transition-colors w-fit shadow-sm"
      >
        <ArrowLeft size={18} />
        Quay lại
      </button>

      <div className="flex flex-col md:flex-row w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm h-150">
        {/* Hộp thoại bên trái */}
        <div className="w-full md:w-[60%] flex flex-col border-r border-gray-200 bg-white">
          <div className="bg-[#0f172a] text-white text-center py-3 font-bold text-[17px]">
            Hộp thoại
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col w-full ${
                  msg.senderRole === "cứu hộ" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex gap-3 text-[15px] mb-1.5 font-semibold text-[#8b5cf6]">
                  <span>{msg.sender}</span>
                  <span className="text-gray-500 font-normal">{msg.time}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl w-[85%] text-left text-[15px] leading-relaxed shadow-sm text-white ${
                    msg.senderRole === "cứu hộ"
                      ? "bg-[#6366f1] rounded-tr-sm"
                      : "bg-[#3b82f6] rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {isCompleted && (
            <div className="px-4 py-2 bg-green-50 border-t border-green-200 text-green-700 text-sm font-semibold text-center">
              Nhiệm vụ đã hoàn thành, không thể gửi tin nhắn mới
            </div>
          )}
          {/*thanh chat */}
          <div className="p-4 bg-white flex items-center gap-3 border-t border-gray-200">
            <input
              type="text"
              placeholder="Nhập tin nhắn tại đây"
              disabled={isCompleted}
              className="flex-1 bg-[#f3f4f6] text-gray-800 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-blue-300 transition-all font-medium text-[15px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <button
              onClick={handleSend}
              disabled={isCompleted}
              className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold px-6 py-3 rounded-md transition-colors shadow-sm text-[15px] flex items-center gap-2"
            >
              <Send size={16} />
              Gửi
            </button>
          </div>
        </div>

        {/* cột phải thông tin nhóm */}
        <div className="w-full md:w-[40%] flex flex-col bg-[#f8fafc]">
          <div className="bg-[#ef4444] text-white text-center py-3 font-bold text-[17px]">
            Thông tin nhóm giải cứu
          </div>

          <div className="p-8 flex flex-col gap-6 text-gray-900 text-[17px]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-extrabold">
                {staff?.name ?? "Đang tải..."}
              </span>
              <span className="bg-blue-50 text-blue-500 px-3 py-1 rounded-md text-[15px] font-semibold border border-blue-100">
                Đã nhận nhiệm vụ
              </span>
            </div>

            <div className="font-bold">
              Tên đội:{" "}
              <span className="font-normal text-gray-700">
                {staff?.teamName ?? "N/A"}
              </span>
            </div>

            <div className="font-bold">
              Sử dụng phương tiện:{" "}
              <span className="font-normal text-gray-700">
                {detail?.vehicleType ?? "Chưa điều xe"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {chatError && (
        <div className="mt-3 text-sm text-red-600">{chatError}</div>
      )}
    </div>
  );
}
