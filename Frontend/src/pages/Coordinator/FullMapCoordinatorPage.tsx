import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useVietMap } from "@/lib/useVietMap";
import vietmapgl from "@vietmap/vietmap-gl-js";

interface FullMapState {
  userLat: number;
  userLng: number;
  userName: string;
  teamLat: number;
  teamLng: number;
  teamName: string;
}

const DEFAULT_CENTER: [number, number] = [106.7009, 10.7769];

export default function FullMapCoordinatorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as FullMapState | null;

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { map, mount, unmount, mapLoaded } = useVietMap();

  useEffect(() => {
    if (!mapContainer.current) return;
    mount(mapContainer.current);
    return () => unmount();
  }, [mount, unmount]);

  useEffect(() => {
    if (!map || !mapLoaded) return;

    if (!state?.userLat || !state?.teamLat) {
      map.flyTo({ center: DEFAULT_CENTER, zoom: 13 });
      return;
    }

    const userLngLat: [number, number] = [state.userLng, state.userLat];
    const teamLngLat: [number, number] = [state.teamLng, state.teamLat];

    // Marker người yêu cầu
    new vietmapgl.Marker({ color: "#ef4444" })
      .setLngLat(userLngLat)
      .setPopup(
        new vietmapgl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div style="font-family:sans-serif;padding:4px 2px;min-width:140px; text-align:center;">
            <p style="font-weight:700;font-size:13px;margin:0 0 2px;color:#dc2626">
              Người yêu cầu
            </p>
            <p style="font-size:12px;color:#111;margin:0;font-weight:600">
              ${state.userName}
            </p>
          </div>
        `),
      )
      .addTo(map)
      .togglePopup();

    //Marker đội cứu hộ
    new vietmapgl.Marker({ color: "#2563eb" })
      .setLngLat(teamLngLat)
      .setPopup(
        new vietmapgl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div style="font-family:sans-serif;padding:4px 2px;min-width:140px; text-align:center;">
            <p style="font-weight:700;font-size:13px;margin:0 0 2px;color:#2563eb">
              Đội cứu hộ
            </p>
            <p style="font-size:12px;color:#111;margin:0;font-weight:600">
              ${state.teamName}
            </p>
          </div>
        `),
      )
      .addTo(map)
      .togglePopup();

    // Fit bounds để thấy cả 2 marker
    const bounds = new vietmapgl.LngLatBounds(userLngLat, userLngLat);
    bounds.extend(teamLngLat);
    map.fitBounds(bounds, { padding: 120, duration: 1500, maxZoom: 15 });
  }, [map, mapLoaded, state]);

  return (
    <>
      <div className="w-screen h-screen">
        <div ref={mapContainer} className="h-full w-full" />
      </div>

      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-300 text-black rounded-lg font-bold transition-all cursor-pointer"
      >
        <ArrowLeft size={20} />
        Quay lại chi tiết
      </button>
    </>
  );
}
