import {useEffect, useState} from "react";
import type {RescueRequest} from "@/pages/Coordinator/ListRequestPage.tsx";
import apiClient from "@/services/axiosClient.ts";

export function useRequestList() {

    const pageSize = 10;

    const [pageNumber, setPageNumber] = useState(0);
    const [requestList, setRequestList] = useState<RescueRequest[]>([]);
    const [loading, setLoading] = useState(false);

    const handlePageChange = (left: boolean) => {
        setPageNumber(prev => {
            if (left) {
                return prev > 0 ? prev - 1 : 0;
            } else {
                if (requestList.length === pageSize) {
                    return prev + 1;
                }
                return prev;
            }
        });
    };

    const fetchRequestList = async () => {
        try {

            setLoading(true);

            const res = await apiClient.post("/coordinator/takeListRequest", {
                pageNumber,
                pageSize
            });
            console.log(res);
            // @ts-ignore
            setRequestList(res);
        } catch (error) {
            console.error("Fetch request list failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequestList();
    }, [pageNumber, pageSize]);

    return {
        pageNumber,
        pageSize,
        requestList,
        handlePageChange,
        loading
    };
}