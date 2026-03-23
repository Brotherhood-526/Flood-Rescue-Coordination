import apiClient from "@/services/axiosClient";
import { PAGE_SIZE } from "@/constants/coordinatorConfig";
import type {
  RequestDetail,
  VehicleAndRescueTeamInfo,
  TakePageResponse,
} from "@/types/coordinator";

export const coordinatorService = {
  getRequests: async (
    status: string,
    page: number,
  ): Promise<TakePageResponse> => {
    const res = (await apiClient.get("/coordinator/requests", {
      params: {
        status: status || undefined,
        page: page,
        size: PAGE_SIZE,
      },
      /* eslint-disable @typescript-eslint/no-explicit-any */
    })) as any;
    return {
      list: res.content ?? [],
      totalPage: res.totalPages ?? 1,
    };
  },

  getRequestDetail: async (requestId: string): Promise<RequestDetail> => {
    return (await apiClient.get(
      `/coordinator/requests/${requestId}`,
    )) as unknown as RequestDetail;
  },

  getNearbyTeams: async (
    requestId: string,
    vehicleType: string,
  ): Promise<VehicleAndRescueTeamInfo[]> => {
    return (await apiClient.get(
      `/coordinator/requests/${requestId}/nearby-teams`,
      {
        params: { vehicleType },
      },
    )) as unknown as VehicleAndRescueTeamInfo[];
  },

  acceptRequest: async (
    requestId: string,
    dto: {
      status: string;
      urgency?: string;
      rescueTeamID?: string;
      vehicleType?: string;
    },
  ): Promise<RequestDetail> => {
    return (await apiClient.put(
      `/coordinator/requests/${requestId}/accept`,
      dto,
    )) as unknown as RequestDetail;
  },
};
