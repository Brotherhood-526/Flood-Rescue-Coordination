import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  User,
  ShieldAlert,
  MapPin,
  Truck,
  FileText,
  AlignLeft,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { ROUTES } from "@/router/routes";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { useVietMap } from "@/lib/MapProvider";

export default function RescueDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestId = searchParams.get("id") || "Đang cập nhật";

  // --- MOCK DATA ---
  const requestDetail = {
    id: requestId,
    phone: "1234567890",
    priority: "Trung bình",
    address: "123, đường 112, Quận 9, TP.HCM",
    coords: "10.7952, 106.7218",
    vehicle: "Trực thăng",
    dispatcher: "Hoàng Thị A",
    teamLeader: "Nguyễn Văn B",
    assignedTime: "23/09/2026 11:36",
  };

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { mount, unmount, map, mapLoaded } = useVietMap();
  const markerRef = useRef<vietmapgl.Marker | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mount(mapContainerRef.current);
    }
    return () => {
      unmount();
    };
  }, [mount, unmount]);

  useEffect(() => {
    if (mapLoaded && map) {
      const [lat, lng] = requestDetail.coords
        .split(",")
        .map((val) => Number(val.trim()));
      const lngLat: [number, number] = [lng, lat];

      if (markerRef.current) markerRef.current.remove();

      markerRef.current = new vietmapgl.Marker({ color: "#ef4444" })
        .setLngLat(lngLat)
        .addTo(map);

      map.flyTo({
        center: lngLat,
        zoom: 16,
        duration: 2000,
      });

      const onMapDblClick = () => {
        navigate(`${ROUTES.RESCUE_MAP}?id=${requestDetail.id}`);
      };

      map.doubleClickZoom.disable();
      map.on("dblclick", onMapDblClick);

      return () => {
        map.off("dblclick", onMapDblClick);
        map.doubleClickZoom.enable();
      };
    }
  }, [mapLoaded, map, requestDetail.coords]);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#fdfdfd] font-sans pl-10 pr-10 pb-5 -mt-15 ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#e5e7eb] hover:bg-[#d1d5db] text-gray-800 rounded-full font-bold text-sm transition-colors"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
          <button
            onClick={() => navigate(ROUTES.RESCUE_CHAT)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#e5e7eb] hover:bg-[#d1d5db] text-gray-800 rounded-full font-bold text-sm transition-colors"
          >
            <MessageCircle size={18} />
            Hội thoại
          </button>
        </div>

        {/* Cụm phải: Tiêu đề & Thời gian */}
        <div className="text-left md:text-center md:mr-64 lg:mr-78">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            Chi tiết nhiệm vụ
          </h2>
          <p className="text-gray-600 font-medium text-sm">
            Được giao: {requestDetail.assignedTime}
          </p>
        </div>
      </div>

      {/* ================= PHẦN 2: BODY (THÔNG TIN & BẢN ĐỒ) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* CỘT TRÁI: Dãy thông tin chi tiết (Chiếm 5 phần) */}
        <div className="lg:col-span-5 space-y-7">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">
              Mã nhiệm vụ
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              #{requestDetail.id}
            </p>
          </div>

          <InfoSection
            icon={<User size={22} />}
            title="Thông tin người yêu cầu"
          >
            Số điện thoại: {requestDetail.phone}
          </InfoSection>

          <InfoSection icon={<ShieldAlert size={22} />} title="Mức độ ưu tiên">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-bold bg-[#fef3c7] text-[#d97706]">
              <span className="w-2 h-2 mr-2 bg-[#f59e0b] rounded-full"></span>
              {requestDetail.priority}
            </span>
          </InfoSection>

          <InfoSection icon={<MapPin size={22} />} title="Vị trí cứu hộ">
            <p className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
              Địa chỉ
            </p>
            <p className="font-bold text-gray-800 mb-3">
              {requestDetail.address}
            </p>
            <p className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
              Tọa độ GPS
            </p>
            <p className="font-bold text-gray-800">{requestDetail.coords}</p>
          </InfoSection>

          <InfoSection icon={<Truck size={22} />} title="Loại phương tiện">
            {requestDetail.vehicle}
          </InfoSection>

          <InfoSection
            icon={<FileText size={22} />}
            title="Thông tin người phụ trách"
          >
            <p className="italic text-gray-700 mb-1">
              Điều phối viên: {requestDetail.dispatcher}
            </p>
            <p className="italic text-gray-700">
              Đội trưởng: {requestDetail.teamLeader}
            </p>
          </InfoSection>

          <InfoSection icon={<AlignLeft size={22} />} title="Mô tả tình huống">
            <div className="w-full h-12 mt-2 border border-gray-200 rounded-md bg-white shadow-sm"></div>
          </InfoSection>

          <InfoSection icon={<ImageIcon size={22} />} title="Link ảnh đính kèm">
            <div className="w-full h-12 mt-2 border border-gray-200 rounded-md bg-white shadow-sm"></div>
          </InfoSection>
        </div>

        {/* CỘT PHẢI: Khung bản đồ (Chiếm 7 phần) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="w-full h-[600px] border border-gray-300 rounded-xl bg-white shadow-sm flex items-center justify-center relative overflow-hidden">
            <div
              ref={mapContainerRef}
              className="absolute inset-0 w-full h-full"
            />

            {!mapLoaded && (
              <div className="text-gray-400 flex flex-col items-center z-10">
                <MapPin size={56} className="mb-3 opacity-30 animate-bounce" />
                <p className="font-medium text-lg opacity-50 animate-pulse">
                  Đang tải bản đồ...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 w-full mt-14 mb-8">
        <button className="flex items-center justify-center gap-3 w-64 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-lg font-bold text-[17px] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
          <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
          Tạm hoãn nhiệm vụ
        </button>

        <button className="flex items-center justify-center gap-2 w-64 py-3.5 bg-[#4ade80] hover:bg-[#22c55e] text-white rounded-lg font-bold text-[17px] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
          <CheckCircle2 size={24} strokeWidth={2.5} />
          Hoàn thành nhiệm vụ
        </button>
      </div>
    </div>
  );
}

// Component phụ để bọc các khối thông tin bên trái
function InfoSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2 text-gray-900">
        {icon}
        <h3 className="font-extrabold text-[16px]">{title}</h3>
      </div>
      <div className="pl-[34px] text-[15px] text-gray-700">{children}</div>
    </div>
  );
}
