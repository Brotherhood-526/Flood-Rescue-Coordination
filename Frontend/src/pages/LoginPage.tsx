import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes.tsx";
import { useAuth } from "@/hooks/Auth/useAuth";
import {
  Phone,
  Lock,
  ArrowRight,
  User,
  LifeBuoy,
  ClipboardCheck,
} from "lucide-react";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, staff } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (staff) {
      const role = staff.role?.trim().toLowerCase();
      if (role === "quản lý") {
        navigate(ROUTES.MANAGER, { replace: true });
      } else if (role === "cứu hộ") {
        navigate(ROUTES.RESCUE, { replace: true });
      } else if (role === "điều phối viên") {
        navigate(ROUTES.COORDINATE, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [staff, navigate]);
  const [errorMsg, setErrorMsg] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const staff = await login(phoneNumber, password);
      if (!staff) {
        setErrorMsg("Tài khoản không tồn tại hoặc sai mật khẩu.");
        return;
      }

      const role = staff.role?.trim().toLowerCase();
      let navigateDirect = "/";
      if (role === "quản lý") {
        navigate(ROUTES.MANAGER, { replace: true });
      } else if (role === "cứu hộ") {
        navigate(ROUTES.RESCUE, { replace: true });
      } else if (role === "điều phối viên") {
        navigate(ROUTES.COORDINATE, { replace: true });
      } else {
        navigate("/", { replace: true });
      }

      console.log(navigateDirect);
      navigate(navigateDirect);

    } catch (error) {
      console.error("Login failed:", error);
      setErrorMsg("Tài khoản không tồn tại hoặc sai mật khẩu.");
    }
  };
  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* --- LEFT SIDE --- */}
      <div className="flex flex-col h-full bg-white">
        <div className="flex h-20 px-8 py-4 shrink-0">
          <Link to="/">
            <img
              src="/Logo.png"
              alt="Cứu Hộ Logo"
              className="w-auto h-12 cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center px-6 pb-12">
          <Card className="w-full max-w-120 border-0 shadow-none bg-transparent">
            <CardHeader className="text-center p-0 mb-8">
              <CardTitle className="text-5xl font-extrabold text-slate-900 tracking-tight">
                Đăng nhập
              </CardTitle>
              <p className="text-sm text-gray-500 mt-3 font-medium">
                Dành cho nhân viên & điều phối viên hệ thống
              </p>
            </CardHeader>

            <CardContent className="p-0">
              <form className="space-y-5" onSubmit={handleLogin}>
                {/* Phone Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">
                    <Phone size={18} />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    type="tel"
                    placeholder="Số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setErrorMsg("");
                    }}
                    required
                    className="h-14 bg-gray-50 border-black rounded-xl pl-12 pr-5 text-base text-black font-semibold placeholder:text-gray-400 placeholder:font-normal focus-visible:ring-2 focus-visible:ring-[#25a863] focus-visible:bg-white transition-all"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    required
                    className="h-14 bg-gray-50 border-black rounded-xl pl-12 pr-12 text-base text-black font-semibold placeholder:text-gray-400 placeholder:font-normal focus-visible:ring-2 focus-visible:ring-[#25a863] focus-visible:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-sm font-semibold text-red-500 text-center animate-in fade-in slide-in-from-top-1">
                    {errorMsg}
                  </p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#25a863] hover:bg-[#1a7a4a] text-white text-base font-bold rounded-xl shadow-lg shadow-green-100 transition-all hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
                >
                  Đăng nhập với tư cách nhân viên <ArrowRight size={18} />
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                    Hoặc truy cập nhanh
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/map"
                    className="flex items-center gap-3 px-4 py-4 border-[1.5px] border-gray-100 rounded-xl text-sm font-bold text-gray-600 bg-gray-50/50 hover:border-[#25a863] hover:text-[#1a7a4a] hover:bg-green-50 transition-all group"
                  >
                    <span className="w-8 h-8 bg-white shadow-sm rounded-lg flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                      🗺️
                    </span>
                    Bản đồ cứu hộ
                  </Link>
                  <Link
                    to="/search"
                    className="flex items-center gap-3 px-4 py-4 border-[1.5px] border-gray-100 rounded-xl text-sm font-bold text-gray-600 bg-gray-50/50 hover:border-[#25a863] hover:text-[#1a7a4a] hover:bg-green-50 transition-all group"
                  >
                    <span className="w-8 h-8 bg-white shadow-sm rounded-lg flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                      🔍
                    </span>
                    Tra cứu
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-xs text-gray-400 py-6">
          © 2026 Cứu Hộ – Hệ thống điều phối khẩn cấp
        </p>
      </div>

      {/* ══ RIGHT SIDE ══ */}
      <div className="hidden lg:flex flex-col bg-[#25a863] h-full overflow-hidden relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/[0.07] pointer-events-none" />
        <div className="absolute -bottom-10 -left-16 w-48 h-48 rounded-full bg-white/[0.07] pointer-events-none" />

        <div className="h-20 w-full shrink-0" />

        <div className="flex-1 flex justify-center w-full pt-16 px-12 relative z-10">
          <div className="max-w-xl w-full text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide mb-6">
              <span className="w-2 h-2 rounded-full bg-[#7fffb8] shadow-[0_0_8px_#7fffb8] animate-pulse" />
              HỆ THỐNG ĐANG HOẠT ĐỘNG
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight mb-3 leading-tight">
              Chào mừng trở lại! 👋
            </h1>
            <p className="text-white/75 text-sm mb-10 leading-relaxed">
              Cổng thông tin điều phối cứu hộ dành riêng cho nhân viên vận hành.
              <br />
              Cảm ơn bạn đã tiếp tục cống hiến vì cộng đồng.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5 hover:bg-white/15 hover:translate-x-1 transition-all cursor-default group">
                <span className="mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                  <User className="text-white" size={24} />
                </span>
                <div>
                  <p className="font-bold text-base mb-1 text-white">
                    Tài khoản nhân viên
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Điều phối viên và quản lý được cấp tài khoản riêng để quản
                    lý các yêu cầu khẩn cấp.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5 hover:bg-white/15 hover:translate-x-1 transition-all cursor-default group">
                <span className="mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                  <LifeBuoy className="text-white" size={24} />
                </span>
                <div>
                  <p className="font-bold text-base mb-1 text-white">
                    Người dân cần cứu hộ?
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Vui lòng truy cập trang{" "}
                    <Link
                      to="/map"
                      className="text-[#b5ffd9] font-bold hover:underline"
                    >
                      BẢN ĐỒ
                    </Link>{" "}
                    để gửi yêu cầu khẩn cấp ngay lập tức.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5 hover:bg-white/15 hover:translate-x-1 transition-all cursor-default group">
                <span className="mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                  <ClipboardCheck className="text-white" size={24} />
                </span>
                <div>
                  <p className="font-bold text-base mb-1 text-white">
                    Theo dõi yêu cầu
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Người dân có thể kiểm tra trạng thái xử lý trực tiếp tại mục{" "}
                    <Link
                      to="/search"
                      className="text-[#b5ffd9] font-bold hover:underline"
                    >
                      TRA CỨU
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
