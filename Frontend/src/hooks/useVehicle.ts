import {useEffect, useState} from "react";
import apiClient from "@/services/axiosClient.ts";

type VehicleAndRescueTeamInfo = {
    id: string;
    type: string;
    rescueTeamId: string;
    rescueTeamName: string;
}

export function useVehicleList({ type }: { type: string | null}) {

    const [rescueTeams, setRescueTeams] = useState<VehicleAndRescueTeamInfo[]>([]);

    useEffect(() => {

        const fetchVehicle = async () => {
            try {

                const res = await apiClient.post("/coordinator/filterVehicle", {
                    vehicle_type: type
                });

                const data = res as unknown as VehicleAndRescueTeamInfo[];
                setRescueTeams(data);

            } catch (error) {
                console.error("Fetch vehicle failed:", error);
            }
        };

        if (type) {
            fetchVehicle();
        }

    }, [type]);

    return rescueTeams;
}