export const timeAgo = (createdAt: string): string => {
  // Truyền thẳng chuỗi ISO từ BE vào new Date()
  const created = new Date(createdAt);
  const diffMs = Date.now() - created.getTime();
  const seconds = Math.floor(diffMs / 1000);
  if (seconds <= 0) return "Vừa xong";

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} giây trước`;
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
};
