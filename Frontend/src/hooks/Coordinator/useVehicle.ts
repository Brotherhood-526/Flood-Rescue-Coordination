import { useEffect, useState } from "react";
import apiClient from "@/services/axiosClient";
import type { VehicleAndRescueTeamInfo } from "@/types/coordinator";

export const useVehicleList = (type: string | null) => {
  const [vehicleList, setVehicleList] = useState<VehicleAndRescueTeamInfo[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = (await apiClient.post("/coordinator/filterVehicle", {
          vehicle_type: type,
        })) as unknown as VehicleAndRescueTeamInfo[];
        setVehicleList(data);
      } catch (err) {
        console.error("Fetch vehicle failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [type]);

  return { vehicleList, loading };
};
