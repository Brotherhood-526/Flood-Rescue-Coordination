const normalizeText = (value?: string | null) =>
  (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

export type RoleKey = "quản lý" | "điều phối viên" | "cứu hộ" | "";

export const normalizeRoleKey = (value?: string | null): RoleKey => {
  const normalized = normalizeText(value);

  if (!normalized) return "";

  if (normalized.includes("quan ly") || normalized.includes("manager")) {
    return "quản lý";
  }

  if (
    normalized.includes("dieu phoi") ||
    normalized.includes("coordinator") ||
    normalized.includes("coordinate")
  ) {
    return "điều phối viên";
  }

  if (normalized.includes("cuu ho") || normalized.includes("rescue")) {
    return "cứu hộ";
  }

  return "";
};

export const hasAllowedRole = (
  staffRole: string | null | undefined,
  allowedRoles: string[],
) => {
  const currentRole = normalizeRoleKey(staffRole);
  if (!currentRole) return false;
  return allowedRoles.some((role) => normalizeRoleKey(role) === currentRole);
};
