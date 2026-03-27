import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import {
  requestService,
  buildSubmitFormData,
  buildUpdateFormData,
} from "@/services/User/requestService";
import { useChatbox } from "@/hooks/useChatBox";
import {
  requestSchema,
  type RequestSchemaType,
} from "@/validations/user.request.schema";
import type { CitizenLookupData, ChatMessage } from "@/types/request";
import type { RescueImage } from "@/types/apiRescue";
import { RESCUE_STORAGE_KEYS } from "@/constants/request.constants";
import { useRequestMap } from "./useRequestMap";
import { useRequestImages } from "./useRequestImages";

export const useRequestController = (
  mapContainer: React.RefObject<HTMLDivElement | null>,
) => {
  const location = useLocation();
  const routeState = location.state;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("address");
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
  const { fetchMessage, sendMessage } = useChatbox();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatTick, setChatTick] = useState(0);

  useEffect(() => {
    if (!isChatOpen) return;
    const intervalId = setInterval(() => {
      setChatTick((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [isChatOpen]);

  // Form
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
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

  const selectedType = useWatch({ control, name: "type" });
  // sub hook
  const images = useRequestImages({
    control,
    setValue,
    getValues,
    initialServerImages: routeState?.serverImages ?? [],
  });

  const map = useRequestMap({
    mapContainer,
    isSubmitted,
    getValues,
    setValue,
    setActiveTab,
    submittedLocate: submittedData?.locate,
  });

  //Refetch từ localStorage
  const { serverImages, setServerImages, setPendingDeleteImageIds } = images;

  useEffect(() => {
    if (!isSubmitted || !phone || submittedData !== null) return;

    const refetch = async () => {
      try {
        const raw = (await requestService.lookup(
          phone,
        )) as unknown as CitizenLookupData;
        setStatus(raw.status);
        setUrgency(raw.urgency ?? null);
        setServerImages(
          raw.images?.map((img: RescueImage) => ({
            id: img.id,
            url: img.imageUrl,
          })) ?? [],
        );
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
  }, [isSubmitted, phone, submittedData, setServerImages]);

  // Dialog snapshot
  const serverImagesSnapshotRef = useRef<{ id: string; url: string }[]>([]);
  const hasDialogOpenedRef = useRef(false);

  useEffect(() => {
    if (isDialogOpen) {
      hasDialogOpenedRef.current = true;
      serverImagesSnapshotRef.current = serverImages;
      if (!submittedData) return;
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
    } else if (hasDialogOpenedRef.current) {
      setServerImages(serverImagesSnapshotRef.current);
      setPendingDeleteImageIds([]);
      setValue("image", undefined);
    }
  }, [
    isDialogOpen,
    submittedData,
    setValue,
    serverImages,
    setServerImages,
    setPendingDeleteImageIds,
  ]);

  useEffect(() => {
    if (!isChatOpen || !requestId) return;
    const load = async () => {
      const rows = await fetchMessage(String(requestId), "citizen");
      setChatMessages(
        rows.map((msg) => {
          const isUser = msg.senderRole === "người dân";
          return {
            id:
              Number(String(msg.id).slice(0, 12).replace(/\D/g, "")) ||
              Date.now(),
            role: isUser ? "user" : "staff",
            name: msg.senderName,
            time: new Date(msg.sentAt).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            text: msg.content,
            colorClass: isUser ? "text-gray-700" : "text-indigo-600",
            bgClass: isUser
              ? "bg-gray-200 text-gray-800"
              : "bg-indigo-600 text-white",
          };
        }),
      );
    };
    load();
  }, [isChatOpen, requestId, fetchMessage, chatTick]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !requestId) return;
    const sent = await sendMessage(String(requestId), "", chatInput, "citizen");
    if (!sent) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id:
          Number(String(sent.id).slice(0, 12).replace(/\D/g, "")) || Date.now(),
        role: "user",
        name: sent.senderName,
        time: new Date(sent.sentAt).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: sent.content,
        colorClass: "text-gray-700",
        bgClass: "bg-gray-200 text-gray-800",
      },
    ]);
    setChatInput("");
  };

  // Submit
  const onSubmit = async (data: RequestSchemaType) => {
    try {
      if (isSubmitted && requestId) {
        await requestService.update(
          buildUpdateFormData(requestId, data, images.pendingDeleteImageIds),
        );
        if (phone) {
          const raw = (await requestService.lookup(
            phone,
          )) as unknown as CitizenLookupData;
          const newImages =
            raw.images?.map((img: RescueImage) => ({
              id: img.id,
              url: img.imageUrl,
            })) ?? [];
          images.setServerImages(newImages);
          serverImagesSnapshotRef.current = newImages;
          images.setPendingDeleteImageIds([]);
          setValue("image", undefined);
        }
        alert("Cập nhật thông tin thành công!");
        setIsDialogOpen(false);
      } else {
        const response = await requestService.submit(buildSubmitFormData(data));
        if (response?.requestId) setRequestId(response.requestId);
        if (response?.status) setStatus(response.status);
        alert("Gửi yêu cầu thành công!");
        setIsSubmitted(true);
        setPhone(data.phone);

        const raw = (await requestService.lookup(
          data.phone,
        )) as unknown as CitizenLookupData;

        const newServerImages =
          raw.images?.map((img: RescueImage) => ({
            id: img.id,
            url: img.imageUrl,
          })) ?? [];

        images.setServerImages(newServerImages);
        serverImagesSnapshotRef.current = newServerImages;

        localStorage.setItem(
          RESCUE_STORAGE_KEYS.REQUEST_ID,
          response.requestId,
        );
        localStorage.setItem(RESCUE_STORAGE_KEYS.PHONE, data.phone);
        setValue("image", undefined);
      }
      setSubmittedData({ ...data, image: undefined });
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
    images.setServerImages([]);
    images.setPendingDeleteImageIds([]);
    setValue("image", undefined);
    map.markerRef.current?.remove();
    map.popupRef.current?.remove();
    localStorage.removeItem("rescue_requestId");
    localStorage.removeItem("rescue_phone");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA")
      e.preventDefault();
  };
  const handleFormSubmit = (e?: React.BaseSyntheticEvent) => {
    return handleSubmit(onSubmit)(e);
  };

  return {
    // form
    register,
    setValue,
    errors,
    isSubmitting,
    selectedType,
    onSubmitForm: handleFormSubmit,
    handleKeyDown,
    // state
    isSubmitted,
    submittedData,
    requestId,
    status,
    urgency,
    isDialogOpen,
    setIsDialogOpen,
    activeTab,
    setActiveTab,
    handleCancelRequest,
    // map
    handleGetLocation: map.handleGetLocation,
    handleConfirmAddress: map.handleConfirmAddress,
    ...images,
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    chatInput,
    setChatInput,
    handleSendMessage,
  };
};
