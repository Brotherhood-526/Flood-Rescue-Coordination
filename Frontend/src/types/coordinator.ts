export type CoordinatorRequestStatus =
  | "yêu cầu mới"
  | "đang xử lý"
  | "tạm hoãn"
  | "hoàn thành"
  | "đã hủy";

export interface CoordinatorRequest {
  id: string;
  citizenName: string;
  phone: string;
  status: CoordinatorRequestStatus;
  createdAt: string;
}

export interface RequestImage {
  id: string;
  imageUrl: string;
}
export interface RequestDetail {
  id: string;
  type: string;
  status: string;
  urgency: string | null;
  citizenName: string;
  phone: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  additionalLink: string | null;
  images: { id: string; imageUrl: string }[];
  vehicleType: string | null;
  rescueTeamName: string | null;
  rescueTeamLatitude: number | null;
  rescueTeamLongitude: number | null;
}

export interface TakePageResponse {
  totalPage: number;
  list: CoordinatorRequest[];
}

export interface VehicleAndRescueTeamInfo {
  id: string;
  teamName: string;
}
