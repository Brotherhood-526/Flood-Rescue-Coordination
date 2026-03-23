import type { CitizenLookupData } from "@/types/request";
import type { FindRequestViewData } from "@/types/request";

export const toFindRequestViewData = (
  payload: CitizenLookupData,
): FindRequestViewData => ({
  assignedTeam: {
    id: null,
    captain: payload.rescueLeaderName ?? null,
    coordinator: payload.coordinatorName ?? null,
    vehicle: payload.vehicleType ?? null,
  },
  victimDetails: {
    phone: payload.citizenPhone,
    fullName: payload.citizenName,
    urgencyLevel: payload.urgency,
    currentStatus: payload.status,
    createdAt: payload.createdAt,
  },
});
