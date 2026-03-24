import axiosClient from "@/services/axiosClient";
import type {
  CitizenLookupData,
  LookupCitizenRequestBody,
} from "@/types/request";

export const findRequestService = {
  lookupCitizen: async (
    payload: LookupCitizenRequestBody,
  ): Promise<CitizenLookupData> => {
    const res = (await axiosClient.post(
      "/citizen/lookup",
      payload,
    )) as CitizenLookupData;
    return res;
  },
};
