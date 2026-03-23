import {useEffect, useState} from "react";
import type {RescueRequest} from "@/pages/Coordinator/ListRequestPage.tsx";
import apiClient from "@/services/axiosClient.ts";

type TakePageResponse = {
    totalPage: number;
    list: RescueRequest[];
};

export function useRequestList(status:string) {

    // const pageSize = 10;

    const [pageNumber, setPageNumber] = useState(0);
    const [requestList, setRequestList] = useState<RescueRequest[]>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const handlePageChange = (left: boolean) => {
        setPageNumber(prev => {
            if (left) {
                return prev > 0 ? prev - 1 : 0;
            } else {
                if (prev < totalPage - 1) {
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
                status
            });
            console.log(res);
            const data = res as unknown as TakePageResponse;
            setRequestList(data.list);
            setTotalPage(data.totalPage);
        } catch (error) {
            console.error("Fetch request list failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPageNumber(0);
    }, [status]);

    useEffect(() => {
        fetchRequestList();
    }, [pageNumber, status]);

    return {
        pageNumber,
        // pageSize,
        totalPage,
        requestList,
        handlePageChange,
        loading
    };
}
