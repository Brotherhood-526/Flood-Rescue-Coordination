import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes.tsx";
import { useAuth } from "@/hooks/useAuth";
import { Phone, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await login(phoneNumber, password);

      // Kiểm tra role: "coordinate" hoặc "rescue coordinator" tùy theo backend của bạn
      if (user?.role === "coordinate" || user?.role === "rescue coordinator") {
        navigate(ROUTES.COORDINATE);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* --- LEFT SIDE --- */}
      <div className="flex flex-col h-full bg-white">
        {/* Logo Header */}
        <div className="flex h-20 px-8 py-4 shrink-0">
          <Link to="/">
            <img
              src="/Logo.png"
              alt="Cứu Hộ Logo"
              className="w-auto h-12 cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 pb-12">
          <Card className="w-full max-w-[480px] border-0 shadow-none bg-transparent">
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
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={18} />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    type="tel"
                    placeholder="Số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="h-14 bg-gray-50 border-gray-200 rounded-xl pl-12 pr-5 text-base text-black font-semibold placeholder:text-gray-400 placeholder:font-normal focus-visible:ring-2 focus-visible:ring-[#25a863] focus-visible:bg-white transition-all"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 bg-gray-50 border-gray-200 rounded-xl pl-12 pr-5 text-base text-black font-semibold placeholder:text-gray-400 placeholder:font-normal focus-visible:ring-2 focus-visible:ring-[#25a863] focus-visible:bg-white transition-all"
                  />
                </div>

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
                    <span className="w-8 h-8 bg-white shadow-sm rounded-lg flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                      🗺️
                    </span>
                    Bản đồ cứu hộ
                  </Link>
                  <Link
                    to="/search"
                    className="flex items-center gap-3 px-4 py-4 border-[1.5px] border-gray-100 rounded-xl text-sm font-bold text-gray-600 bg-gray-50/50 hover:border-[#25a863] hover:text-[#1a7a4a] hover:bg-green-50 transition-all group"
                  >
                    <span className="w-8 h-8 bg-white shadow-sm rounded-lg flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
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
        <div className="absolute bottom-44 right-10 w-24 h-24 rounded-full bg-white/[0.05] pointer-events-none" />

        <div className="h-20 w-full shrink-0" />

        <div className="flex-1 flex justify-center w-full pt-16 px-12 relative z-10">
          <div className="max-w-xl w-full text-white">
            {/* Live badge */}
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

            {/* Feature cards */}
            <div className="space-y-4">
              {[
                {
                  icon: "🏢",
                  title: "Tài khoản nhân viên",
                  desc: "Điều phối viên và quản lý được cấp tài khoản riêng để quản lý các yêu cầu khẩn cấp.",
                },
                {
                  icon: "🆘",
                  title: "Người dân cần cứu hộ?",
                  desc: (
                    <>
                      Vui lòng truy cập trang{" "}
                      <Link
                        to="/map"
                        className="text-[#b5ffd9] font-bold hover:underline"
                      >
                        BẢN ĐỒ
                      </Link>{" "}
                      để gửi yêu cầu khẩn cấp ngay lập tức.
                    </>
                  ),
                },
                {
                  icon: "📋",
                  title: "Theo dõi yêu cầu",
                  desc: (
                    <>
                      Người dân có thể kiểm tra trạng thái xử lý trực tiếp tại
                      mục{" "}
                      <Link
                        to="/search"
                        className="text-[#b5ffd9] font-bold hover:underline"
                      >
                        TRA CỨU
                      </Link>
                      .
                    </>
                  ),
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 bg-white/[0.08] backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5 hover:bg-white/[0.15] hover:translate-x-1 transition-all cursor-default group"
                >
                  <span className="text-2xl mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">
                    {icon}
                  </span>
                  <div>
                    <p className="font-bold text-base mb-1">{title}</p>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
