import type { UpdateRequest } from "@/pages/Coordinator/RequestDetailPage";
import apiClient from "@/services/axiosClient";
import { useState } from "react";

export function useRequestUpdate() {
    const [loading, setLoading] = useState(false);

    const updateRequest = async (info:UpdateRequest) => {
        try {
            setLoading(true);

            const res = await apiClient.post("/coordinator/update", info);

            return res as unknown as boolean;
        } catch (error) {
            console.error("Update request failed:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateRequest, loading };
}