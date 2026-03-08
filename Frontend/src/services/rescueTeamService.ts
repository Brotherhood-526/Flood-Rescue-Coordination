import apiClient from "./axiosClient";

export interface RescueRequest {
  id: string;
  phone: string;
  status: string;
  time: string;
}

// Định nghĩa các hàm gọi API
export const rescueTeamService = {
  getMyTeamRequests: async (): Promise<RescueRequest[]> => {
    const res = await apiClient.get("/api/rescue/my-requests");
    return res as unknown as RescueRequest[];
  },
};
