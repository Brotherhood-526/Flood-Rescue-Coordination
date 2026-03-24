import { useCallback, useRef, useState } from "react";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { MapContext } from "@/lib/MapContext";

// ── Provider
// ── Provider ──────────────────────────────────────────────
export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const mapRef = useRef<vietmapgl.Map | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // Dùng state thay vì mapRef.current trong JSX → tránh lỗi ESLint refs during render
  const [mapInstance, setMapInstance] = useState<vietmapgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const TILEMAP_KEY = import.meta.env.VITE_TILEMAP_KEY;

  const destroyMap = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    containerRef.current = null;
    setMapInstance(null);
    setMapLoaded(false);
  }, []);

  const mount = useCallback(
    (container: HTMLElement) => {
      if (!TILEMAP_KEY) return;
      if (mapRef.current && containerRef.current === container) return;
      if (mapRef.current && containerRef.current !== container) destroyMap();

      // buildStyleUrl đặt trong useCallback → không thay đổi mỗi render
      const styleUrl = `https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${TILEMAP_KEY}`;

      const hcmBounds: [[number, number], [number, number]] = [
        [106.35, 10.35],
        [107.15, 11.15],
      ];

      const map = new vietmapgl.Map({
        container,
        style: styleUrl,
        center: [106.70098, 10.77689],
        zoom: 13,
        maxBounds: hcmBounds,
      });

      map.setMinZoom(10);
      map.addControl(new vietmapgl.NavigationControl());
      map.on("load", () => setMapLoaded(true));

      mapRef.current = map;
      containerRef.current = container;
      setMapInstance(map);
    },
    [TILEMAP_KEY, destroyMap],
  );

  const unmount = useCallback(() => destroyMap(), [destroyMap]);

  return (
    <MapContext.Provider
      value={{
        map: mapInstance, // ← state, không phải mapRef.current
        mapLoaded,
        mount,
        unmount,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
