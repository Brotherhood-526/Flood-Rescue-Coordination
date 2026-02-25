// interface chỉ dùng để chứa khuôn mẫu chứ ko chứa dữ liệu thật như json
interface RescueTeam {
  id: string;
  captain: string;
  coordinator: string;
  vehicle: string;
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
}

export interface ApiResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: RescueRequestData | null;
  timestamp: string;
}

// Call đc BE thì xóa const này
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

// Call đc BE thì xóa const này
const MOCK_NOT_FOUND_DATA: ApiResponse = {
  success: false,
  status_code: 404,
  message: "Không tìm thấy yêu cầu cứu hộ nào với số điện thoại này.",
  data: null,
  timestamp: new Date().toISOString()
};

export const findRequestByPhone = async (phone: string): Promise<ApiResponse> => {
  // Sau này thay đoạn này bằng call BE
  // const res = await fetch(`/api/rescue-requests?phone=${phone}`)
  // return res.json() as ApiResponse

  // Mock tạm
  if (phone === "0972696902") 
    return MOCK_SUCCESS_DATA;
  return MOCK_NOT_FOUND_DATA;
};