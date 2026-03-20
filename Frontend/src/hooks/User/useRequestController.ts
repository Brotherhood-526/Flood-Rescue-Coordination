import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  requestSchema,
  type RequestSchemaType,
} from "@/validations/user.request.schema";
import { useVietMap } from "@/lib/MapProvider";
import vietmapgl from "@vietmap/vietmap-gl-js";
import {
  reverseGeocode,
  geocodeAddress,
  submitRescueRequest,
  updateRescueRequest,
} from "@/services/User/requestService";
import type { ChatMessage } from "@/pages/User/ChatBoxDialog";
import { useLocation } from "react-router-dom";
import apiClient from "@/services/axiosClient";

export const useRequestController = (
  mapContainer: React.RefObject<HTMLDivElement | null>,
) => {
  const location = useLocation();
  const routeState = location.state;
  const inputRef = useRef<HTMLInputElement>(null);
  const markerRef = useRef<vietmapgl.Marker | null>(null);
  const { map, mount, unmount } = useVietMap();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("address");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "coordinator",
      name: "Điều phối viên",
      time: "Hard code",
      text: "Happy new year",
      colorClass: "text-[#3b82f6]",
      bgClass: "bg-[#3b82f6]",
    },
    {
      id: 2,
      role: "team",
      name: "Đội cứu hộ",
      time: "Hard code",
      text: "Happy birthday.",
      colorClass: "text-[#6366f1]",
      bgClass: "bg-[#6366f1]",
    },
  ]);

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
  const popupRef = useRef<vietmapgl.Popup | null>(null);

  const showDragPopup = useCallback(
    (lngLat: [number, number]) => {
      popupRef.current?.remove();
      popupRef.current = new vietmapgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 35,
      })
        .setLngLat(lngLat)
        .setHTML(
          `<div style="font-family: sans-serif; text-align: center; font-size: 12px; font-weight:600; color: #374151;">
                  Bạn có thể kéo cờ để chọn vị trí chính xác nhất.
          </div>`,
        )
        .addTo(map!);
    },
    [map],
  );
  // Refetch khi có localStorage nhưng không có routeState
  useEffect(() => {
    if (!isSubmitted || !phone || submittedData) return;
    const refetch = async () => {
      try {
        const res = await apiClient.post("/citizen/lookup", {
          citizenPhone: phone,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = res as any;
        setStatus(raw.status);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setImageUrls(raw.images?.map((img: any) => img.imageUrl) ?? []);
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

  // Refetch khi có localStorage nhưng không có routeState
  useEffect(() => {
    if (!isSubmitted || !phone || submittedData) return;
    const refetch = async () => {
      try {
        const res = await apiClient.post("/citizen/lookup", {
          citizenPhone: phone,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = res as any;
        setStatus(raw.status);
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

  // cái map
  useEffect(() => {
    if (!mapContainer.current) return;
    mount(mapContainer.current);
    return () => unmount();
  }, [mount, unmount, mapContainer]);

  // Cắm lại cờ trên bản đồ
  useEffect(() => {
    if (!map || !isSubmitted || !submittedData?.locate) return;
    const [lat, lng] = submittedData.locate
      .split(",")
      .map((item) => Number(item.trim()));
    if (isNaN(lat) || isNaN(lng)) return;
    markerRef.current?.remove();
    markerRef.current = new vietmapgl.Marker({ color: "#EF4444" })
      .setLngLat([lng, lat])
      .addTo(map);
    map.flyTo({ center: [lng, lat], zoom: 16 });
  }, [map, isSubmitted, submittedData?.locate]);

  useEffect(() => {
    if (isDialogOpen && submittedData) {
      setValue("name", submittedData.name ?? "");
      setValue("phone", submittedData.phone ?? "");
      setValue("type", submittedData.type ?? "");
      setValue("address", submittedData.address ?? "");
      setValue("locate", submittedData.locate ?? "");
      setValue("description", submittedData.description ?? "");
      setValue("url", submittedData.url ?? "");
    }
  }, [isDialogOpen, submittedData, setValue]);

  // image preview
  const previews = useMemo(() => {
    if (!currentImages?.length) return [];
    return currentImages.map((file) => URL.createObjectURL(file));
  }, [currentImages]);

  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews],
  );

  const submittedPreviews = useMemo(() => {
    const images = (submittedData?.image as File[]) || [];
    if (!images?.length) return [];
    return images.map((file) => URL.createObjectURL(file));
  }, [submittedData?.image]);

  useEffect(
    () => () => submittedPreviews.forEach((url) => URL.revokeObjectURL(url)),
    [submittedPreviews],
  );

  const attachDraggable = useCallback(
    (marker: vietmapgl.Marker) => {
      marker.on("dragend", async () => {
        const { lng, lat } = marker.getLngLat();
        setValue("locate", `${lat.toFixed(6)}, ${lng.toFixed(6)}`, {
          shouldValidate: true,
        });
        try {
          const address = await reverseGeocode(lat, lng);
          if (address) {
            setValue("address", address, { shouldValidate: true });
            setActiveTab("address");
            showDragPopup([lng, lat]);
          }
        } catch (err) {
          console.error(err);
        }
      });
    },
    [setValue, setActiveTab, showDragPopup],
  );

  useEffect(() => {
    if (!map || isSubmitted || getValues("locate")) return;

    const HCMC_CENTER: [number, number] = [106.7009, 10.7769];

    markerRef.current?.remove();

    markerRef.current = new vietmapgl.Marker({
      color: "#3B82F6",
      draggable: true,
    })
      .setLngLat(HCMC_CENTER)
      .addTo(map);

    map.flyTo({ center: HCMC_CENTER, zoom: 14 });
    const initDefaultLocation = async () => {
      setValue("locate", `${HCMC_CENTER[1]}, ${HCMC_CENTER[0]}`, {
        shouldValidate: true,
      });
      try {
        const address = await reverseGeocode(HCMC_CENTER[1], HCMC_CENTER[0]);
        if (address) {
          setValue("address", address, { shouldValidate: true });
        }
        showDragPopup(HCMC_CENTER);
      } catch (err) {
        console.error("Lỗi lấy địa chỉ mặc định:", err);
      }
    };
    initDefaultLocation();
    attachDraggable(markerRef.current);
  }, [map, isSubmitted, getValues, setValue, attachDraggable]);

  // HANDLERS
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const totalImages = [...currentImages, ...files];
    setValue(
      "image",
      totalImages.length > 3 ? totalImages.slice(0, 3) : totalImages,
      { shouldValidate: true },
    );
    if (totalImages.length > 3) alert("Bạn chỉ được tải lên tối đa 3 ảnh");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = currentImages.filter((_, i) => i !== indexToRemove);
    setValue("image", updated.length > 0 ? updated : undefined, {
      shouldValidate: true,
    });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation)
      return alert("Trình duyệt không hỗ trợ định vị");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
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
          const address = await reverseGeocode(lat, lng);
          if (address) {
            setValue("address", address, { shouldValidate: true });
            setActiveTab("address");
          }
        } catch (error) {
          console.error("Lỗi reverse geocode:", error);
        }
      },
      () => alert("Bạn chưa cấp quyền định vị"),
    );
  };

  const [imageUrls, setImageUrls] = useState<string[]>(
    routeState?.imageUrls ?? [],
  );

  const handleConfirmAddress = async () => {
    const address = getValues("address");
    if (!address?.trim())
      return alert("Vui lòng nhập địa chỉ trước khi xác nhận!");
    try {
      const coords = await geocodeAddress(address);
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
    } catch (error) {
      console.error("Lỗi tìm tọa độ:", error);
    }
  };

  const onSubmit = async (data: RequestSchemaType) => {
    try {
      const formData = new FormData();

      if (isSubmitted && requestId) {
        formData.append("requestId", String(requestId));
        formData.append("Type", data.type);
        formData.append("address", data.address);
        formData.append("description", data.description);
        formData.append("citizenName", data.name);
        formData.append("citizenPhone", data.phone);
        if (data.url) formData.append("additionLink", data.url);
        if (data.locate) {
          const [lat, lng] = data.locate.split(",").map((s) => s.trim());
          formData.append("latitude", lat);
          formData.append("longitude", lng);
        }
        if (data.image?.length) {
          data.image.forEach((file) => formData.append("images", file));
        }
        await updateRescueRequest(requestId, formData);
        alert("Cập nhật thông tin thành công!");
        setIsDialogOpen(false);
      } else {
        formData.append("type", data.type);
        formData.append("address", data.address);
        formData.append("description", data.description);
        formData.append("name", data.name);
        formData.append("phone", data.phone);
        if (data.url) formData.append("additionalLink", data.url);
        if (data.locate) {
          const [lat, lng] = data.locate.split(",").map((s) => s.trim());
          formData.append("latitude", lat);
          formData.append("longitude", lng);
        }
        if (data.image?.length) {
          data.image.forEach((file) => formData.append("images", file));
        }
        const response = await submitRescueRequest(formData);
        if (response?.requestId) setRequestId(response.requestId);
        if (response?.status) setStatus(response.status);
        alert("Gửi yêu cầu thành công!");
        setIsSubmitted(true);
        setPhone(data.phone);
        localStorage.setItem("rescue_requestId", response.requestId);
        localStorage.setItem("rescue_phone", data.phone);
      }

      setSubmittedData(data);
    } catch (error) {
      console.log(error);
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
    localStorage.removeItem("rescue_requestId");
    localStorage.removeItem("rescue_phone");
    popupRef.current?.remove();
    popupRef.current = null;
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
    handleSubmit,
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
    onSubmit,
  };
};
