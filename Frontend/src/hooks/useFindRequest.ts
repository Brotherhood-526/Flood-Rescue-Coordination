import { useState } from "react";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { findRequestService } from "@/services/findRequestService";
import type { CitizenLookupData } from "@/types/citizen";

type FindRequestViewData = {
  assigned_team: {
    id: string | null;
    captain: string | null;
    coordinator: string | null;
    vehicle: string | null;
  };
  victim_details: {
    phone: string;
    full_name: string;
    urgency_level: string;
    current_status: string;
    created_at: string;
  };
};

type FindRequestApiResponse = {
  success: boolean;
  message: string;
  data: FindRequestViewData | null;
};

const toViewData = (payload: CitizenLookupData): FindRequestViewData => ({
  assigned_team: {
    id: null,
    captain: payload.rescueLeaderName ?? null,
    coordinator: payload.coordinatorName ?? null,
    vehicle: payload.vehicleType ?? null,
  },
  victim_details: {
    phone: payload.citizenPhone,
    full_name: payload.citizenName,
    urgency_level: payload.urgency,
    current_status: payload.status,
    created_at: payload.createdAt,
  },
});

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const backendMessage = error.response?.data?.message;
    if (typeof backendMessage === "string" && backendMessage.trim().length > 0) {
      return backendMessage;
    }
  }
  return "Không tìm thấy thông tin yêu cầu cứu hộ";
};

export const useFindRequest = () => {
  const [phoneInput, setPhoneInput] = useState("");
  const [apiResponse, setApiResponse] = useState<FindRequestApiResponse | null>(null);

  const mutation = useMutation({
    mutationFn: findRequestService.lookupCitizen,
    onSuccess: (response: CitizenLookupData) => {
      setApiResponse({
        success: true,
        message: "Tìm thấy thông tin yêu cầu cứu hộ",
        data: toViewData(response),
      });
    },
    onError: (error: unknown) => {
      setApiResponse({
        success: false,
        message: getErrorMessage(error),
        data: null,
      });
    },
  });

  const handleSearch = () => {
    const normalizedPhone = phoneInput.trim();
    if (!normalizedPhone) {
      setApiResponse({
        success: false,
        message: "Vui lòng nhập số điện thoại",
        data: null,
      });
      return;
    }

    mutation.mutate({ citizenPhone: normalizedPhone });
  };

  return {
    phoneInput,
    setPhoneInput,
    isLoading: mutation.isPending,
    apiResponse,
    handleSearch,
  };
};
