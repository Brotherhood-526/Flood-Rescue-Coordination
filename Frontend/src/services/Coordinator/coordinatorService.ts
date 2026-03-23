import apiClient from "@/services/axiosClient";
import type {
  NearbyTeamOption,
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
      params: { status: status || undefined, page },
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
  ): Promise<NearbyTeamOption[]> => {
    const res = (await apiClient.get(
      `/coordinator/requests/${requestId}/nearby-teams`,
      {
        params: { vehicleType },
      },
    )) as unknown as Array<{ id: string; teamName: string }>;

    return (res ?? []).map((item) => ({
      id: item.id,
      teamName: item.teamName,
    }));
  },

  acceptRequest: async (
    requestId: string,
    dto: { urgency: string; rescueTeamId: string },
  ) => {
    return await apiClient.put(
      `/coordinator/requests/${requestId}/accept`,
      dto,
    );
  },
};
