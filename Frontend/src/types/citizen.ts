// Frontend/src/types/citizen.ts
export interface LookupCitizenRequestBody {
  citizenPhone: string;
}

export interface RescueImage {
  id: string;
  imageUrl: string;
}

export interface CitizenLookupData {
  requestId: string;
  address: string;
  description: string;
  additionalLink: string | null;
  createdAt: string;
  latitude: number;
  longitude: number;
  status: string;
  type: string;
  urgency: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  images: RescueImage[];
  coordinatorName: string | null;
  rescueLeaderName: string | null;
  vehicleType: string | null;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
