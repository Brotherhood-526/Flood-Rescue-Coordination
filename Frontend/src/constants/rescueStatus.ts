export const RESCUE_STATUS = {
  PROCESSING: "đang xử lý",
  SUSPENDED: "tạm hoãn",
  COMPLETED: "hoàn thành",
} as const;

export type RescueStatus = (typeof RESCUE_STATUS)[keyof typeof RESCUE_STATUS];

export const DEFAULT_VISIBLE_STATUSES: RescueStatus[] = [
  RESCUE_STATUS.PROCESSING,
  RESCUE_STATUS.SUSPENDED,
  RESCUE_STATUS.COMPLETED,
];
