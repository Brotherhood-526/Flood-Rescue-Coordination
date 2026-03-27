import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { findRequestService } from "@/services/User/findRequestService";
import { toFindRequestViewData } from "@/utils/mappers/userMapper";
import { getAxiosErrorMessage } from "@/utils/errorHandler";
import { ROUTES } from "@/router/routes";
import type { CitizenLookupData } from "@/types/request";
import type { FindRequestApiResponse } from "@/types/request";

export const useFindRequest = () => {
  const navigate = useNavigate();
  const [phoneInput, setPhoneInput] = useState("");
  const [apiResponse, setApiResponse] = useState<FindRequestApiResponse | null>(
    null,
  );
  const [rawApiData, setRawApiData] = useState<CitizenLookupData | null>(null);

  const mutation = useMutation({
    mutationFn: findRequestService.lookupCitizen,
    onSuccess: (response: CitizenLookupData) => {
      setRawApiData(response);
      setApiResponse({
        success: true,
        message: "Tìm thấy thông tin yêu cầu cứu hộ",
        data: toFindRequestViewData(response),
      });
    },
    onError: (error: unknown) => {
      setApiResponse({
        success: false,
        message: getAxiosErrorMessage(
          error,
          "Không tìm thấy thông tin yêu cầu cứu hộ",
        ),
        data: null,
      });
    },
  });

  const handleSearch = () => {
    const phone = phoneInput.trim();
    if (!phone) {
      setApiResponse({
        success: false,
        message: "Vui lòng nhập số điện thoại",
        data: null,
      });
      return;
    }
    mutation.mutate({ citizenPhone: phone });
  };

  const handleViewDetail = () => {
    if (!rawApiData) return;
    navigate(ROUTES.REQUEST, {
      state: {
        isSubmitted: true,
        requestId: rawApiData.requestId,
        status: rawApiData.status,
        urgency: rawApiData.urgency ?? null,
        serverImages:
          rawApiData.images?.map((img) => ({
            id: img.id,
            url: img.imageUrl,
          })) ?? [],
        submittedData: {
          name: rawApiData.citizenName,
          phone: rawApiData.citizenPhone,
          type: rawApiData.type ?? "",
          address: rawApiData.address ?? "",
          locate:
            rawApiData.latitude && rawApiData.longitude
              ? `${rawApiData.latitude}, ${rawApiData.longitude}`
              : "",
          description: rawApiData.description ?? "",
          url: rawApiData.additionalLink ?? "",
        },
      },
    });
  };

  return {
    phoneInput,
    setPhoneInput,
    isLoading: mutation.isPending,
    apiResponse,
    handleSearch,
    handleViewDetail,
  };
};
