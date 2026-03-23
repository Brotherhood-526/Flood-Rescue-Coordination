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

export interface RequestDetail {
  id: string;
  type: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  additionalLink: string;
  status: string;
  createdAt: string;
  urgency: string | null;
  rescueTeamId: string | null;
  rescueTeamName: string | null;
  vehicleId: string | null;
  vehicleType: string | null;
}

export interface TakePageResponse {
  totalPage: number;
  list: CoordinatorRequest[];
}

export interface VehicleAndRescueTeamInfo {
  id: string;
  type: string;
  rescueTeamId: string;
  rescueTeamName: string;
}

export interface NearbyTeamOption {
  id: string;
  teamName: string;
}
