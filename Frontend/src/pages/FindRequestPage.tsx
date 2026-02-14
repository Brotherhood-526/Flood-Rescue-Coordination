import { useState } from 'react';
import { Search, ArrowRight, Loader2, FileQuestion } from 'lucide-react'; 
import { Button } from '@/components/ui/button';


interface RescueTeam {
  id: string;
  captain: string;
  coordinator: string;
  vehicle: string;
  contact_number?: string;
}

interface VictimInfo {
  phone: string;
  full_name: string;
  urgency_level: 'Thấp' | 'Trung bình' | 'Cao';
  current_status: string;
  created_at: string;
}

interface RescueRequestData {
  request_id: string;
  is_verified: boolean;
  assigned_team: RescueTeam | null;
  victim_details: VictimInfo;
  notes?: string;
}

interface ApiResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: RescueRequestData | null;
  timestamp: string;
}

export default function FindRequestPage() {
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const MOCK_SUCCESS_DATA: ApiResponse = {
    success: true,
    status_code: 200,
    message: "Tìm thấy yêu cầu thành công.",
    timestamp: new Date().toISOString(),
    data: {
      request_id: "REQ-2026-9999",
      is_verified: true,
      assigned_team: {
        id: "01",
        captain: "Nguyễn Huy Phong",
        coordinator: "Võ Đức Trí",
        vehicle: "Trực thăng"
      },
      victim_details: {
        phone: "0972696902",
        full_name: "chị Linh xinh đẹp cute",
        urgency_level: "Cao",
        current_status: "Đang xử lý",
        created_at: "01/01/2036"
      }
    }
  };

  const MOCK_NOT_FOUND_DATA: ApiResponse = {
    success: false,
    status_code: 404,
    message: "Không tìm thấy yêu cầu cứu hộ nào với số điện thoại này.",
    data: null,
    timestamp: new Date().toISOString()
  };

  const handleSearch = () => {
    if (!phoneInput.trim()) return;

    setIsLoading(true);
    setApiResponse(null);

    setTimeout(() => {
      if (phoneInput === '0972696902') {
        setApiResponse(MOCK_SUCCESS_DATA);
      } 
      else {
        setApiResponse(MOCK_NOT_FOUND_DATA);
      }

      setIsLoading(false);
    }, 1000);
  };

  const renderContent = () => {
    if (!apiResponse) 
        return null;
    if (!apiResponse.success || !apiResponse.data) {
      return (
        <div className="w-full max-w-3xl flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <FileQuestion className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy dữ liệu</h3>
          <p className="text-gray-500 text-center max-w-md">
            {apiResponse.message} <br/>
            Vui lòng kiểm tra lại số điện thoại hoặc liên hệ tổng đài hỗ trợ.
          </p>
        </div>
      );
    }

    const { assigned_team, victim_details } = apiResponse.data;

    return (
      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
    
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Thông tin đội cứu hộ</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 font-semibold border border-blue-400 w-24 text-center">ID đội</th>
                  <th className="p-3 font-semibold border border-blue-400 text-center">Tên đội trưởng</th>
                  <th className="p-3 font-semibold border border-blue-400 text-center">Tên điều phối viên</th>
                  <th className="p-3 font-semibold border border-blue-400 text-center">Phương tiện sử dụng</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white text-gray-700">
                  <td className="p-3 border border-gray-400 text-center">{assigned_team?.id || "-"}</td>
                  <td className="p-3 border border-gray-400 text-center">{assigned_team?.captain || "Đang cập nhật"}</td>
                  <td className="p-3 border border-gray-400 text-center">{assigned_team?.coordinator || "Đang cập nhật"}</td>
                  <td className="p-3 border border-gray-400 text-center text-center">{assigned_team?.vehicle || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Thông tin người dân</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 font-semibold border border-blue-400 w-36 text-center">Số điện thoại</th>
                  <th className="p-3 font-semibold border border-blue-400 text-center">Họ và tên</th>
                  <th className="p-3 font-semibold border border-blue-400 w-40 text-center">Mức độ khẩn cấp</th>
                  <th className="p-3 font-semibold border border-blue-400 w-40 text-center">Trạng thái</th>
                  <th className="p-3 font-semibold border border-blue-400 text-center w-46">Thời gian gửi cứu hộ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white text-gray-700">
                  <td className="p-3 border border-gray-400 text-center">{victim_details.phone}</td>
                  <td className="p-3 border border-gray-400 text-center">{victim_details.full_name}</td>
                  <td className="p-3 border border-gray-400 text-center">{victim_details.urgency_level}</td>
                  <td className="p-3 border border-gray-400 text-center">{victim_details.current_status}</td>
                  <td className="p-3 border border-gray-400 text-center ">{victim_details.created_at}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end mt-3 mb-20">
          <a href="#" className="group flex items-center gap-1 text-black font-semibold hover:text-blue-500 transition-colors italic underline">
            Xem chi tiết <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-4 flex flex-col items-center w-full mt-15">
      <div className="w-full max-w-3xl border-2 rounded-lg overflow-hidden mb-12 shadow-sm">
        <div className="bg-blue-500 py-6 text-center text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Tra cứu cứu hộ</h1>
          <p className="text-blue-100 text-sm md:text-base">
            Nhập số điện thoại để kiểm tra trạng thái yêu cầu cứu hộ
          </p>
        </div>
        <div className="bg-white p-8 flex flex-col gap-6 items-center">
          <input
            type="text"
            placeholder="Nhập số điện thoại bạn dùng để yêu cầu cứu hộ"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={isLoading}
            className="w-full max-w-lg px-4 py-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full max-w-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold py-6 text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Kiểm tra ngay
          </Button>
        </div>
        
      </div>
      {renderContent()}

      
    </div>
    
  );
}