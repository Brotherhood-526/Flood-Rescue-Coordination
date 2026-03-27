import type { RescueImage } from "@/types/apiRescue";

export interface LookupCitizenRequestBody {
  citizenPhone: string;
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

//  Find request view
export interface AssignedTeam {
  id: string | null;
  captain: string | null;
  coordinator: string | null;
  vehicle: string | null;
}

export interface VictimDetails {
  phone: string;
  fullName: string;
  urgencyLevel: string;
  currentStatus: string;
  createdAt: string;
}

export interface FindRequestViewData {
  assignedTeam: AssignedTeam;
  victimDetails: VictimDetails;
}

export interface FindRequestApiResponse {
  success: boolean;
  message: string;
  data: FindRequestViewData | null;
}

// Submit / Update
export interface RescueResponse {
  requestId: string;
  status: string;
}

export interface ChatMessage {
  id: string | number;
  role: string;
  name: string;
  time: string;
  text: string;
  colorClass: string;
  bgClass: string;
}
// Route State (khi navigate sang trang request)
export interface RequestRouteState {
  isSubmitted?: boolean;
  requestId?: string;
  status?: string;
  urgency?: string;
  imageUrls?: string[];
  submittedData?: {
    name: string;
    phone: string;
    type: string;
    address: string;
    locate: string;
    description: string;
    url: string;
  };
}

export interface CitizenRescueResponse {
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
