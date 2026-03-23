import apiClient from "@/services/axiosClient";
import type { PaginatedResponse } from "@/types/apiRescue";
import type {
  CreateStaffRequest,
  CreateVehicleRequest,
  ManagerStaff,
  ManagerTeam,
  ManagerDashboard,
  ManagerVehicle,
  UpdateVehicleRequest,
  UpdateStaffRequest,
} from "@/types/manager";

export const managerService = {
  // GET /manager/dashboard
  getDashboard: async (): Promise<ManagerDashboard> => {
    const res = await apiClient.get("/manager/dashboard");
    return res as unknown as ManagerDashboard;
  },

  // GET /manager/rescueteam/
  getRescueTeams: async (params?: {
    search?: string;
    page?: number;
  }): Promise<PaginatedResponse<ManagerTeam>> => {
    const query: Record<string, unknown> = {};
    if (params?.search !== undefined) query.search = params.search;
    if (params?.page !== undefined) query.page = params.page;

    const res = await apiClient.get("/manager/rescueteam/", {
      params: query,
    });

    return res as unknown as PaginatedResponse<ManagerTeam>;
  },

  // GET /manager/staff
  getStaff: async (params?: {
    search?: string;
    page?: number;
  }): Promise<PaginatedResponse<ManagerStaff>> => {
    const res = await apiClient.get("/manager/staff", {
      params: {
        search: params?.search,
        page: params?.page ?? 0,
      },
    });

    return res as unknown as PaginatedResponse<ManagerStaff>;
  },

  // POST /manager/staff
  createStaff: async (payload: CreateStaffRequest): Promise<unknown> => {
    return apiClient.post("/manager/staff", payload);
  },

  // PATCH /manager/staff/{id}
  updateStaff: async (
    id: string,
    payload: UpdateStaffRequest,
  ): Promise<void> => {
    await apiClient.patch(`/manager/staff/${id}`, payload);
  },

  // DELETE /manager/staff/{id}
  deleteStaff: async (id: string, params?: { search?: string }): Promise<void> => {
    const query: Record<string, unknown> = {};
    if (params?.search !== undefined) query.search = params.search;

    const config =
      Object.keys(query).length > 0
        ? {
            params: query,
          }
        : undefined;

    await apiClient.delete(`/manager/staff/${id}`, config);
  },

  // GET /manager/vehicles
  getVehicles: async (params?: {
    search?: string;
    page?: number;
  }): Promise<PaginatedResponse<ManagerVehicle>> => {
    const query: Record<string, unknown> = {};
    if (params?.search !== undefined) query.search = params.search;
    if (params?.page !== undefined) query.page = params.page;

    const res = await apiClient.get("/manager/vehicles", {
      params: query,
    });

    return res as unknown as PaginatedResponse<ManagerVehicle>;
  },

  // DELETE /manager/vehicles/{id}
  deleteVehicle: async (id: string): Promise<void> => {
    await apiClient.delete(`/manager/vehicles/${id}`);
  },

  // PATCH /manager/vehicles/{id}
  updateVehicle: async (
    id: string,
    payload: UpdateVehicleRequest,
  ): Promise<void> => {
    await apiClient.patch(`/manager/vehicles/${id}`, payload);
  },

  // POST /manager/vehicles
  createVehicle: async (payload: CreateVehicleRequest): Promise<void> => {
    await apiClient.post("/manager/vehicles", payload);
  },
};

