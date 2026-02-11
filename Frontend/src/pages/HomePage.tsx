import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

import banner from "@/assets/Banner.svg";

import p1 from "@/assets/problem1.png";
import p2 from "@/assets/problem2.png";
import p3 from "@/assets/problem3.png";
import p4 from "@/assets/problem4.png";

import s1 from "@/assets/solution1.png";
import s2 from "@/assets/solution2.png";
import s3 from "@/assets/solution3.png";
import s4 from "@/assets/solution4.png";


export default function HomePage() {
    return (
        <div className="w-full">
            
            <div
                className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden pt-4 min-h-[520px] flex flex-col items-center justify-center"
            >
                <div className="relative w-full h-[600px] flex items-center justify-center">
                    <img
                        src={banner}
                        alt="Cứu hộ"
                        className="max-h-full max-w-full w-20xl object-contain object-center"
                    />
                    <Link to="/map"
                        className="absolute bottom-16 left-1/2 -translate-x-1/2 inline-flex items-center justify-center rounded-lg
                                bg-white px-8 py-3 text-base font-semibold !text-[#167E30] shadow-md transition-all duration-300 
                                hover:bg-[#167E30] hover:!text-white hover:scale-105 active:scale-95">
                        Xem bản đồ
                    </Link>
                </div>
            </div>

            {/* ===== VẤN ĐỀ THỰC TẾ ===== */}
            <div className="px-50 py-20 ">
                <h2 className="mb-12 text-center text-2xl font-bold uppercase tracking-wide text-gray-800">
                    VẤN ĐỀ THỰC TẾ
                </h2>

                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {[
                        { icon: p1, title: "Thông tin phân tán" },
                        { icon: p2, title: "Phản ứng chậm" },
                        { icon: p3, title: "Tiếp nhận chậm" },
                        { icon: p4, title: "Phối hợp kém" },
                    ].map((item) => (
                        <Card
                            key={item.title}
                            className="overflow-hidden rounded-2xl border-0 shadow-md transition hover:shadow-xl"
                        >
                            <CardContent className="flex flex-col items-center justify-center gap-5 p-8 text-center">
                                <img
                                    src={item.icon}
                                    alt={item.title}
                                    className="h-14 w-14 object-contain"
                                />
                                <p className="font-semibold text-gray-800">
                                    {item.title}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* ===== GIẢI PHÁP CỦA CHÚNG TÔI ===== */}
            <div className="px-50 py-20">
                <h2 className="mb-16 text-center text-2xl font-bold uppercase tracking-wide text-gray-800">
                    GIẢI PHÁP CỦA CHÚNG TÔI
                </h2>

                {[
                    {
                        img: s1,
                        title: "Tiếp nhận tức thời",
                        desc: "Thu thập thông tin cứu hộ theo thời gian thựTự động thu thập yêu cầu cứu nạn kèm tọa độ GPS chính xác và hình ảnh hiện trường. Hệ thống cho phép người dân theo dõi trạng thái xử lý theo thời gian thực và xác nhận ngay khi đã được giải cứu thành công.c qua GPS, hình ảnh và phản ánh từ người dân.",
                    },
                    {
                        img: s2,
                        title: "Bản đồ trực quan",
                        desc: "Hiển thị vị trí sự Hiển thị tức thì vị trí người dân lên bản đồ thông qua thông báo Pop-up. Hỗ trợ xác minh, phân loại mức độ khẩn cấp (Thấp - Trung bình - Cao) và quản lý danh sách phương tiện để điều phối lực lượng phù hợp., lực lượng cứu hộ và tình trạng khu vực trên bản đồ.",
                        reverse: true,
                    },
                    {
                        img: s3,
                        title: "Điều phối hiệu quả",
                        desc: "Tối Đội ngũ nhận nhiệm vụ trực tiếp qua ứng dụng, nắm rõ chi tiết yêu cầu và vị trí người nạn trên bản đồ. Quy trình cập nhật trạng thái minh bạch: từ khi nhận ca, đang di chuyển đến khi hoàn thành và báo cáo kết quả. phân công nhiệm vụ, giảm chồng chéo và nâng cao hiệu quả cứu hộ.",
                    },
                    {
                        img: s4,
                        title: "Quản lý tổng thể",
                        desc: "Theo Hệ thống quản lý tập trung: phân quyền người dùng, điều hành đội nhóm và theo dõi lịch sử hoạt động. Cung cấp các số liệu thống kê trực quan về hiệu suất cứu hộ và tỷ lệ giải cứu thành công trên toàn hệ thống. toàn bộ tiến trình cứu hộ, báo cáo và thống kê tập trung.",
                        reverse: true,
                    },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className={`mb-24 flex flex-col items-center gap-12 md:flex-row md:gap-16 ${item.reverse ? "md:flex-row-reverse" : ""}`}
                    >
                        <img
                            src={item.img}
                            alt={item.title}
                            className="h-[200px] w-[200px] shrink-0 object-contain"
                        />
                        <div className="max-w-xl flex-1 text-center md:text-left">
                            <h3 className="mb-4 text-xl font-semibold text-gray-800">
                                {item.title}
                            </h3>
                            <p className="leading-relaxed text-gray-600">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

          
            
        </div>
    );
}