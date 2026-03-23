import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  User,
  Users,
  Car,
  ShieldAlert,
  MapPin,
  AlignLeft,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { ROUTES } from "@/router/routes";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { useVietMap } from "@/lib/MapProvider";
import { rescueTeamService } from "@/services/Rescue/rescueTeamService";
import type { RescueRequest } from "@/types/rescue";

export default function RescueDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id");

  const [detail, setDetail] = useState<RescueRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { mount, unmount, map, mapLoaded } = useVietMap();
  const markerRef = useRef<vietmapgl.Marker | null>(null);

  useEffect(() => {
    if (!requestId) return;
    rescueTeamService
      .getTaskDetail(requestId)
      .then(setDetail)
      .catch(console.error);
  }, [requestId]);

  useEffect(() => {
    if (mapContainerRef.current && detail?.geoLocation)
      mount(mapContainerRef.current);
    return () => unmount();
  }, [detail?.geoLocation, mount, unmount]);

  useEffect(() => {
    const geoString = detail?.geoLocation;
    if (
      !mapLoaded ||
      !map ||
      typeof geoString !== "string" ||
      !geoString.includes(",")
    )
      return;

    const [rawLat, rawLng] = geoString.split(",");
    const lat = Number(rawLat.trim());
    const lng = Number(rawLng.trim());
    if (isNaN(lat) || isNaN(lng)) return;

    const lngLat: [number, number] = [lng, lat];
    markerRef.current?.remove();
    markerRef.current = new vietmapgl.Marker({ color: "#ef4444" })
      .setLngLat(lngLat)
      .addTo(map);
    map.flyTo({ center: lngLat, zoom: 16, duration: 2000 });

    const onDblClick = () =>
      detail?.id && navigate(`${ROUTES.RESCUE_MAP}?id=${detail.id}`);
    map.doubleClickZoom.disable();
    map.on("dblclick", onDblClick);
    return () => {
      map.off("dblclick", onDblClick);
      map.doubleClickZoom.enable();
    };
  }, [mapLoaded, map, detail, navigate]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!requestId) return;
    try {
      setIsUpdating(true);
      await rescueTeamService.updateTaskStatus(requestId, newStatus);
      alert(`Đã cập nhật trạng thái thành: ${newStatus}`);
      navigate(-1);
    } catch {
      alert("Lỗi khi cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!detail) return null;

  const infoBlock = (
    icon: React.ReactNode,
    title: string,
    children: React.ReactNode,
  ) => (
    <div>
      <div className="flex items-center gap-3 mb-2 text-gray-900">
        <div className="text-gray-700">{icon}</div>
        <h3 className="font-extrabold text-[16px]">{title}</h3>
      </div>
      <div className="pl-8 text-[15px] text-gray-700">{children}</div>
    </div>
  );

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#fdfdfd] font-sans pl-10 pr-10 pb-5 -mt-15">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#e5e7eb] hover:bg-[#d1d5db] text-gray-800 rounded-full font-bold text-sm transition-colors"
          >
            <ArrowLeft size={18} /> Quay lại
          </button>
          <button
            onClick={() => navigate(`${ROUTES.RESCUE_CHAT}?id=${detail.id}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#e5e7eb] hover:bg-[#d1d5db] text-gray-800 rounded-full font-bold text-sm transition-colors"
          >
            <MessageCircle size={18} /> Hội thoại
          </button>
        </div>

        <div className="text-left md:text-center md:mr-64 lg:mr-78">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            Chi tiết nhiệm vụ
          </h2>
          <p className="text-gray-600 font-medium text-sm">
            Thời gian tạo:{" "}
            {detail.createdAt
              ? new Date(detail.createdAt).toLocaleString("vi-VN")
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Cột trái */}
        <div className="lg:col-span-5 space-y-7">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">
              Mã nhiệm vụ
            </h2>
            <p className="text-gray-500 text-sm font-mono font-medium">
              #{detail.id?.substring(0, 8).toUpperCase()}
            </p>
          </div>

          {infoBlock(
            <User size={22} />,
            "Thông tin người yêu cầu",
            <p className="font-semibold text-gray-800">
              Số điện thoại: {detail.citizenPhone || "Không có"}
            </p>,
          )}

          {infoBlock(
            <ShieldAlert size={22} />,
            "Mức độ ưu tiên",
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-bold ${
                detail.urgency === "cao"
                  ? "bg-red-100 text-red-700"
                  : "bg-[#fef3c7] text-[#d97706]"
              }`}
            >
              <span
                className={`w-2 h-2 mr-2 rounded-full ${
                  detail.urgency === "cao" ? "bg-red-600" : "bg-[#f59e0b]"
                }`}
              />
              {detail.urgency ? detail.urgency.toUpperCase() : "BÌNH THƯỜNG"}
            </span>,
          )}

          {infoBlock(
            <MapPin size={22} />,
            "Vị trí cứu hộ",
            <>
              <p className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
                Địa chỉ
              </p>
              <p className="font-bold text-gray-800 mb-3">
                {detail.address || "Đang cập nhật địa chỉ..."}
              </p>
              <p className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
                Tọa độ GPS
              </p>
              <p className="font-bold text-gray-800 font-mono">
                {detail.geoLocation || "Không có tọa độ"}
              </p>
            </>,
          )}

          {infoBlock(
            <Car size={22} />,
            "Loại phương tiện",
            <p className="font-semibold text-gray-800">
              {detail.vehicleType || "Chưa điều phương tiện"}
            </p>,
          )}

          {infoBlock(
            <Users size={22} />,
            "Thông tin người phụ trách",
            <p className="font-semibold text-gray-800 mb-1">
              Điều phối viên:{" "}
              <span className="font-normal">
                {detail.coordinatorName || "Hệ thống tự động"}
              </span>
            </p>,
          )}

          {infoBlock(
            <AlignLeft size={22} />,
            "Mô tả tình huống",
            <div className="w-full min-h-12 mt-2 p-3 border border-gray-200 rounded-md bg-white shadow-sm font-medium text-gray-700">
              {detail.description || "Không có mô tả chi tiết."}
            </div>,
          )}

          {infoBlock(
            <ImageIcon size={22} />,
            "Hình ảnh hiện trường",
            detail.images?.length ? (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {detail.images.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <img
                      src={url}
                      alt={`Ảnh hiện trường ${index + 1}`}
                      className="w-full h-36 object-cover rounded-lg border border-gray-200 shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </a>
                ))}
              </div>
            ) : (
              <div className="w-full h-12 mt-2 border border-gray-200 rounded-md bg-white shadow-sm flex items-center px-3 text-gray-400 italic">
                Người dân không gửi ảnh
              </div>
            ),
          )}
        </div>

        {/* Cột phải — bản đồ */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="w-full h-137.5 border border-gray-300 rounded-xl bg-gray-100 shadow-sm flex items-center justify-center relative overflow-hidden">
            {detail.geoLocation ? (
              <div
                key={detail.id}
                ref={mapContainerRef}
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <div className="text-gray-500 font-medium text-lg flex flex-col items-center">
                <MapPin size={48} className="mb-2 opacity-30" />
                Người dân không cung cấp tọa độ GPS
              </div>
            )}

            {!mapLoaded && detail.geoLocation && (
              <div className="text-gray-400 flex flex-col items-center z-10 absolute bg-white/80 p-4 rounded-lg">
                <MapPin
                  size={48}
                  className="mb-3 opacity-50 animate-bounce text-red-500"
                />
                <p className="font-bold text-lg animate-pulse text-gray-700">
                  Đang tải bản đồ VietMap...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-6 w-full mt-14 mb-8">
        <button
          onClick={() => handleUpdateStatus("tạm hoãn")}
          disabled={
            isUpdating ||
            detail.status.toLowerCase().includes("hoàn thành") ||
            detail.status.toLowerCase().includes("tạm hoãn")
          }
          className="flex items-center justify-center gap-3 w-64 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-[17px] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="w-4 h-4 bg-white rounded-sm opacity-90" />
          {isUpdating ? "Đang xử lý..." : "Tạm hoãn nhiệm vụ"}
        </button>

        <button
          onClick={() => handleUpdateStatus("hoàn thành")}
          disabled={
            isUpdating || detail.status.toLowerCase().includes("hoàn thành")
          }
          className="flex items-center justify-center gap-2 w-64 py-3.5 bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-[17px] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <CheckCircle2 size={24} strokeWidth={2.5} />
          {isUpdating ? "Đang xử lý..." : "Hoàn thành nhiệm vụ"}
        </button>
      </div>
    </div>
  );
}
