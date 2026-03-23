import {useState} from "react";
import type {RejectRequest} from "@/pages/Coordinator/RequestDetailPage.tsx";
import apiClient from "@/services/axiosClient.ts";


export function useRequestReject() {
    const [loading, setLoading] = useState(false);

    const rejectRequest = async (info:RejectRequest) => {
        try {
            setLoading(true);

            const res = await apiClient.post("/coordinator/reject", info);

            return res as unknown as boolean;
        } catch (error) {
            console.error("Reject request failed:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { rejectRequest, loading };
}