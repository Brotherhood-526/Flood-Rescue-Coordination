import apiClient from "@/services/axiosClient";
import type { RescueResponse } from "@/types/request";

export const requestService = {
  submit: async (data: FormData): Promise<RescueResponse> => {
    const res = (await apiClient.post("/citizen/sendRequest", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })) as RescueResponse;
    return res;
  },

  update: async (id: string | number, data: FormData): Promise<void> => {
    data.append("requestId", String(id));
    await apiClient.put("/citizen/edit", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  lookup: async (phone: string) => {
    const res = await apiClient.post("/citizen/lookup", {
      citizenPhone: phone,
    });
    return res;
  },
};
