import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";
import { useVietMap } from "@/lib/MapProvider";
import vietmapgl from "@vietmap/vietmap-gl-js";

const DEFAULT_CENTER: [number, number] = [106.7009, 10.7769];

//  thay bằng data thật từ API
const USER_LOCATIONS: [number, number][] = [
  [106.6297, 10.8231],
  [106.6577, 10.8453],
  [106.6936, 10.7314],
  [106.7143, 10.8012],
  [106.6723, 10.756],
  [106.743, 10.8655],
];

// thay bằng data thật từ API
const TEAM_LOCATIONS: [number, number][] = [
  [106.7009, 10.7769],
  [106.667, 10.838],
  [106.635, 10.7904],
  [106.6298, 10.7432],
  [106.803, 10.87],
];

export default function FullMapCoordinatorPage() {
  const navigate = useNavigate(); // ✅ lên trên cùng
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { map, mount } = useVietMap();

  useEffect(() => {
    if (!mapContainer.current) return;
    mount(mapContainer.current);
  }, [mount]);

  useEffect(() => {
    if (!map) return;
    map.flyTo({ center: DEFAULT_CENTER, zoom: 13 });

    TEAM_LOCATIONS.forEach((position) => {
      const el = document.createElement("div");
      el.className = "w-4 h-4 bg-blue-600 rounded-full border-2 border-white";
      new vietmapgl.Marker({ element: el }).setLngLat(position).addTo(map);
    });

    USER_LOCATIONS.forEach((position) => {
      const el = document.createElement("div");
      el.className = "w-4 h-4 bg-red-600 rounded-full border-2 border-white";
      new vietmapgl.Marker({ element: el }).setLngLat(position).addTo(map);
    });
  }, [map]);

  return (
    <>
      <div className="w-screen h-screen">
        <div ref={mapContainer} className="h-full w-full" />
      </div>
      <ArrowBigLeft
        className="fixed top-[11vh] left-[0.5vw] z-999 w-10 h-10 p-2 rounded-full
          bg-white border border-black/20 transition-all duration-200
          hover:bg-gray-100 hover:border-2 hover:border-gray-400 cursor-pointer"
        strokeWidth={1.5}
        onClick={() => navigate(-1)}
      />
    </>
  );
}
