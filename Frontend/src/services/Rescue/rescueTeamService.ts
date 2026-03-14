import apiClient from "@/services/axiosClient";
export interface RescueTeamInfo {
  teamId: string;
  memberCount: number;
}

export interface RescueRequest {
  id: string;
  citizenPhone: string;
  status: string;
  createdAt: string;
}

export const rescueTeamService = {
  getRequests: async (
    page: number = 0,
    filter: string = "",
  ): Promise<RescueRequest[]> => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (filter) {
        params.append("filter", filter);
      }
      const response = await apiClient.get(
        `/rescueteam/tasks?${params.toString()}`,
      );

      return response as unknown as RescueRequest[];
    } catch (error) {
      console.error("Lỗi getRequests:", error);
      throw error;
    }
  },
};
