import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// useSearchParams
import { ArrowLeft } from "lucide-react";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { useVietMap } from "@/lib/MapProvider";

export default function FullMapPage() {
  const navigate = useNavigate();
  //   const [searchParams] = useSearchParams();
  //   const requestId = searchParams.get("id");

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { mount, unmount, map, mapLoaded } = useVietMap();

  // --- MOCK DATA TỌA ĐỘ ---
  const teamCoords: [number, number] = [106.695, 10.778];
  const requestCoords: [number, number] = [106.7218, 10.7952];

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
      // CẮM CỜ VÀ GẮN CHỮ CHO "ĐỘI CỦA BẠN"
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
            <div style="font-size: 13px; color: #6b7280;">#1234</div>
          </div>`,
        )
        .addTo(map);

      //  CẮM CỜ VÀ GẮN CHỮ CHO "YÊU CẦU ĐƯỢC GIAO"
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
            <div style="font-weight: bold; font-size: 14px; color: #1f2937;">Yêu cầu</div>
            <div style="font-size: 13px; color: #6b7280;">được giao</div>
          </div>`,
        )
        .addTo(map);

      const bounds = new vietmapgl.LngLatBounds();
      bounds.extend(teamCoords);
      bounds.extend(requestCoords);
      map.fitBounds(bounds, { padding: 120, maxZoom: 16, duration: 1500 });
    }
  }, [mapLoaded, map]);

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
