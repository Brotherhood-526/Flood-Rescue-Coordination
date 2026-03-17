import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Send } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  rescueTeamService,
  type RescueRequest,
} from "@/services/Rescue/rescueTeamService";

interface ChatMessage {
  id: number;
  sender: string;
  senderRole: string;
  content: string;
  time: string;
  imageUrl?: string;
}

export default function RescueChatBox() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const staff = useAuthStore((state) => state.staff);
  const [detail, setDetail] = useState<RescueRequest | null>(null);
  const [message, setMessage] = useState("");
  const isCompleted =
    detail?.status?.toLowerCase().includes("hoàn thành") ?? false;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "Điều phối viên",
      senderRole: "coordinator",
      content:
        "Yêu cầu cứu hộ đã được tiếp nhận. Chúng tôi đang xử lý và sẽ phản hồi sớm nhất.",
      time: "14:30",
    },
    {
      id: 2,
      sender: "Đội cứu hộ",
      senderRole: "rescue",
      content:
        "Đội cứu hộ đã nhận nhiệm vụ. Chúng tôi sẽ đến trong vòng 15-20 phút.",
      time: "14:32",
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
    if (detail)
      console.log(">>> status thực tế:", JSON.stringify(detail.status));
  }, [detail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getNow = () =>
    new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSend = () => {
    if (!message.trim() || isCompleted) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: staff?.name ?? "Đội cứu hộ",
        senderRole: "rescue",
        content: message.trim(),
        time: getNow(),
      },
    ]);
    setMessage("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: staff?.name ?? "Đội cứu hộ",
        senderRole: "rescue",
        content: "",
        time: getNow(),
        imageUrl,
      },
    ]);
    e.target.value = "";
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] pr-5 pl-5 pb-5 -mt-15 bg-white font-sans">
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
                  msg.senderRole === "rescue" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex gap-3 text-[15px] mb-1.5 font-semibold text-[#8b5cf6]">
                  <span>{msg.sender}</span>
                  <span className="text-gray-500 font-normal">{msg.time}</span>
                </div>
                {msg.imageUrl ? (
                  <>
                    <img
                      src={msg.imageUrl}
                      alt="Ảnh gửi"
                      onClick={() => setLightboxUrl(msg.imageUrl!)}
                      className="max-w-[85%] max-h-60 rounded-2xl border border-gray-200 shadow-sm object-cover cursor-zoom-in"
                    />
                  </>
                ) : (
                  <div
                    className={`p-4 rounded-2xl w-[85%] text-left text-[15px] leading-relaxed shadow-sm text-white ${
                      msg.senderRole === "rescue"
                        ? "bg-[#6366f1] rounded-tr-sm"
                        : "bg-[#3b82f6] rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                )}
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

            {/* Nút upload ảnh */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isCompleted}
              className="p-2 text-gray-600 hover:text-black transition-colors"
            >
              <ImageIcon size={26} strokeWidth={2} />
            </button>

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
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center cursor-zoom-out"
        >
          <img
            src={lightboxUrl}
            alt="Xem ảnh"
            className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
