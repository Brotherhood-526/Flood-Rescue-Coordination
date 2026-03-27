import apiClient from "@/services/axiosClient";
import type { RescueResponse } from "@/types/request";
import type { RequestSchemaType } from "@/validations/user.request.schema";

// Tách chuỗi "lat, lng" thành object { lat, lng }
function parseLocate(locate: string): { lat: string; lng: string } | null {
  const [lat, lng] = locate.split(",").map((s) => s.trim());
  if (!lat || !lng) return null;
  return { lat, lng };
}

// Build FormData cho lần đầu gửi yêu cầu lần đầu
export function buildSubmitFormData(data: RequestSchemaType): FormData {
  const formData = new FormData();
  formData.append("type", data.type);
  formData.append("address", data.address);
  formData.append("description", data.description);
  formData.append("name", data.name);
  formData.append("phone", data.phone);

  if (data.locate) {
    const coords = parseLocate(data.locate);
    if (coords) {
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
    }
  }

  if (data.url) formData.append("additionalLink", data.url);
  data.image?.forEach((file) => formData.append("images", file));

  return formData;
}

// Build FormData cho lần Update yêu cầu đã gửi
export function buildUpdateFormData(
  requestId: string,
  data: RequestSchemaType,
  deleteImageIds?: string[],
): FormData {
  const formData = new FormData();
  formData.append("requestId", requestId);
  formData.append("Type", data.type);
  formData.append("address", data.address);
  formData.append("description", data.description);
  formData.append("citizenName", data.name);
  formData.append("citizenPhone", data.phone);

  if (data.locate) {
    const coords = parseLocate(data.locate);
    if (coords) {
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
    }
  }

  if (data.url) formData.append("additionLink", data.url);
  data.image?.forEach((file) => formData.append("images", file));
  deleteImageIds?.forEach((id) => formData.append("deleteImageIds", id));
  return formData;
}

export const requestService = {
  submit: async (data: FormData): Promise<RescueResponse> => {
    return (await apiClient.post("/citizen/sendRequest", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })) as RescueResponse;
  },

  update: async (data: FormData): Promise<void> => {
    await apiClient.put("/citizen/edit", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  lookup: async (phone: string) => {
    return await apiClient.post("/citizen/lookup", { citizenPhone: phone });
  },
};
