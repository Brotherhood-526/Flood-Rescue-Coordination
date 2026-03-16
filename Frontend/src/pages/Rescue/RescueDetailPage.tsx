import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  User,
  ShieldAlert,
  MapPin,
  AlignLeft,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { ROUTES } from "@/router/routes";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { useVietMap } from "@/lib/MapProvider";
import {
  rescueTeamService,
  type RescueRequest,
} from "@/services/Rescue/rescueTeamService";

export default function RescueDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id");

  // === QUẢN LÝ STATE DATA ===
  const [detail, setDetail] = useState<RescueRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { mount, unmount, map, mapLoaded } = useVietMap();
  const markerRef = useRef<vietmapgl.Marker | null>(null);

  // === GỌI API LẤY CHI TIẾT ===
  useEffect(() => {
    if (!requestId) return;

    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const data = await rescueTeamService.getTaskDetail(requestId);
        setDetail(data);
      } catch (error) {
        console.error("Lỗi fetch chi tiết:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [requestId]);

  //khởi tạo cái map
  useEffect(() => {
    if (mapContainerRef.current && detail?.geo_location) {
      mount(mapContainerRef.current);
    }
    return () => unmount();
  }, [detail?.geo_location, mount, unmount]);

  // cắm cờ lên bản đồ nếu có data
  useEffect(() => {
    const geoString = detail?.geo_location;
    if (
      mapLoaded &&
      map &&
      typeof geoString === "string" &&
      geoString.includes(",")
    ) {
      try {
        const coords = geoString.split(",");

        if (coords.length === 2) {
          const lat = Number(coords[0].trim());
          const lng = Number(coords[1].trim());

          // Kiểm tra xem số có hợp lệ không
          if (!isNaN(lat) && !isNaN(lng)) {
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
              if (detail?.id) {
                navigate(`${ROUTES.RESCUE_MAP}?id=${detail.id}`);
              }
            };

            map.doubleClickZoom.disable();
            map.on("dblclick", onMapDblClick);

            return () => {
              map.off("dblclick", onMapDblClick);
              map.doubleClickZoom.enable();
            };
          }
        }
      } catch (e) {
        console.log("Lỗi parse tọa độ:", e);
      }
    }
  }, [mapLoaded, map, detail, navigate]);

  // === HÀM CẬP NHẬT TRẠNG THÁI ===
  const handleUpdateStatus = async (newStatus: string) => {
    if (!requestId) return;
    try {
      setIsUpdating(true);
      await rescueTeamService.updateTaskStatus(requestId, newStatus);
      alert(`Đã cập nhật trạng thái thành: ${newStatus}`);
      // Thành công thì đá về trang List để Đội Trưởng nhận ca mới
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật trạng thái! Vui lòng kiểm tra lại mạng.");
    } finally {
      setIsUpdating(false);
    }
  };

  // === GIAO DIỆN LOADING ===
  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center text-[#25a863]">
        <Loader2 className="animate-spin mb-4" size={48} />
        <h2 className="text-xl font-bold">Đang tải thông tin nhiệm vụ...</h2>
      </div>
    );
  }

  // === GIAO DIỆN LỖI/KHÔNG TÌM THẤY ===
  if (!detail) {
    return (
      <div className="p-10 text-center flex flex-col items-center">
        <h2 className="text-red-500 font-bold text-2xl mb-4">
          Không tìm thấy nhiệm vụ!
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-200 rounded-md font-bold hover:bg-gray-300"
        >
          Quay lại
        </button>
      </div>
    );
  }

  // === GIAO DIỆN CHÍNH ===
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
            onClick={() => navigate(ROUTES.RESCUE_CHAT)}
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

      {/* BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* CỘT TRÁI: THÔNG TIN */}
        <div className="lg:col-span-5 space-y-7">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">
              Mã nhiệm vụ
            </h2>
            <p className="text-gray-500 text-sm font-mono font-medium">
              #{detail.id?.substring(0, 8).toUpperCase()}
            </p>
          </div>

          <InfoSection
            icon={<User size={22} />}
            title="Thông tin người yêu cầu"
          >
            <p className="font-semibold text-gray-800">
              Mã định danh: {detail.userId || "Khách vãng lai"}
            </p>
          </InfoSection>

          <InfoSection icon={<ShieldAlert size={22} />} title="Mức độ ưu tiên">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-bold ${
                detail.urgency === "cao"
                  ? "bg-red-100 text-red-700"
                  : "bg-[#fef3c7] text-[#d97706]"
              }`}
            >
              <span
                className={`w-2 h-2 mr-2 rounded-full ${detail.urgency === "cao" ? "bg-red-600" : "bg-[#f59e0b]"}`}
              ></span>
              {detail.urgency ? detail.urgency.toUpperCase() : "BÌNH THƯỜNG"}
            </span>
          </InfoSection>

          <InfoSection icon={<MapPin size={22} />} title="Vị trí cứu hộ">
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
              {detail.geo_location || "Không có tọa độ"}
            </p>
          </InfoSection>

          <InfoSection icon={<AlignLeft size={22} />} title="Mô tả tình huống">
            <div className="w-full min-h-12 mt-2 p-3 border border-gray-200 rounded-md bg-white shadow-sm font-medium text-gray-700">
              {detail.description || "Không có mô tả chi tiết."}
            </div>
          </InfoSection>

          <InfoSection
            icon={<ImageIcon size={22} />}
            title="Hình ảnh hiện trường"
          >
            {detail.images && detail.images.length > 0 ? (
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
                      className="w-full h-50 object-cover rounded-lg border border-gray-200 shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
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
            )}
          </InfoSection>
        </div>

        {/* CỘT PHẢI: BẢN ĐỒ VIETMAP */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="w-full h-137.5 border border-gray-300 rounded-xl bg-gray-100 shadow-sm flex items-center justify-center relative overflow-hidden">
            {detail.geo_location ? (
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

            {!mapLoaded && detail.geo_location && (
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

      {/* FOOTER: NÚT CẬP NHẬT TRẠNG THÁI */}
      <div className="flex flex-wrap justify-center gap-6 w-full mt-14 mb-8">
        <button
          onClick={() => handleUpdateStatus("tạm hoãn")}
          disabled={
            isUpdating || detail.status.toLowerCase().includes("hoàn thành")
          }
          className="flex items-center justify-center gap-3 w-64 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-[17px] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
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

// Component phụ cho khối thông tin
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
        <div className="text-gray-700">{icon}</div>
        <h3 className="font-extrabold text-[16px]">{title}</h3>
      </div>
      <div className="pl-8 text-[15px] text-gray-700">{children}</div>
    </div>
  );
}
