const normalizeText = (value?: string | null) =>
  (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

export type RoleKey = "quản lý" | "điều phối viên" | "cứu hộ" | "";

const MANAGER_ALIASES = new Set(["quan ly", "manager", "rescue manager"]);
const COORDINATOR_ALIASES = new Set([
  "dieu phoi",
  "dieu phoi vien",
  "coordinator",
  "coordinate",
  "rescue coordinator",
]);
const RESCUE_ALIASES = new Set(["cuu ho", "rescue", "rescue team", "doi cuu ho"]);

export const normalizeRoleKey = (value?: string | null): RoleKey => {
  const normalized = normalizeText(value);

  if (!normalized) return "";

  if (MANAGER_ALIASES.has(normalized)) {
    return "quản lý";
  }

  if (COORDINATOR_ALIASES.has(normalized)) {
    return "điều phối viên";
  }

  if (RESCUE_ALIASES.has(normalized)) {
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
