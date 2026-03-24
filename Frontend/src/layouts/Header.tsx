import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  BarChart3,
  Users,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/Auth/useAuth";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAuthStore } from "@/store/authStore";

// Shared style constants─
const HEADER_BG = "bg-[#0f172a]";
const HEADER_BASE = `flex items-center justify-between w-full px-8 py-5 ${HEADER_BG}`;
const TITLE_STYLE = "text-xl font-bold text-white";
const SUB_STYLE = "text-sm text-slate-400 mt-0.5";
const LOGOUT_BTN =
  "bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer";

export default function Header({ role }: { role: number }) {
  const location = useLocation();
  const path = location.pathname;

  if (path.startsWith("/manager")) return <ManagerHeader />;
  if (path.startsWith("/coordinate")) return <CoordinatorHeader />;
  if (path.startsWith("/rescue")) return <RescueHeader />;

  switch (role) {
    case 1:
      return <UserHeader />;
    case 2:
      return <RescueHeader />;
    case 3:
      return <ManagerHeader />;
    case 4:
      return <CoordinatorHeader />;
    default:
      return <UserHeader />;
  }
}

//User Header
export function UserHeader() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const base = "px-5 py-2 font-medium transition";
    return location.pathname === path
      ? `${base} text-blue-600 font-bold underline`
      : `${base} text-gray-700 hover:text-blue-600`;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="w-full fixed top-0 left-0 bg-white shadow z-50">
        <div className="flex justify-between items-center h-20 px-8 py-4">
          <Link to="/">
            <img
              src="/Logo.png"
              alt="Flood Rescue Logo"
              className="h-12 w-auto cursor-pointer"
            />
          </Link>
          <nav className="flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {[
                  { to: "/", label: "Trang chủ" },
                  { to: "/map", label: "Bản đồ" },
                  { to: "/search", label: "Tra cứu" },
                  { to: "/contact", label: "Liên hệ" },
                  { to: "/guide", label: "Hướng dẫn sử dụng" },
                ].map(({ to, label }) => (
                  <NavigationMenuItem key={to}>
                    <Link to={to} className={getLinkClass(to)}>
                      {label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
          <Link to="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

// Rescue Header
export function RescueHeader() {
  const { staff, logout } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <header
        className={`${HEADER_BASE} fixed top-0 left-0 w-full z-50 shadow-md`}
      >
        <div>
          <p className={TITLE_STYLE}>Bảng quản lý cứu hộ</p>
          <p className={SUB_STYLE}>
            Đội cứu hộ #{staff?.teamName ?? "Chưa có tên đội"}
            <span className="mx-2 text-slate-600">|</span>
            {staff?.teamSize ?? "—"} thành viên
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-slate-700 rounded-full">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-white">
              {staff?.name ?? "—"}
            </span>
          </div>
          <button onClick={() => setIsLogoutOpen(true)} className={LOGOUT_BTN}>
            Đăng xuất
          </button>
        </div>
      </header>
      <ConfirmDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={logout}
      />
    </>
  );
}

// Coordinator Header
export function CoordinatorHeader() {
  const { logout } = useAuth();
  const staff = useAuthStore((state) => state.staff);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <header
        className={`${HEADER_BASE} fixed top-0 left-0 w-full z-50 shadow-md`}
      >
        <div>
          <p className={TITLE_STYLE}>Bảng quản lý điều phối cứu hộ</p>
          <p className={SUB_STYLE}>
            Điều phối viên tiếp nhận và phân công nhiệm vụ cứu hộ
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CircleUserRound size={22} className="text-slate-300" />
            <span className="text-sm font-medium text-white">
              {staff?.name ?? "—"}
            </span>
          </div>
          <button onClick={() => setIsLogoutOpen(true)} className={LOGOUT_BTN}>
            Đăng xuất
          </button>
        </div>
      </header>
      <ConfirmDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={logout}
      />
    </>
  );
}

//Manager Header
export function ManagerHeader() {
  const { staff, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const tabs = [
    { key: "overview", label: "Tổng quan", icon: BarChart3, route: "/manager" },
    {
      key: "employee",
      label: "Quản lý nhân viên",
      icon: Users,
      route: "/manager/employee",
    },
    {
      key: "team",
      label: "Quản lý đội cứu hộ",
      icon: ShieldCheck,
      route: "/manager/team",
    },
    {
      key: "vehicle",
      label: "Quản lý phương tiện",
      icon: Truck,
      route: "/manager/vehicle",
    },
  ] as const;

  const activeRoute = tabs.some((t) => t.route === location.pathname)
    ? location.pathname
    : "/manager";

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full shadow-md">
        {/* Top bar */}
        <div className={HEADER_BASE}>
          <div>
            <p className={TITLE_STYLE}>Bảng quản trị hệ thống</p>
            <p className={SUB_STYLE}>Quản lý toàn bộ hoạt động của nhóm</p>
          </div>
          <div className="flex items-center gap-3">
            <CircleUserRound size={22} className="text-slate-300" />
            <span className="text-sm font-medium text-white">
              {staff?.name ?? "Chưa có tên"}
            </span>
            <button
              onClick={() => setIsLogoutOpen(true)}
              className={LOGOUT_BTN}
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex w-full border-b border-gray-200 bg-white">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeRoute === tab.route;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => navigate(tab.route)}
                className={`flex flex-1 items-center justify-center gap-2 border-r border-gray-200 px-4 py-4 text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "border-b-2 border-b-[#0f172a] bg-white text-[#0f172a]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>
      <ConfirmDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={logout}
      />
    </>
  );
}
