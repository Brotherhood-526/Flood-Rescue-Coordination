export const getRequestTypeLabel = (type?: string): string => {
  switch (type) {
    case "goods":
      return "cung cấp nhu yếu phẩm";
    case "rescue":
      return "cứu hộ";
    default:
      return "khác";
  }
};
