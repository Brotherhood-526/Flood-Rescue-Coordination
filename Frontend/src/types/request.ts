import type { RescueImage } from "@/types/apiRescue";
// ── Lookup / Search ───────────────────────────────
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

// ── Find request view ─────────────────────────────
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

// ── Submit / Update ───────────────────────────────
export interface RescueResponse {
  requestId: string;
  status: string;
}

// ── Chat ──────────────────────────────────────────
export interface ChatMessage {
  id: string | number;
  role: string;
  name: string;
  time: string;
  text: string;
  colorClass: string;
  bgClass: string;
}
