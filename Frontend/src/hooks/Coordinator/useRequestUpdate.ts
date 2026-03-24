import { useState } from "react";
import { coordinatorService } from "@/services/Coordinator/coordinatorService";
import { getAxiosErrorMessage } from "@/utils/errorHandler";
import type { RequestDetail } from "@/types/coordinator";

type UpdatePayload = {
  requestId: string;
  urgency: string;
  rescueTeamID: string;
  vehicleType: string;
};

export const useRequestUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRequest = async ({
    requestId,
    urgency,
    rescueTeamID,
    vehicleType,
  }: UpdatePayload): Promise<RequestDetail | null> => {
    try {
      setLoading(true);
      setError(null);
      return await coordinatorService.acceptRequest(requestId, {
        status: "đang xử lý",
        urgency,
        rescueTeamID,
        vehicleType,
      });
    } catch (err) {
      setError(getAxiosErrorMessage(err, "Cập nhật yêu cầu thất bại."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (requestId: string): Promise<RequestDetail | null> => {
    try {
      setLoading(true);
      setError(null);
      return await coordinatorService.acceptRequest(requestId, {
        status: "đã huỷ",
      });
    } catch (err) {
      setError(getAxiosErrorMessage(err, "Huỷ yêu cầu thất bại."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateRequest,
    cancelRequest,
  };
};
