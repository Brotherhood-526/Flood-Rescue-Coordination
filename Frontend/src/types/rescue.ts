export interface RescueRequest {
  id: string;
  userId?: string | null;
  citizenPhone?: string;
  citizenName?: string;
  status: string;
  createdAt: string;
  urgency?: string;
  address?: string;
  geoLocation?: string;
  description?: string;
  additionalLink?: string;
  images?: string[];
  vehicleType?: string;
  coordinatorName?: string;
}

export interface RescueTeamInfo {
  teamId: string;
  memberCount: number;
}
