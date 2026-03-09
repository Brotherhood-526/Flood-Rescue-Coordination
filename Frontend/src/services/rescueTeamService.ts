export interface RescueTeamInfo {
  teamId: string;
  memberCount: number;
}

export interface RescueRequest {
  id: string;
  phone: string;
  status: string;
  time: string;
}

export const rescueTeamService = {
  // Lấy thông tin đội (giữ nguyên)
  getTeamInfo: async (): Promise<RescueTeamInfo> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          teamId: "Biệt đội Cá Heo",
          memberCount: 5,
        });
      }, 500);
    });
  },

  // HÀM LẤY DANH SÁCH YÊU CẦU (MOCK DATA)
  getRequests: async (): Promise<RescueRequest[]> => {
    // Để gọi API thật mốt Backend có, mở comment 2 dòng dưới và xóa khối Promise đi:
    // const response = await apiClient.get('/api/rescue-team/requests');
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "REQ-1001",
            phone: "0901234567",
            status: "Đang xử lý",
            time: "09/03/2026 08:30",
          },
          {
            id: "REQ-1002",
            phone: "0988776655",
            status: "Đã hoàn thành",
            time: "09/03/2026 09:15",
          },
          {
            id: "REQ-1003",
            phone: "0911223344",
            status: "Tạm hoãn cứu hộ",
            time: "09/03/2026 10:05",
          },
          {
            id: "REQ-1004",
            phone: "0933445566",
            status: "Đang xử lý",
            time: "09/03/2026 10:30",
          },
          {
            id: "REQ-1005",
            phone: "0888999000",
            status: "Đã hoàn thành",
            time: "08/03/2026 14:20",
          },
          {
            id: "REQ-1006",
            phone: "0707888999",
            status: "Đang xử lý",
            time: "08/03/2026 16:45",
          },
          {
            id: "REQ-1007",
            phone: "0866555444",
            status: "Tạm hoãn cứu hộ",
            time: "07/03/2026 07:10",
          },
          {
            id: "REQ-1008",
            phone: "0944333222",
            status: "Đã hoàn thành",
            time: "07/03/2026 11:55",
          },
        ]);
      });
    });
  },
};
