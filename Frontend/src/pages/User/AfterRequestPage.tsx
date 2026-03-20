import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";
import { type RequestSchemaType } from "@/validations/user.request.schema";
import axiosClient from "@/services/axiosClient";
interface AfterRequestPageProps {
  submittedData: RequestSchemaType | null;
  requestId: string | number | null;
  submittedPreviews: string[];
  status: string | null;
  onCancel: () => void;
  onOpenEdit: () => void;
  onOpenChat: () => void;
}

export default function AfterRequestPage({
  submittedData,
  requestId,
  submittedPreviews,
  status,
  onCancel,
  onOpenEdit,
  onOpenChat,
}: AfterRequestPageProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelRequest = async () => {
    try {
      setLoading(true);
      await axiosClient.put(`/citizen/cancel/${requestId}`);
      setShowConfirm(false);
      onCancel();
    } catch {
      alert("Hủy yêu cầu thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Thêm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 mx-4 shadow-xl">
            <h2 className="text-lg font-bold mb-2">Xác nhận hủy yêu cầu</h2>
            <p className="text-gray-600 text-sm mb-6">
              Bạn có chắc muốn hủy yêu cầu cứu hộ này không?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-black py-2 rounded-lg text-sm font-semibold hover:bg-gray-300"
              >
                Không
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  onCancel(); // chỉ reset UI không gọi API hủy
                }}
                className="flex-1 border border-black hover:bg-gray-300 text-gray-800 py-2 rounded-lg text-sm font-semibold"
              >
                Thoát
              </button>

              <button
                onClick={handleCancelRequest}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-red-400"
              >
                {loading ? "Đang hủy" : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">Thông tin cứu hộ</h1>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-200 border border-black text-red-600 rounded-full text-xs font-semibold transition-all"
          >
            <X className="w-3.5 h-3.5" />
            Thoát/Hủy
          </button>
        </div>
        <hr className="border-black" />
      </div>

      <div className="space-y-4 text-sm">
        <p>
          <span className="font-semibold w-32 inline-block">Họ và tên:</span>{" "}
          {submittedData?.name}
        </p>
        <p>
          <span className="font-semibold w-32 inline-block">
            Số điện thoại:
          </span>{" "}
          {submittedData?.phone}
        </p>

        <div className="flex items-center">
          <span className="font-semibold w-32">Phân loại:</span>
          <span className="bg-red-600 text-white border px-3 py-1 rounded-full text-xs font-bold capitalize">
            {submittedData?.type || "Chưa xác định"}
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold w-32">Trạng thái:</span>
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
            {status
              ? status.charAt(0).toUpperCase() + status.slice(1)
              : "Yêu cầu mới"}
          </span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold w-32">Mức độ khẩn cấp:</span>
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Trung
            bình
          </span>
        </div>

        <p>
          <span className="font-semibold w-32 inline-block">
            Thời gian gửi:
          </span>{" "}
          {new Date().toLocaleString("vi-VN")}
        </p>

        <div>
          <Label className="font-semibold text-gray-800 mb-1 block">
            Vị trí
          </Label>
          <div className="p-3 border rounded-lg bg-gray-50 text-gray-700">
            <p className="font-medium mb-1">{submittedData?.address}</p>
            <p className="text-xs text-gray-500">
              Tọa độ: {submittedData?.locate}
            </p>
          </div>
        </div>

        <div>
          <Label className="font-semibold text-gray-800 mb-1 block">
            Mô tả
          </Label>
          <div className="p-3 border rounded-lg bg-gray-50 text-gray-700 min-h-20 wrap-break-word whitespace-pre-wrap">
            {submittedData?.description}
          </div>
        </div>

        {submittedPreviews && submittedPreviews.length > 0 && (
          <div>
            <Label className="font-semibold text-gray-800 mb-2 block">
              Hình ảnh hiện trường
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {submittedPreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`uploaded-${idx}`}
                  className="w-full h-25 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onOpenEdit}
          className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-3 rounded-lg transition-colors text-sm"
        >
          Chỉnh sửa thông tin
        </button>
        <button
          onClick={onOpenChat}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-colors text-sm"
        >
          Thêm phản ánh cứu hộ
        </button>
      </div>
    </div>
  );
}
