import { Dialog, DialogContent } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import type { ChatBoxDialogProps } from "@/types/requestProps";
export default function ChatBoxDialog({
  isOpen,
  onOpenChange,
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  requestStatus,
}: ChatBoxDialogProps) {
  const isFinished =
    requestStatus === "đã huỷ" || requestStatus === "hoàn thành";
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[95vw] h-[80vh] flex flex-col p-0 overflow-hidden">
        <div className="bg-black text-white text-center py-4 text-3xl font-bold shrink-0">
          Thêm phản ánh cứu hộ
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute rounded-md right-4 top-5.5 bg-white cursor-pointer"
        >
          <XIcon className="text-[#da291c]" />
        </button>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className={`font-semibold text-sm ${msg.colorClass}`}>
                  {msg.name}
                </span>
                <span className="text-gray-500 text-xs">{msg.time}</span>
              </div>
              <div
                className={`px-5 py-3 rounded-2xl max-w-[85%] text-sm md:text-base leading-relaxed ${msg.bgClass} ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm text-white"} shadow-sm`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t shrink-0">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={
                isFinished
                  ? "Yêu cầu cứu hộ đã kết thúc"
                  : "Nhập tin nhắn tại đây"
              }
              disabled={isFinished}
              className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isFinished}
              className="bg-[#da291c] hover:bg-[#b02115] disabled:bg-red-300 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
            >
              Gửi
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
