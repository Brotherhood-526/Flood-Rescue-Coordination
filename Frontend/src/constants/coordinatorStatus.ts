export const COORDINATOR_STATUS = {
  NEW: "yêu cầu mới",
  PROCESSING: "đang xử lý",
  DELAYED: "tạm hoãn",
  COMPLETED: "hoàn thành",
  CANCEL: "đã hủy",
} as const;

export type CoordinatorRequestStatus =
  | "yêu cầu mới"
  | "đang xử lý"
  | "tạm hoãn"
  | "hoàn thành"
  | "đã hủy";
