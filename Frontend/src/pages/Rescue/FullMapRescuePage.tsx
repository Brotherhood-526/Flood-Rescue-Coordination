import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { useVietMap } from "@/lib/MapProvider";
import { useAuthStore } from "@/store/authStore";
import { rescueTeamService } from "@/services/Rescue/rescueTeamService";

export default function FullMapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id");

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { mount, unmount, map, mapLoaded } = useVietMap();
  const staff = useAuthStore((state) => state.staff);

  useEffect(() => {
    if (mapContainerRef.current) {
      mount(mapContainerRef.current);
    }
    return () => unmount();
  }, [mount, unmount]);

  useEffect(() => {
    if (!mapLoaded || !map || !requestId) return;

    const loadMarkers = async () => {
      try {
        const detail = await rescueTeamService.getTaskDetail(requestId);

        if (!detail.geoLocation) return;

        const [lat, lng] = detail.geoLocation.split(",").map(Number);
        const requestCoords: [number, number] = [lng, lat];

        // Marker đỏ: vị trí yêu cầu cứu hộ
        new vietmapgl.Marker({ color: "#ef4444" })
          .setLngLat(requestCoords)
          .addTo(map);

        new vietmapgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 35,
        })
          .setLngLat(requestCoords)
          .setHTML(
            `<div style="font-family: sans-serif; text-align: center; padding: 2px;">
              <div style="font-weight: bold; font-size: 14px; color: #ef4444;">Yêu cầu cứu hộ</div>
              <div style="font-size: 12px; color: #6b7280;">${detail.address || "Không có địa chỉ"}</div>
            </div>`,
          )
          .addTo(map);

        const bounds = new vietmapgl.LngLatBounds();
        bounds.extend(requestCoords);

        // Marker xám: vị trí đội cứu hộ (lấy từ auth store)
        if (staff?.latitude && staff?.longitude) {
          const teamCoords: [number, number] = [
            staff.longitude,
            staff.latitude,
          ];

          new vietmapgl.Marker({ color: "#374151" })
            .setLngLat(teamCoords)
            .addTo(map);

          new vietmapgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 35,
          })
            .setLngLat(teamCoords)
            .setHTML(
              `<div style="font-family: sans-serif; text-align: center; padding: 2px;">
                <div style="font-weight: bold; font-size: 14px; color: #1f2937;">Đội của bạn</div>
                <div style="font-size: 12px; color: #6b7280;">${staff.teamName || ""}</div>
              </div>`,
            )
            .addTo(map);

          bounds.extend(teamCoords);
        }

        map.fitBounds(bounds, { padding: 120, maxZoom: 16, duration: 1500 });
      } catch (error) {
        console.error("Lỗi load markers:", error);
      }
    };

    loadMarkers();
  }, [mapLoaded, map, requestId, staff]);

  return (
    <div className="w-full h-[calc(100vh-80px)] relative bg-gray-100">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-300 text-black rounded-lg font-bold transition-all cursor-pointer"
      >
        <ArrowLeft size={20} />
        Quay lại chi tiết
      </button>

      <div className="w-screen h-screen">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>
    </div>
  );
}
