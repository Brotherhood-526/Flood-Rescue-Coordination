import apiClient from "@/services/axiosClient.ts";
import {useEffect, useState} from "react";
import type {RequestDetail} from "@/pages/Coordinator/RequestDetailPage.tsx";


export function useRequestDetail({id}:{id:string}) {
    const [requestDetail, setRequestDetail] = useState<RequestDetail | null>(null);

    useEffect(() => {
        const fetchRequestDetail = async () => {
            try {
                console.log("id:", id);
                const res = await apiClient.post("/coordinator/takeSpecificRequest", {
                    id: id,
                });

                const detail = res as unknown as RequestDetail;
                setRequestDetail(detail);
            } catch (error) {
                console.error("Fetch request detail failed:", error);
            }
        };

        if (id) {
            fetchRequestDetail();
        }
    }, [id]);


    return requestDetail;
}