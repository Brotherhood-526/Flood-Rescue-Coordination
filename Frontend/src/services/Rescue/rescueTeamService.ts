import apiClient from "@/services/axiosClient";

export interface RescueTeamInfo {
  teamId: string;
  memberCount: number;
}

export interface RescueRequest {
  id: string;
  userId?: string | null;
  citizenPhone?: string;
  citizenName?: string;
  status: string;
  createdAt: string;
  urgency?: string;
  address?: string;
  geo_location?: string;
  description?: string;
  additional_link?: string;
  images?: string[];
  vehicleType?: string;
  coordinatorName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTaskDetail(raw: any): RescueRequest {
  return {
    id: raw.requestId ?? raw.id ?? "",
    userId: raw.citizenId ?? null,
    citizenPhone: raw.citizenPhone,
    citizenName: raw.citizenName,
    status: raw.status ?? "",
    createdAt: raw.createdAt ?? "",
    urgency: raw.urgency,
    address: raw.address,
    geo_location:
      raw.latitude != null && raw.longitude != null
        ? `${raw.latitude},${raw.longitude}`
        : raw.geo_location,
    description: raw.description,
    additional_link: raw.images?.[0]?.imageUrl ?? raw.additional_link ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: raw.images?.map((img: any) => img.imageUrl) ?? [],
    vehicleType: raw.vehicleType ?? null,
    coordinatorName: raw.coordinatorName ?? null,
  };
}

export const rescueTeamService = {
  getRequests: async (filter: string = ""): Promise<RescueRequest[]> => {
    try {
      const params = new URLSearchParams();
      params.append("page", "0");
      params.append("size", "1000");
      if (filter) params.append("filter", filter);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await apiClient.get(
        `/rescueteam/tasks?${params.toString()}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawList: any[] =
        response?.content || (Array.isArray(response) ? response : []);

      return rawList.map(mapTaskDetail);
    } catch (error) {
      console.error("Lỗi getRequests:", error);
      throw error;
    }
  },

  getTaskDetail: async (taskId: string): Promise<RescueRequest> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await apiClient.get(`/rescueteam/tasks/${taskId}`);
      return mapTaskDetail(response);
    } catch (error) {
      console.error("Lỗi getTaskDetail:", error);
      throw error;
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateTaskStatus: async (taskId: string, newStatus: string): Promise<any> => {
    try {
      const response = await apiClient.patch(
        `/rescueteam/tasks/${taskId}/status`,
        { status: newStatus, report: "" },
      );
      return response;
    } catch (error) {
      console.error("Lỗi updateTaskStatus:", error);
      throw error;
    }
  },
};
