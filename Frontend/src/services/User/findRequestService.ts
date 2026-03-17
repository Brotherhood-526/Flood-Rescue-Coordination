// Frontend/src/services/findRequestService.ts
import axiosClient from "../axiosClient";
import type {
  CitizenLookupData,
  LookupCitizenRequestBody,
} from "../../types/citizen";

export const findRequestService = {
  lookupCitizen: async (payload: LookupCitizenRequestBody) => {
    const res = await axiosClient.post<CitizenLookupData>(
      "/citizen/lookup",
      payload,
    );
    return res as unknown as CitizenLookupData;
  },
};
