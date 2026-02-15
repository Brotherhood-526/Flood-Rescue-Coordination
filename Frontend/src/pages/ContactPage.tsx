import { Phone, Mail, Globe, MapPin, PhoneCall } from 'lucide-react';
import Footer from '@/layouts/Footer';

export default function ContactPage() {
  return (
    <div>
    <div className="min-h-screen bg-white pt-10 pb-10 px-4 w-full flex justify-center">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Liên hệ với chúng tôi</h1>
          <p className="text-gray-600 font-medium">Hệ thống Quản lý Cứu hộ Khẩn cấp</p>
        </div>

        <div className="bg-[#EF4444] rounded-2xl p-8 text-white shadow-lg flex flex-col items-start gap-3">
          <div className="flex items-center gap-3 mb-1">
            <PhoneCall className="w-8 h-8 animate-pulse" />
            <span className="text-2xl font-bold">Khẩn cấp</span>
          </div>
          <div className="text-4xl font-extrabold tracking-wider">
            1900-XXXX
          </div>
          <div className="text-xl font-semibold">
            Gọi ngay khi cần cứu hộ
          </div>
        </div>

        <div className="bg-[#DFFFED] rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Thông tin liên hệ</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Email</p>
                <p className="text-gray-900 font-bold text-lg">support@rescuesystem.vn</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Hotline hỗ trợ</p>
                <p className="text-gray-900 font-bold text-lg">1900-YYYY</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Trang web</p>
                <p className="text-gray-900 font-bold text-lg">www.rescuesystem.vn</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Địa chỉ</p>
                <p className="text-gray-900 font-bold text-lg">FPTU-HCM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFF9C4] rounded-2xl p-8 shadow-sm mb-20">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Câu hỏi thường gặp</h2>
          
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-black rounded-full shrink-0" />
              <span className="text-gray-800 font-bold text-lg">Làm thế nào để gửi yêu cầu cứu hộ?</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-black rounded-full shrink-0" />
              <span className="text-gray-800 font-bold text-lg">Thời gian phản hồi trung bình?</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-black rounded-full shrink-0" />
              <span className="text-gray-800 font-bold text-lg">Làm sao để theo dõi trạng thái yêu cầu của mình?</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-black rounded-full shrink-0" />
              <span className="text-gray-800 font-bold text-lg">Hệ thống hoạt động chính xác?</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
    <Footer/>
    </div>
  );
}