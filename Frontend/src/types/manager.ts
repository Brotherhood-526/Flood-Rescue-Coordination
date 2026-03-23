export type ManagerStaffRole = "điều phối viên" | "cứu hộ" | "quản lý" | string;

export type ManagerStaffState = "hoạt động" | string;

export interface ManagerTeam {
  id: string;
  leaderName: string;
  teamSize: number;
  phone: string;
  staffState: ManagerStaffState;
  totalTasks: number;
}

// --- Vehicles (GET /manager/vehicles) ---
export interface ManagerVehicle {
  id: string;
  type: string;
  team_owner: string;
  state: string;
}

// --- Vehicles (POST /manager/vehicles) ---
export interface CreateVehicleRequest {
  type: string;
  rescueTeamId: string;
  rescue_team_id?: string;
  state: string;
}

export interface UpdateVehicleRequest {
  id?: string;
  // Some BE implementations validate different id field names.
  vehicleId?: string;
  vehicle_id?: string;

  type: string;
  // BE update schema: rescueTeamId
  rescueTeamId?: string;
  rescue_team_id?: string;

  // Backward/alternative field name (older UI used leaderName/team owner string)
  team_owner?: string;

  state: string;
}

export interface ManagerDashboardTopTeam {
  leaderName: string;
  completedCount: number;
}

export interface ManagerDashboardTopCity {
  city: string;
  requestCount: number;
}

export interface ManagerDashboard {
  totalRequests: number;
  completionRate: number; // BE trả về dạng phần trăm (vd: 27.6)
  activeStaff: number;
  totalStaff: number;
  availableVehicle: number;
  totalVehicle: number;
  topTeams: ManagerDashboardTopTeam[];
  topCities: ManagerDashboardTopCity[];
}

// --- Staff payloads (match OpenAPI CreateStaffRequest / UpdateStaffRequest) ---
export interface CreateStaffRequest {
  name: string;
  phone: string;
  password: string;
  role: ManagerStaffRole;
  teamName?: string;
  teamSize?: number;
  latitude?: number;
  longitude?: number;
}

export interface UpdateStaffRequest {
  name: string;
  phone: string;
  password?: string;
  role: ManagerStaffRole;
  state?: ManagerStaffState;
  teamName?: string;
  teamSize?: number;
  latitude?: number;
  longitude?: number;
}

// --- Staff response shape (best-effort; BE might use slightly different field names) ---
export interface ManagerStaff {
  // Some APIs may return UUID as `accountId` or `id`. Keep both optional.
  accountId?: string;
  id?: string;

  name?: string;
  phone: string;
  role: ManagerStaffRole;

  // BE trả về field `state` cho /manager/staff (ví dụ: "hoạt động").
  state?: ManagerStaffState;

  // Một số nơi/cách gọi có thể trả về `staffState` (giữ để tương thích).
  staffState?: ManagerStaffState;

  teamName?: string;
  teamSize?: number;
  latitude?: number;
  longitude?: number;
}

