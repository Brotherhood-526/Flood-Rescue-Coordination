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
  getRequests: async (): Promise<RescueRequest[]> => {
    const response = (await apiClient.get("/rescueteam/tasks", {
      params: { page: 0, size: 1000 },
    })) as PaginatedResponse<RawRescueTask> | RawRescueTask[];

    const raw =
      (response as PaginatedResponse<RawRescueTask>).content ??
      (Array.isArray(response) ? response : []);

    return raw.map(mapRescueTask);
  },

  getTaskDetail: async (taskId: string): Promise<RescueRequest> => {
    const response = (await apiClient.get(
      `/rescueteam/tasks/${taskId}`,
    )) as RawRescueTask;

    return mapRescueTask(response);
  },

  updateTaskStatus: async (
    taskId: string,
    newStatus: string,
  ): Promise<void> => {
    await apiClient.patch(`/rescueteam/tasks/${taskId}/status`, {
      status: newStatus,
      report: "",
    });
  },
};
