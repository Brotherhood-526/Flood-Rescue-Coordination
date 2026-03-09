import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function RescueChatBox() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

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
        <div className="w-full md:w-[60%] flex flex-col border-r border-gray-200 bg-white">
          <div className="bg-[#0f172a] text-white text-center py-3 font-bold text-[17px]">
            Hộp thoại
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
            <div className="flex flex-col items-end w-full">
              <div className="flex gap-3 text-[15px] mb-1.5 font-semibold text-[#8b5cf6]">
                <span>Điều phối viên</span>
                <span className="text-gray-500 font-normal">14:30</span>
              </div>
              <div className="bg-[#3b82f6] text-white p-4 rounded-2xl rounded-tr-sm w-[85%] text-left text-[15px] leading-relaxed shadow-sm">
                Yêu cầu cứu hộ bạn đã được tiếp nhận. Chúng tôi đang xử lý và sẽ
                phản hồi sớm nhất.
              </div>
            </div>

            <div className="flex flex-col items-start w-full">
              <div className="flex gap-3 text-[15px] mb-1.5 font-semibold text-[#6366f1]">
                <span>Đội cứu hộ</span>
                <span className="text-gray-500 font-normal">14:32</span>
              </div>
              <div className="bg-[#6366f1] text-white p-4 rounded-2xl rounded-tl-sm w-[85%] text-left text-[15px] leading-relaxed shadow-sm">
                Đội cứu hộ số đã nhận nhiệm vụ. Chúng tôi sẽ đến trong vòng
                15-20 phút.
              </div>
            </div>
          </div>

          {/* Vùng nhập tin nhắn */}
          <div className="p-4 bg-white flex items-center gap-3 border-t border-gray-200">
            <input
              type="text"
              placeholder="Nhập tin nhắn tại đây..."
              className="flex-1 bg-[#f3f4f6] text-gray-800 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-blue-300 transition-all font-medium text-[15px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setMessage("");
                }
              }}
            />
            <button className="p-2 text-gray-600 hover:text-black transition-colors">
              <ImageIcon size={26} strokeWidth={2} />
            </button>
            <button className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold px-6 py-3 rounded-md transition-colors shadow-sm text-[15px]">
              Gửi
            </button>
          </div>
        </div>

        <div className="w-full md:w-[40%] flex flex-col bg-[#f8fafc]">
          <div className="bg-[#ef4444] text-white text-center py-3 font-bold text-[17px]">
            Thông tin nhóm giải cứu
          </div>

          <div className="p-8 flex flex-col gap-6 text-gray-900 text-[17px]">
            <div className="flex items-center gap-3">
              <span className="font-extrabold">Đội trưởng nhóm #100</span>
              <span className="bg-blue-50 text-blue-500 px-3 py-1 rounded-md text-[15px] font-semibold border border-blue-100">
                Đã nhận nhiệm vụ
              </span>
            </div>

            <div className="font-bold">
              Sử dụng phương tiện giải cứu:{" "}
              <span className="font-normal text-gray-700">Trực thăng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
