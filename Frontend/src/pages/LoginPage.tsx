import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from "@/router/routes.tsx";
import { useAuth } from "@/hooks/useAuth"
export default function Login() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const user = await login(phoneNumber, password);

            if (user?.role === "coordinate") {
                navigate(ROUTES.COORDINATE);
            } else {
                navigate("/");
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2">

            {/* --- LEFT SIDE --- */}
            <div className="flex flex-col h-full">
                <div className="flex h-20 px-4 py-4 shrink-0">
                    <Link to="/">
                        <img
                            src="/Logo.png"
                            alt="Cứu Hộ Logo"
                            className="w-auto h-12 cursor-pointer hover:opacity-90 transition-opacity"
                        />
                    </Link>
                </div>

                <div className="flex-1 flex justify-center w-full pt-24">
                    <Card className="w-full max-w-[500px] border-0 shadow-none">
                        <CardHeader className="text-center p-0 mb-10">
                            <CardTitle className="text-5xl font-bold text-slate-900">
                                Đăng nhập
                            </CardTitle>
                        </CardHeader>

        {/* Form */}
        <div className="flex-1 flex justify-center w-full pt-16 px-6">
          <Card className="w-full max-w-[480px] border-0 shadow-none bg-transparent">
            <CardHeader className="text-center p-0 mb-3">
              <CardTitle className="text-5xl font-extrabold text-slate-900 tracking-tight">
                Đăng nhập
              </CardTitle>
              <p className="text-sm text-gray-400 mt-2 font-medium">
                Dành cho nhân viên & điều phối viên
              </p>
            </CardHeader>

            <CardContent className="p-0 mt-8">
              <form className="space-y-4" onSubmit={handleLogin}>
                {/* Phone */}
                <div className="relative">
                  <Input
                    id="phone"
                    name="name"
                    autoComplete="tel"
                    type="tel"
                    placeholder="Số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="h-14 bg-gray-100 border-gray-200 rounded-xl pl-11 pr-5 text-base text-black font-semibold placeholder:text-gray-400 placeholder:font-normal focus-visible:ring-2 focus-visible:ring-[#25a863] focus-visible:bg-white transition-all"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 bg-gray-100 border-gray-200 rounded-xl pl-11 pr-5 text-base text-black font-semibold placeholder:text-gray-400 placeholder:font-normal focus-visible:ring-2 focus-visible:ring-[#25a863] focus-visible:bg-white transition-all"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#25a863] hover:bg-[#1a7a4a] text-white text-base font-bold rounded-xl shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-200 mt-2"
                >
                  Đăng nhập với tư cách nhân viên →
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">
                    hoặc truy cập nhanh (Người dân)
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/map"
                    className="flex items-center gap-2.5 px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:border-[#25a863] hover:text-[#1a7a4a] hover:bg-green-50 transition-all"
                  >
                    <span className="w-7 h-7 bg-green-100 rounded-md flex items-center justify-center text-sm flex-shrink-0">
                      🗺️
                    </span>
                    Bản đồ cứu hộ
                  </Link>
                  <Link
                    to="/search"
                    className="flex items-center gap-2.5 px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:border-[#25a863] hover:text-[#1a7a4a] hover:bg-green-50 transition-all"
                  >
                    <span className="w-7 h-7 bg-green-100 rounded-md flex items-center justify-center text-sm flex-shrink-0">
                      🔍
                    </span>
                    Tra cứu yêu cầu
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
            <p className="text-white/75 text-sm mb-8 leading-relaxed">
              Cổng thông tin điều phối cứu hộ.
              <br />
              Cảm ơn bạn đã chung tay cùng cộng đồng.
            </p>

            {/* Feature cards */}
            <div className="space-y-3">
              {[
                {
                  icon: "🏢",
                  title: "Tài khoản nhân viên",
                  desc: "Điều phối viên và quản lý được cấp tài khoản riêng để đăng nhập hệ thống.",
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
                      để gửi yêu cầu khẩn cấp.
                    </>
                  ),
                },
                {
                  icon: "📋",
                  title: "Theo dõi yêu cầu",
                  desc: (
                    <>
                      Đã gửi yêu cầu? Kiểm tra tiến độ tại trang{" "}
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
                  className="flex items-start gap-4 bg-white/[0.12] backdrop-blur border border-white/20 rounded-2xl px-5 py-4 hover:bg-white/[0.20] hover:translate-x-1 transition-all cursor-default"
                >
                  <span className="text-xl mt-0.5 flex-shrink-0">{icon}</span>
                  <div>
                    <p className="font-bold text-sm mb-0.5">{title}</p>
                    <p className="text-white/80 text-sm leading-relaxed">
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
