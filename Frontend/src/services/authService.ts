import apiClient from "@/services/axiosClient";
import type { Staff, LoginPayload } from "@/types/auth";

// ── Parsers ───────────────────────────────────────────────────────────────────

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const parseNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  return value.trim().toLowerCase() === "null" ? null : value;
};

const parseNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized || normalized === "null") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const pick = (source: Record<string, unknown>, keys: string[]): unknown => {
  for (const key of keys) {
    if (key in source) return source[key];
  }
  return undefined;
};

const parseStaff = (value: unknown): Staff | null => {
  const candidate = asRecord(value);
  if (!candidate) return null;

  const accountId = pick(candidate, ["accountId", "account_id", "id"]);
  const name = pick(candidate, ["name"]);
  const phone = pick(candidate, ["phone"]);
  const role = pick(candidate, ["role"]);

  if (
    typeof accountId !== "string" ||
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof role !== "string"
  )
    return null;

  return {
    accountId,
    name,
    phone,
    role,
    teamName: parseNullableString(pick(candidate, ["teamName", "team_name"])),
    teamSize: parseNullableNumber(pick(candidate, ["teamSize", "team_size"])),
    latitude: parseNullableNumber(pick(candidate, ["latitude", "lat"])),
    longitude: parseNullableNumber(pick(candidate, ["longitude", "lng"])),
  };
};

export const parseStaffFromResponse = (payload: unknown): Staff | null => {
  const candidate = asRecord(payload);
  if (!candidate) return null;

  return (
    parseStaff(candidate) ??
    parseStaff(asRecord(candidate.data)) ??
    parseStaff(asRecord(asRecord(candidate.data)?.data)) ??
    null
  );
};

// ── API calls ─────────────────────────────────────────────────────────────────

export const authService = {
  login: (payload: LoginPayload) => apiClient.post("/auth/login", payload),

  logout: () => apiClient.post("/auth/logout"),
};
