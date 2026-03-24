import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { useVietMap } from "@/lib/useVietMap";
import { requestService } from "@/services/User/requestService";
import { vietmapService } from "@/services/User/vietmapService";
import {
  requestSchema,
  type RequestSchemaType,
} from "@/validations/user.request.schema";
import type { ChatMessage, CitizenLookupData } from "@/types/request";
import type { RescueImage } from "@/types/apiRescue";
import {
  buildSubmitFormData,
  buildUpdateFormData,
} from "@/services/User/requestService";

import { RESCUE_STORAGE_KEYS } from "@/constants/request.constants";
export const useRequestController = (
  mapContainer: React.RefObject<HTMLDivElement | null>,
) => {
  const location = useLocation();
  const routeState = location.state;
  const { map, mount, unmount } = useVietMap();

  const inputRef = useRef<HTMLInputElement>(null);
  const markerRef = useRef<vietmapgl.Marker | null>(null);
  const popupRef = useRef<vietmapgl.Popup | null>(null);

  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("address");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    routeState?.imageUrls ?? [],
  );
  const [isSubmitted, setIsSubmitted] = useState(
    routeState?.isSubmitted ?? !!localStorage.getItem("rescue_requestId"),
  );
  const [requestId, setRequestId] = useState<string | null>(
    routeState?.requestId ?? localStorage.getItem("rescue_requestId"),
  );
  const [phone, setPhone] = useState<string | null>(
    routeState?.submittedData?.phone ?? localStorage.getItem("rescue_phone"),
  );
  const [submittedData, setSubmittedData] = useState<RequestSchemaType | null>(
    routeState?.submittedData ?? null,
  );
  const [status, setStatus] = useState<string | null>(
    routeState?.status ?? null,
  );
  const [urgency, setUrgency] = useState<string | null>(
    routeState?.urgency ?? null,
  );

  //Form
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(requestSchema),
    defaultValues: {
      type: "",
      address: "",
      locate: "",
      description: "",
      phone: "",
      name: "",
      url: "",
      image: undefined,
    },
  });

  const selectedType = watch("type");
  const currentImages = (watch("image") as File[]) || [];

  // Map setup
  useEffect(() => {
    if (!mapContainer.current) return;
    mount(mapContainer.current);
    return () => unmount();
  }, [mount, unmount, mapContainer]);

  // Refetch từ localStorage
  useEffect(() => {
    if (!isSubmitted || !phone || submittedData) return;
    const refetch = async () => {
      try {
        const raw = (await requestService.lookup(
          phone,
        )) as unknown as CitizenLookupData;
        setStatus(raw.status);
        setUrgency(raw.urgency ?? null);
        setImageUrls(raw.images?.map((img: RescueImage) => img.imageUrl) ?? []);
        setSubmittedData({
          name: raw.citizenName,
          phone: raw.citizenPhone,
          type: raw.type ?? "",
          address: raw.address ?? "",
          locate:
            raw.latitude && raw.longitude
              ? `${raw.latitude}, ${raw.longitude}`
              : "",
          description: raw.description ?? "",
          url: raw.additionalLink ?? "",
          image: undefined,
        });
      } catch (e) {
        console.error("Lỗi refetch:", e);
      }
    };
    refetch();
  }, [isSubmitted, phone, submittedData]);

  // Cắm cờ sau submit
  useEffect(() => {
    if (!map || !isSubmitted || !submittedData?.locate) return;
    const [lat, lng] = submittedData.locate
      .split(",")
      .map((v) => Number(v.trim()));
    if (isNaN(lat) || isNaN(lng)) return;
    markerRef.current?.remove();
    markerRef.current = new vietmapgl.Marker({ color: "#EF4444" })
      .setLngLat([lng, lat])
      .addTo(map);
    map.flyTo({ center: [lng, lat], zoom: 16 });
  }, [map, isSubmitted, submittedData?.locate]);

  // Popup kéo cờ
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

  // Drag marker
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

  // ── Default marker (HCMC) ─────────────────────────────
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

  // ── Dialog edit fill values ───────────────────────────
  useEffect(() => {
    if (!isDialogOpen || !submittedData) return;
    (
      [
        "name",
        "phone",
        "type",
        "address",
        "locate",
        "description",
        "url",
      ] as const
    ).forEach((k) => setValue(k, submittedData[k] ?? ""));
  }, [isDialogOpen, submittedData, setValue]);

  // ── Image preview ─────────────────────────────────────
  const previews = useMemo(() => {
    const images = (watch("image") as File[]) || [];
    return images.map((f) => URL.createObjectURL(f));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("image")]);
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const submittedPreviews = useMemo(() => {
    const imgs = (submittedData?.image as File[]) || [];
    return imgs.map((f) => URL.createObjectURL(f));
  }, [submittedData?.image]);
  useEffect(
    () => () => submittedPreviews.forEach(URL.revokeObjectURL),
    [submittedPreviews],
  );

  // ── Handlers ──────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const total = [...currentImages, ...files];
    setValue("image", total.length > 3 ? total.slice(0, 3) : total, {
      shouldValidate: true,
    });
    if (total.length > 3) alert("Bạn chỉ được tải lên tối đa 3 ảnh");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveImage = (i: number) => {
    const updated = currentImages.filter((_, idx) => idx !== i);
    setValue("image", updated.length > 0 ? updated : undefined, {
      shouldValidate: true,
    });
  };

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

  const onSubmit = async (data: RequestSchemaType) => {
    try {
      if (isSubmitted && requestId) {
        // Cập nhật
        const formData = buildUpdateFormData(requestId, data);
        await requestService.update(formData);
        alert("Cập nhật thông tin thành công!");
        setIsDialogOpen(false);
      } else {
        // Gửi mới
        const formData = buildSubmitFormData(data);
        const response = await requestService.submit(formData);
        if (response?.requestId) setRequestId(response.requestId);
        if (response?.status) setStatus(response.status);
        alert("Gửi yêu cầu thành công!");
        setIsSubmitted(true);
        setPhone(data.phone);
        localStorage.setItem(
          RESCUE_STORAGE_KEYS.REQUEST_ID,
          response.requestId,
        );
        localStorage.setItem(RESCUE_STORAGE_KEYS.PHONE, data.phone);
      }
      setSubmittedData(data);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleCancelRequest = () => {
    reset();
    setSubmittedData(null);
    setIsSubmitted(false);
    setRequestId(null);
    setValue("image", undefined);
    markerRef.current?.remove();
    popupRef.current?.remove();
    popupRef.current = null;
    localStorage.removeItem("rescue_requestId");
    localStorage.removeItem("rescue_phone");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA")
      e.preventDefault();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        name: submittedData?.name || "Bạn",
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: chatInput,
        colorClass: "text-gray-700",
        bgClass: "bg-gray-200 text-gray-800",
      },
    ]);
    setChatInput("");
  };

  return {
    inputRef,
    isSubmitted,
    submittedData,
    isDialogOpen,
    requestId,
    status,
    urgency,
    imageUrls,
    setIsDialogOpen,
    activeTab,
    setActiveTab,
    isChatOpen,
    setIsChatOpen,
    chatInput,
    setChatInput,
    chatMessages,
    register,
    setValue,
    errors,
    isSubmitting,
    selectedType,
    previews,
    submittedPreviews,
    handleFileChange,
    handleRemoveImage,
    handleGetLocation,
    handleConfirmAddress,
    handleCancelRequest,
    handleKeyDown,
    handleSendMessage,
    onSubmitForm: handleSubmit(onSubmit),
  };
};
