import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { type RequestSchemaType } from "@/validations/user.request.schema"

interface AfterRequestPageProps {
  submittedData: RequestSchemaType | null;
  submittedPreviews: string[];
  rescueStatus: "pending" | "completed";
  onCancel: () => void;
  onComplete: () => void;
  onOpenEdit: () => void;
  onOpenChat: () => void;
}

export default function AfterRequestPage({
  submittedData,
  submittedPreviews,
  rescueStatus,
  onCancel,
  onComplete,
  onOpenEdit,
  onOpenChat
}: AfterRequestPageProps) {
  
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      
      <div className="flex items-center gap-3 pb-4">
        <button 
          onClick={onCancel} 
          className="p-1 hover:bg-gray-100 rounded-full transition-colors -ml-1"
          title="Hủy yêu cầu cứu hộ"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Thông tin cứu hộ 
        </h1>
        <button 
          onClick={onComplete} 
          disabled={rescueStatus === "completed"} 
          className="ml-auto rounded-full p-1 transition-all hover:bg-gray-100 disabled:hover:bg-transparent disabled:cursor-default"
          title={rescueStatus === "completed" ? "Đã cứu hộ thành công" : "Xác nhận đã được cứu hộ"}
        >
          <CheckCircle2 
            className={`w-7 h-7 transition-colors ${rescueStatus === "completed" ? "text-green-500" : "text-black hover:scale-110"}`} 
            fill="white" 
          />
        </button>
      </div>
      
      <hr className="border-black mb-3" />
      
      <div className="space-y-4 text-sm">
        <p><span className="font-semibold w-32 inline-block">Số điện thoại:</span> {submittedData?.phone}</p>
        <p><span className="font-semibold w-32 inline-block">Họ và tên:</span> {submittedData?.name}</p>
        <div className="flex items-center">
          <span className="font-semibold w-32">Phân loại:</span>
          <span className="bg-red-600 text-white border px-3 py-1 rounded-full text-xs font-bold">
            {submittedData?.type || "Chưa xác định"}
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold w-32">Trạng thái:</span>
          {rescueStatus === "pending" ? (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Đang xử lý</span>
          ) : (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Hoàn thành</span>
          )}
        </div>

        <div className="flex items-center">
          <span className="font-semibold w-32">Mức độ khẩn cấp:</span>
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Trung bình
          </span>
        </div>

        <p><span className="font-semibold w-32 inline-block">Thời gian gửi:</span> {new Date().toLocaleString('vi-VN')}</p>

        <div>
          <Label className="font-semibold text-gray-800 mb-1 block">Vị trí</Label>
          <div className="p-3 border rounded-lg bg-gray-50 text-gray-700">
            <p className="font-medium mb-1">{submittedData?.address}</p>
            <p className="text-xs text-gray-500">Tọa độ: {submittedData?.locate}</p>
          </div>
        </div>

        <div>
          <Label className="font-semibold text-gray-800 mb-1 block">Mô tả</Label>
          <div className="p-3 border rounded-lg bg-gray-50 text-gray-700 min-h-[80px] break-words whitespace-pre-wrap">
            {submittedData?.description}
          </div>
        </div>

        {submittedPreviews && submittedPreviews.length > 0 && (
          <div>
            <Label className="font-semibold text-gray-800 mb-2 block">Hình ảnh hiện trường</Label>
            <div className="grid grid-cols-3 gap-2">
              {submittedPreviews.map((src, idx) => (
                <img key={idx} src={src} alt={`uploaded-${idx}`} className="w-full h-[100px] object-cover rounded-lg border" />
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
  )
}