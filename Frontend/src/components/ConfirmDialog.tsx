import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận đăng xuất",
  description = "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        ></button>

        <div className="flex flex-col items-center text-center mt-2">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-[15px] mb-6 px-2">{description}</p>
        </div>

        <div className="flex gap-3 w-full">
          <Button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 border-none shadow-none"
          >
            Quay lại
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-md"
          >
            Đăng xuất ngay
          </Button>
        </div>
      </div>
    </div>
  );
}
