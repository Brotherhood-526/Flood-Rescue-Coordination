import { useEffect, useState } from "react";
import { coordinatorService } from "@/services/Coordinator/coordinatorService";
import type { VehicleAndRescueTeamInfo } from "@/types/coordinator";

export const useVehicleList = (
  requestId: string | undefined,
  vehicleType: string | null,
) => {
  const [vehicleList, setVehicleList] = useState<VehicleAndRescueTeamInfo[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!requestId || !vehicleType) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await coordinatorService.getNearbyTeams(
          requestId,
          vehicleType,
        );
        setVehicleList(data);
      } catch (err) {
        console.error("Fetch nearby teams failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [requestId, vehicleType]);

  return { vehicleList, loading };
};
