export const ROUTES = {
  LOGIN: "/login",
  REQUEST: "/map",
  SEARCH: "/search",
  MAP: "/map",
  CONTACT: "/contact",
  GUIDE: "/guide",

  // Nhóm Coordinator
  COORDINATE: "/coordinate",
  COORDINATE_DETAIL: "/coordinate/detail/:id",
  COORDINATE_MAP: "/coordinate/map",
  COORDINATE_CHAT: "/testchatbox",
  FULLMAP: "/coordinate/map",

  // Nhóm Rescue
  RESCUE: "/rescue",
  RESCUE_DETAIL: "/rescue/detail",
  RESCUE_CHAT: "/rescue/chat",
  RESCUE_MAP: "/rescue/map",

  // Nhóm Manager
  MANAGER: "/manager",
  MANAGER_EMPLOYEE: "/manager/employee",
  MANAGER_TEAM: "/manager/team",
  MANAGER_VEHICLE: "/manager/vehicle",
} as const;
