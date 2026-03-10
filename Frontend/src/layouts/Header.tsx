import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, CircleUserRound, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { useAuth } from "@/hooks/useAuth";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Header({ role }: { role: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  switch (role) {
    case 1:
      return (
        <UserHeader
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          toggleMobile={toggleMobile}
        />
      );
    case 2:
      return <RescueHeader noty={false} />;
    // case 3:
    //   return <ManagerHeader noty={false} />;
    case 4:
      return <CoordinatorHeader noty={false} />;
    default:
      return null;
  }
}

/* RESCUE HEADER  */
export function RescueHeader({ noty }: { noty: boolean }) {
  const { staff, logout } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const displayTeamName = staff?.teamName ?? "Chưa có tên đội";
  const displayMemberCount = staff?.teamSize ?? "null";
  const displayUserName = staff?.name ?? "null";

  return (
    <>
      <header className="flex items-center justify-between w-full px-6 py-6 bg-[#141e2e] font-sans">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Bảng quản lý cứu hộ
          </h1>
          <div className="flex items-center text-[#9ca3af] text-sm">
            <span>Đội cứu hộ #{displayTeamName}</span>
            <span className="mx-3 text-[#6b7280]">|</span>
            <span>{displayMemberCount} thành viên</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsLogoutOpen(true)}
            className="relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-black transition-colors bg-[#e5e7eb] rounded hover:bg-[#d1d5db] cursor-pointer"
          >
            <span>Đăng xuất</span>
          </button>
          <button className="relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-black transition-colors bg-[#e5e7eb] rounded hover:bg-[#d1d5db] cursor-pointer">
            <Bell size={18} className="fill-black" />
            <span>Thông báo</span>

            {noty && (
              <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-red-500"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 border border-[#141e2e]"></span>
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
              <User size={18} className="text-black fill-black" />
            </div>
            <span className="text-sm font-medium text-white">
              {displayUserName}
            </span>
          </div>
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
/* COORD HEADER */

export function CoordinatorHeader({ noty }: { noty: boolean }) {
  const logout =
    "!text-gray-200 !hover:text-gray-200 font-bold ml-[0.5vw] cursor-pointer";

  return (
    <header className="bg-slate-950 shadow-md text-gray-200">
      <div className="hidden md:flex flex-row items-center justify-between px-[2vw] py-[2vh] w-full fixed top-0 left-0 bg-slate-950 shadow z-50">
        <div>
          <p className="text-[3vh] font-bold">Bảng quản lý điều phối cứu hộ</p>
          <p>Điều phối viên tiếp nhận và phân công nhiệm vụ cứu hộ</p>
        </div>

        <div className="flex gap-4 items-center">
          <Button className="bg-gray-200! text-black! relative">
            <Bell className="h-6! w-6!" fill="currentColor" strokeWidth={2.5} />
            Thông báo
            {noty && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full"></div>
            )}
          </Button>

          <div className="flex gap-1 items-center">
            <CircleUserRound size={30} />
            <span className={logout}>Đăng Xuất</span>
          </div>
        </div>
      </div>
    </header>
  );
}

/*  USER HEADER  */

export function UserHeader({
  mobileOpen,
  setMobileOpen,
  toggleMobile,
}: {
  mobileOpen: boolean;
  setMobileOpen: (e: boolean) => void;
  toggleMobile: () => void;
}) {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const base = "px-5 py-2 font-medium transition";
    const active = "text-blue-600 font-bold underline";
    const inactive = "text-gray-700 hover:text-blue-600";
    return location.pathname === path
      ? `${base} ${active}`
      : `${base} ${inactive}`;
  };

  const getMobileLinkClass = (path: string) => {
    const base = "block px-3 py-2 rounded-md font-medium transition";
    const active = "text-blue-600 bg-blue-50 font-bold underline";
    const inactive = "text-gray-700 hover:text-blue-600 hover:bg-gray-50";
    return location.pathname === path
      ? `${base} ${active}`
      : `${base} ${inactive}`;
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

          {/* Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={getLinkClass("/")}>
                    Trang chủ
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/map" className={getLinkClass("/map")}>
                    Bản đồ
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/search" className={getLinkClass("/search")}>
                    Tra cứu
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/contact" className={getLinkClass("/contact")}>
                    Liên hệ
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/guide" className={getLinkClass("/guide")}>
                    Hướng dẫn sử dụng
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="hidden md:block">
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                Đăng nhập
              </Button>
            </Link>
          </div>

          <button
            onClick={toggleMobile}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile */}
        {mobileOpen && (
          <nav className="md:hidden pb-4">
            <div className="space-y-2">
              <Link
                to="/"
                className={getMobileLinkClass("/")}
                onClick={() => setMobileOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/map"
                className={getMobileLinkClass("/map")}
                onClick={() => setMobileOpen(false)}
              >
                Bản đồ
              </Link>
              <Link
                to="/search"
                className={getMobileLinkClass("/search")}
                onClick={() => setMobileOpen(false)}
              >
                Tra cứu
              </Link>
              <Link
                to="/contact"
                className={getMobileLinkClass("/contact")}
                onClick={() => setMobileOpen(false)}
              >
                Liên hệ
              </Link>
              <Link
                to="/guide"
                className={getMobileLinkClass("/guide")}
                onClick={() => setMobileOpen(false)}
              >
                Hướng dẫn sử dụng
              </Link>

              <div className="px-3 py-2 pt-4 border-t">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

// /*  MANAGER HEADER */

export function ManagerHeader({ noty }: { noty: boolean }) {
  return (
    <header className="bg-slate-950 shadow-md text-gray-200">
      <div className="hidden md:flex flex-row items-center justify-between px-[2vw] py-[2vh] w-full fixed top-0 left-0 bg-slate-950 shadow z-50">
        <div>
          <p className="text-[3vh] font-bold">Bảng quản lý</p>
          <p>Quản trị viên theo dõi và vận hành hệ thống</p>
        </div>

        <Button className="bg-gray-200! text-black! relative">
          <Bell className="h-6! w-6!" fill="currentColor" strokeWidth={2.5} />
          Thông báo
          {noty && (
            <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full"></div>
          )}
        </Button>
      </div>
    </header>
  );
}
