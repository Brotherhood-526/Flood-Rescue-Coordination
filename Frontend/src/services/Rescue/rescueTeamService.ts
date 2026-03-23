import apiClient from "@/services/axiosClient";
import { mapRescueTask } from "@/utils/mappers/rescueMapper";
import type { RescueRequest } from "@/types/rescue";
import type { PaginatedResponse, RawRescueTask } from "@/types/apiRescue";

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
