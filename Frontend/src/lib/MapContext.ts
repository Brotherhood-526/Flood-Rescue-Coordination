import { createContext } from "react";
import type vietmapgl from "@vietmap/vietmap-gl-js";

interface MapContextType {
  map: vietmapgl.Map | null;
  mapLoaded: boolean;
  mount: (container: HTMLElement) => void;
  unmount: () => void;
}

export const MapContext = createContext<MapContextType>({
  map: null,
  mapLoaded: false,
  mount: () => {},
  unmount: () => {},
});
