import { User, Headphones, LifeBuoy, ShieldCheck } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-4 w-full flex justify-center">
      <div className="w-full max-w-3xl flex flex-col gap-10">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Hướng dẫn sử dụng</h1>
          <p className="text-gray-600 font-medium">Hệ thống Quản lý Cứu hộ Khẩn cấp</p>
        </div>

        <div className="bg-gray-100 rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 uppercase mb-4">I. Giới thiệu chung</h2>
          
          <p className="text-gray-700 text-justify mb-6 leading-relaxed">
            Hệ thống Quản lý Cứu hộ Khẩn cấp là nền tảng công nghệ được phát triển nhằm hỗ trợ công tác cứu hộ, cứu nạn trong các tình huống khẩn cấp. Bằng việc sử dụng Hệ thống, người dùng đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây.
          </p>
          
          <p className="font-semibold text-gray-800 mb-4">Hệ thống gồm bốn (4) nhóm người dùng chính:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <User className="w-6 h-6 text-orange-500 shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900">Người dân</h3>
                <p className="text-gray-600 text-sm">Gửi yêu cầu cứu hộ và theo dõi trạng thái</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Headphones className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900">Điều phối viên</h3>
                <p className="text-gray-600 text-sm">Tiếp nhận, xác minh và điều phối nhiệm vụ</p>
              </div>
            </div>

            <div className="flex gap-3">
              <LifeBuoy className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900">Đội nhóm cứu hộ</h3>
                <p className="text-gray-600 text-sm">Thực hiện nhiệm vụ cứu hộ</p>
              </div>
            </div>

            <div className="flex gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900">Quản lý</h3>
                <p className="text-gray-600 text-sm">Quản lý hệ thống và người dùng</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-lg font-bold text-gray-800 uppercase mb-6">Quy trình sử dụng</h2>
          
          <div className="space-y-8 pl-2">
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                1
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Người dân gửi yêu cầu</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-800 marker:text-black">
                  <li>Vị trí GPS tự động ghi nhận</li>
                  <li>Mô tả chi tiết tình huống</li>
                  <li>Đính kèm hình ảnh (nếu có)</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                2
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Điều phối viên xử lý</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-800 marker:text-black">
                  <li>Nhận thông báo</li>
                  <li>Xem vị trí trên bản đồ</li>
                  <li>Phân loại: Thấp/Trung bình/Cao</li>
                  <li>Chấp nhận và từ chối</li>
                  <li>Chọn phương tiện và gắn đội</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                3
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Đội cứu hộ thực hiện</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-800 marker:text-black">
                  <li>Nhận nhiệm vụ</li>
                  <li>Xác nhận</li>
                  <li>Bắt đầu di chuyển</li>
                  <li>Xem vị trí trên bản đồ</li>
                  <li>Thực hiện cứu hộ</li>
                  <li>Báo cáo và hoàn thành</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                4
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Đồng bộ trạng thái</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-800 marker:text-black">
                  <li>Hệ thống tự động cập nhật</li>
                  <li>Người dân xác nhận đã nhận hỗ trợ</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    
    </div>
  );
}