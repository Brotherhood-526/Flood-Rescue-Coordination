import { useEffect, useRef, useCallback } from "react";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { useVietMap } from "@/lib/useVietMap";
import { vietmapService } from "@/services/User/vietmapService";
import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import type { RequestSchemaType } from "@/validations/user.request.schema";

export const useRequestMap = ({
  mapContainer,
  isSubmitted,
  getValues,
  setValue,
  setActiveTab,
  submittedLocate,
}: {
  mapContainer: React.RefObject<HTMLDivElement | null>;
  isSubmitted: boolean;
  getValues: UseFormGetValues<RequestSchemaType>;
  setValue: UseFormSetValue<RequestSchemaType>;
  setActiveTab: (val: string) => void;
  submittedLocate?: string;
}) => {
  const { map, mount, unmount } = useVietMap();
  const markerRef = useRef<vietmapgl.Marker | null>(null);
  const popupRef = useRef<vietmapgl.Popup | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    mount(mapContainer.current);
    return () => unmount();
  }, [mount, unmount, mapContainer]);

  // Cắm cờ sau submit
  useEffect(() => {
    if (!map || !isSubmitted || !submittedLocate) return;
    const [lat, lng] = submittedLocate.split(",").map((v) => Number(v.trim()));
    if (isNaN(lat) || isNaN(lng)) return;
    markerRef.current?.remove();
    markerRef.current = new vietmapgl.Marker({ color: "#EF4444" })
      .setLngLat([lng, lat])
      .addTo(map);
    map.flyTo({ center: [lng, lat], zoom: 16 });
  }, [map, isSubmitted, submittedLocate]);

  const showDragPopup = useCallback(
    (lngLat: [number, number]) => {
      popupRef.current?.remove();
      if (!map) return;
      popupRef.current = new vietmapgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 35,
      })
        .setLngLat(lngLat)
        .setHTML(
          `<div style="font-family:sans-serif;text-align:center;font-size:12px;font-weight:600;color:#374151;">Bạn có thể kéo cờ để chọn vị trí chính xác nhất.</div>`,
        )
        .addTo(map);
    },
    [map],
  );

  const attachDraggable = useCallback(
    (marker: vietmapgl.Marker) => {
      marker.on("dragend", async () => {
        const { lng, lat } = marker.getLngLat();
        setValue("locate", `${lat.toFixed(6)}, ${lng.toFixed(6)}`, {
          shouldValidate: true,
        });
        try {
          const address = await vietmapService.reverseGeocode(lat, lng);
          if (address) {
            setValue("address", address, { shouldValidate: true });
            setActiveTab("address");
          }
          showDragPopup([lng, lat]);
        } catch (err) {
          console.error(err);
        }
      });
    },
    [setValue, setActiveTab, showDragPopup],
  );

  // Default marker HCMC
  useEffect(() => {
    if (!map || isSubmitted || getValues("locate")) return;
    const HCMC: [number, number] = [106.7009, 10.7769];
    markerRef.current?.remove();
    markerRef.current = new vietmapgl.Marker({
      color: "#3B82F6",
      draggable: true,
    })
      .setLngLat(HCMC)
      .addTo(map);
    map.flyTo({ center: HCMC, zoom: 14 });
    (async () => {
      setValue("locate", `${HCMC[1]}, ${HCMC[0]}`, { shouldValidate: true });
      try {
        const address = await vietmapService.reverseGeocode(HCMC[1], HCMC[0]);
        if (address) setValue("address", address, { shouldValidate: true });
        showDragPopup(HCMC);
      } catch (err) {
        console.error("Lỗi lấy địa chỉ mặc định:", err);
      }
    })();
    attachDraggable(markerRef.current);
  }, [map, isSubmitted, getValues, setValue, attachDraggable, showDragPopup]);

  const handleGetLocation = () => {
    if (!navigator.geolocation)
      return alert("Trình duyệt không hỗ trợ định vị");
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lng } }) => {
        setValue("locate", `${lat.toFixed(6)}, ${lng.toFixed(6)}`, {
          shouldValidate: true,
        });
        if (map) {
          map.flyTo({ center: [lng, lat], zoom: 16 });
          markerRef.current?.remove();
          markerRef.current = new vietmapgl.Marker({
            color: "#3B82F6",
            draggable: true,
          })
            .setLngLat([lng, lat])
            .addTo(map);
          attachDraggable(markerRef.current);
          showDragPopup([lng, lat]);
        }
        try {
          const address = await vietmapService.reverseGeocode(lat, lng);
          if (address) {
            setValue("address", address, { shouldValidate: true });
            setActiveTab("address");
          }
        } catch (err) {
          console.error("Lỗi reverse geocode:", err);
        }
      },
      () => alert("Bạn chưa cấp quyền định vị"),
    );
  };

  const handleConfirmAddress = async () => {
    const address = getValues("address");
    if (!address?.trim())
      return alert("Vui lòng nhập địa chỉ trước khi xác nhận!");
    try {
      const coords = await vietmapService.geocodeAddress(address);
      if (!coords)
        return alert("Không tìm thấy địa chỉ này trên bản đồ Vietmap.");
      if (isNaN(coords.lat) || isNaN(coords.lng))
        return alert("Vietmap không hỗ trợ tọa độ cho địa chỉ này.");
      setValue("locate", `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`, {
        shouldValidate: true,
      });
      setActiveTab("coordinate");
      if (map) {
        map.flyTo({ center: [coords.lng, coords.lat], zoom: 16 });
        markerRef.current?.remove();
        markerRef.current = new vietmapgl.Marker({
          color: "#EF4444",
          draggable: true,
        })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map);
        attachDraggable(markerRef.current);
        showDragPopup([coords.lng, coords.lat]);
      }
    } catch (err) {
      console.error("Lỗi tìm tọa độ:", err);
    }
  };

  return {
    map,
    markerRef,
    popupRef,
    handleGetLocation,
    handleConfirmAddress,
  };
};
