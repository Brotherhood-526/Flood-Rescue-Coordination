import { isAxiosError } from "axios";

export const getAxiosErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (isAxiosError(error)) {
    const msg = error.response?.data?.message;
    if (typeof msg === "string" && msg.trim().length > 0) return msg;
  }
  return fallback;
};
