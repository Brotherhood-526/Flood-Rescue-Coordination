import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {Link, useNavigate} from 'react-router-dom';
import {ROUTES} from "@/router/routes.tsx";

export default function Login() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        navigate(ROUTES.COORDINATE);
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

                        <CardContent className="p-0">
                            <form className="space-y-5">
                                <div className="space-y-2">
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Số điện thoại"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                        className="h-16 bg-gray-200 border-0 rounded-xl px-5 text-lg text-black font-bold placeholder:text-gray-400 placeholder:font-bold focus-visible:ring-2 focus-visible:ring-[#54b38a] transition-all"
                                    />
                                </div>

                                <div className="space-y-2 mt-6">
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-16 bg-gray-200 border-0 rounded-xl px-5 text-lg text-black font-bold placeholder:text-gray-400 placeholder:font-bold focus-visible:ring-2 focus-visible:ring-[#54b38a] transition-all"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-16 bg-[#54b38a] hover:bg-[#3da076] text-white text-lg font-bold rounded-xl mt-6 shadow-lg transition-all"
                                    onClick={handleLogin}
                                >
                                    Đăng nhập với tư cách nhân viên
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* --- RIGHT SIDE --- */}
            <div className="hidden lg:flex flex-col items-center bg-[#29C58E] p-12 text-white h-full">
                <div className="h-20 w-full shrink-0" />
                <div className="flex-1 flex justify-center w-full pt-24">
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-bold text-center mb-10 tracking-tight">
                            Chào mừng trở lại!
                        </h1>

                        <ul className="space-y-3 text-xl leading-relaxed list-disc pl-6 font-medium">
                            <li>
                                Cổng thông tin điều phối cứu hộ. Cảm ơn bạn đã chung tay cùng cộng đồng.
                            </li>
                            <li>
                                Các điều phối viên và quản lý sẽ được cấp tài khoản riêng để đăng nhập.
                            </li>
                            <li>
                                Bạn là người dân cần cứu hộ? Vui lòng qua trang{' '}
                                <Link to="/map" className="text-2xl font-extrabold text-black hover:text-black hover:underline decoration-2 underline-offset-4 transition-all">
                                    BẢN ĐỒ
                                </Link>
                                nếu chưa gửi yêu cầu. Nếu đã gửi yêu cầu và cần xem trạng thái, vui lòng qua trang{' '}
                                <Link to="/search" className="text-2xl font-extrabold text-black hover:text-black hover:underline decoration-2 underline-offset-4 transition-all">
                                    TRA CỨU
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}