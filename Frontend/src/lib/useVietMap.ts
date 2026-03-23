import { useContext } from "react";
import { MapContext } from "@/lib/MapContext";

export const useVietMap = () => useContext(MapContext);
