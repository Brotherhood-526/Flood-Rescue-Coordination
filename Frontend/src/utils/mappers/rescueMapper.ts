import type { RawRescueTask } from "@/types/apiRescue";
import type { RescueRequest } from "@/types/rescue";

export const mapRescueTask = (raw: RawRescueTask): RescueRequest => ({
  id: raw.requestId ?? raw.id ?? "",
  userId: raw.citizenId ?? null,
  citizenPhone: raw.citizenPhone,
  citizenName: raw.citizenName,
  status: raw.status ?? "",
  createdAt: raw.createdAt ?? "",
  urgency: raw.urgency,
  address: raw.address,
  geoLocation:
    raw.latitude != null && raw.longitude != null
      ? `${raw.latitude},${raw.longitude}`
      : raw.geo_location,
  description: raw.description,
  additionalLink: raw.additionalLink ?? undefined,
  images: raw.images?.map((img) => img.imageUrl) ?? [],
  vehicleType: raw.vehicleType ?? undefined,
  coordinatorName: raw.coordinatorName ?? undefined,
});
