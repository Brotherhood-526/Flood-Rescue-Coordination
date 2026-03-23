export const formatDateVN = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Dùng để sort — chỉ cần getTime() là đủ
export const toTimestamp = (dateStr: string): number => {
  if (!dateStr) return 0;
  return new Date(dateStr).getTime();
};
